
import { Injectable } from "@angular/core";
import { Client, StompSubscription } from '@stomp/stompjs';
import { reviewModel } from "../models/reviews.model";
import { reviewReplies } from "../models/ReviewReplies.model";
import { BehaviorSubject, catchError, filter, map, Observable, of, switchMap, tap } from "rxjs";
import * as SockJS from 'sockjs-client';
import { HttpClient } from "@angular/common/http";
import { AuthServiceComponent } from "../core/services/auth-service.component";
@Injectable({
    providedIn: "root"
})
export class WebSocketService {
    private stompClient!: Client;
    private reviewSubscription: StompSubscription | null = null;
    private replySubscription: StompSubscription | null = null;
    private tokenSubscription: StompSubscription | null = null;
    private pendingMessages: any[] = []; // Lưu trữ yêu cầu WebSocket chưa gửi
    private reviewSubject = new BehaviorSubject<reviewModel | null>(null);
    private replySubject = new BehaviorSubject<reviewReplies[]>([]);
    cdr: any;

    constructor(private http: HttpClient, private auth: AuthServiceComponent) {

        this.initWebSocket();
    }

    private async initWebSocket() {
        if (this.stompClient && this.stompClient.active) {
            console.log("🔴 Đóng kết nối cũ trước khi mở kết nối mới...");
            await this.stompClient.deactivate(); // Đóng kết nối cũ
        }

        const token = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken')
        const { Client } = await import("@stomp/stompjs");
        const { default: SockJS } = await import("sockjs-client");

        const socket = new SockJS("http://localhost:8080/ws");
        this.stompClient = new Client({
            webSocketFactory: () => socket as any,
            debug: (msg) => console.log(msg),
            reconnectDelay: 40000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            connectHeaders: {
                Authorization: `Bearer ${token}`,  // Thêm token vào headers
                'Authorization-Refresh': localStorage.getItem('refreshToken') || ''
            }
        });

        this.stompClient.onConnect = () => {
            console.log("Connected to WebSocket via SockJS");
        };

        this.stompClient.onStompError = (frame) => {
            console.error("Broker reported error: " + frame.headers["message"]);
            console.error("Additional details: " + frame.body);
        };
        console.log("kết nối websocket thành công");
        this.stompClient.activate();
    }
    private retryPendingMessages(token: string) {
        while (this.pendingMessages.length > 0) {
            const review = this.pendingMessages.shift();
            this.sendReview(review); // Gửi lại yêu cầu bị chặn
        }
    }
    private refreshTokenAndRetry(): Observable<boolean> {
        return this.auth.refreshToken().pipe(
            tap((response) => {
                if (response && response.accessToken) {
                    console.log("Token mới đã được lấy");
                    localStorage.setItem('accessToken', response.accessToken);
                    localStorage.setItem('Authorization-Refresh', response.refreshToken)
                    this.retryPendingMessages(response.accessToken); // Gửi lại các tin nhắn chờ
                } else {
                    console.error("Không thể làm mới token: Response không hợp lệ");
                }
            }),
            map(response => !!response && !!response.accessToken), // Trả về true nếu refresh thành công
            catchError((error) => {
                console.error("Không thể làm mới token:", error);
                return of(false);
            })
        );
    }
    // chờ đợi sau khi websocket kết nối xong
    async subscribeReviewsToDoctor(doctorId: number) {
        await this.ensureWebSocketConnected();

        if (!this.stompClient || !this.stompClient.connected) {
            console.error("WebSocket client (stompClient) chưa sẵn sàng!");
            return;
        }

        if (this.reviewSubscription) {
            this.reviewSubscription.unsubscribe();
        }

        const channel = `/topic/profile/${doctorId}`;
        console.log(`Đăng ký nhận review từ WebSocket: ${channel}`);

        this.reviewSubscription = this.stompClient.subscribe(channel, message => {
            const newReview: reviewModel = JSON.parse(message.body);
            console.log("Dữ liệu được nhận được sau đăng kí là: " + newReview);
            this.reviewSubject.next(newReview);
            console.log(newReview)
        });
    }

    private ensureWebSocketConnected(): Promise<void> {
        return new Promise((resolve) => {
            if (this.stompClient && this.stompClient.connected) {
                resolve();
            } else {
                console.log("Chờ WebSocket kết nối...");
                const interval = setInterval(() => {
                    if (this.stompClient && this.stompClient.connected) {
                        clearInterval(interval);
                        resolve();
                    }
                }, 500);
            }
        });
    }
    // subscribeReviewsToDoctor(doctorId: number, reviews: reviewModel[]) {
    //     if (!this.stompClient) {
    //         console.error("WebSocket client (stompClient) chưa được khởi tạo!");
    //         return;
    //     }
    //     console.log("Gọi tới đây")
    //     if (this.reviewSubscription) {
    //         this.reviewSubscription.unsubscribe();
    //     }
    //     console.log("Đăng kí nhận review")
    //     const channel = `/topic/profile/${doctorId}`;
    //     console.log(`Đăng ký nhận review từ WebSocket: ${channel}`);
    //     this.reviewSubscription = this.stompClient.subscribe(channel, message => {
    //         const newReview: reviewModel = JSON.parse(message.body);
    //         reviews.unshift(newReview);
    //         console.log("nhận được review mới: " + newReview)
    //     });
    // }

    // subscribeRepliesToDoctor(doctorId: number) {
    //     if (this.replySubscription) {
    //         this.replySubscription?.unsubscribe();
    //     }

    //     const channel = `/topic/profile/${doctorId}/replies`;
    //     this.replySubscription = this.stompClient.subscribe(channel, message => {
    //         const newReply: reviewReplies = JSON.parse(message.body);
    //         this.replySubject.next([...this.replySubject.value, newReply]);
    //     });
    // }
    sendReview(review: reviewModel): Observable<any> {
        const token = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken')
        console.log("fontend gọi thêm review")
        return new Observable(observer => {
            this.stompClient.publish({
                destination: '/app/user/review/add',
                body: JSON.stringify(review),
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            // Lắng nghe phản hồi từ server trên `/topic/reviewer/{userId}`
            const subscription = this.stompClient.subscribe(`/topic/reviewer/${review.appointment?.appointmentId}`, (message) => {
                const response = JSON.parse(message.body);
                console.log("📌 Nhận phản hồi từ WebSocket:", response);
                observer.next(response);  // Trả về dữ liệu nhận được
                observer.complete();  // Kết thúc observable
            });

            // Hủy subscribe nếu không nhận được phản hồi
            return () => subscription.unsubscribe();
        });
    }
    // đăng kí lắng nghe phản hồi từ server để xử lý
    async listenStatusOfToekn() {
        // đợi cho websocket kết nối thành công
        await this.ensureWebSocketConnected();
        // đăng kí nhận subscribe
        if (!this.stompClient || !this.stompClient.connected) {
            console.error("WebSocket client (stompClient) chưa sẵn sàng!");
            return;
        }

        if (this.reviewSubscription) {
            this.reviewSubscription.unsubscribe();
        }
        var channel = "/topic/queue/errors";
        this.tokenSubscription = this.stompClient.subscribe(channel, (message) => {
            const errorResponse = JSON.parse(message.body);

            if (errorResponse.status === 401) {
                console.log("Token hết hạn hoặc không hợp lệ. Đăng xuất...");

                //  this.logout(); // Xử lý đăng xuất
            } else if (errorResponse.status === 403) {
                console.log("Token cần làm mới. Đang gọi API refresh...");
                this.refreshTokenAndRetry();
            }
        });
    }

    getReview(): Observable<reviewModel> {
        return this.reviewSubject.asObservable().pipe(filter(review => review !== null)) as Observable<reviewModel>;
    }
    getReplies(): Observable<reviewReplies[]> {
        return this.replySubject.asObservable();
    }
    disconnect() {
        if (this.stompClient) {
            this.stompClient.deactivate();
        }
    }
}


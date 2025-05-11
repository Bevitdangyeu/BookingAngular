
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
    private replySubscriptions: Map<number, StompSubscription> = new Map();
    private tokenSubscription: StompSubscription | null = null;
    private pendingMessages: any[] = []; // Lưu trữ yêu cầu WebSocket chưa gửi
    private reviewSubject = new BehaviorSubject<reviewModel | null>(null);
    private replySubject = new BehaviorSubject<reviewReplies | null>(null);
    private subscribedReplies: Set<number> = new Set();
    cdr: any;

    constructor(private http: HttpClient, private auth: AuthServiceComponent) {

        this.initWebSocket();
    }

    private async initWebSocket() {
        if (this.stompClient && this.stompClient.active) {
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
        };
        console.log("kết nối websocket thành công");
        this.stompClient.activate();
    }
    // đảm bảo websocket được kết nối thành công
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
            // chỉ có một giá trị newreview được phát ra cho tất cả các subcribe và giá trị cũ sẽ bị ghi đè khi có giá trị mới thêm vào
            this.reviewSubject.next(newReview);
            console.log(newReview)
        });
    }


    // đăng kí nhận bình luận cho trả lời bình luận
    subscribeRepliesToDoctor(reviewId: number) {
        // if (this.replySubscription) {
        //     this.replySubscription?.unsubscribe(); 
        // }
        if (this.replySubscriptions.has(reviewId)) {
            // Đã đăng ký rồi
            return;
        }

        const channel = `/topic/replies/${reviewId}`;
        console.log(`Đăng ký nhận replies từ WebSocket: ${channel}`);

        const subscription = this.stompClient.subscribe(channel, message => {
            const newReply: reviewReplies = JSON.parse(message.body);
            console.log("Giá trị nhận được từ server là:", newReply);
            this.replySubject.next(newReply);
        });

        // Lưu lại subscription để tránh trùng
        this.replySubscriptions.set(reviewId, subscription);
    }
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

            // Lắng nghe phản hồi từ server trên `/topic/reviewer/{userId}` để xem thành công hay không và hiển thị thông báo cho người dùng, tức là đăng kí lắng nghe phản hồi ngay tại đây
            const subscription = this.stompClient.subscribe(`/topic/reviewer/${review.appointment?.appointmentId}`, (message) => {
                const response = JSON.parse(message.body);
                console.log(" Nhận phản hồi từ WebSocket:", response);
                observer.next(response);  // Trả về dữ liệu nhận được
                observer.complete();  // Kết thúc observable
            });

            // Hủy subscribe nếu không nhận được phản hồi
            return () => subscription.unsubscribe();
        });
    }
    // hàm update review
    updateReview(review: reviewModel): Observable<any> {
        const token = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        console.log("frontend gọi sửa review");
        return new Observable(observer => {
            try {
                console.log("trước khi gọi");
                if (this.stompClient && this.stompClient.connected) {
                    this.stompClient.publish({
                        destination: '/app/user/review/update',
                        body: JSON.stringify(review),
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    });
                    console.log("gọi sửa review thành công");

                    // const subscription = this.stompClient.subscribe(`/topic/reviewer/${review.appointment?.appointmentId}`, (message) => {
                    //     const response = JSON.parse(message.body);
                    //     console.log(" Nhận phản hồi từ WebSocket:", response);
                    //     observer.next(response);  // Trả về dữ liệu nhận được
                    //     observer.complete();  // Kết thúc observable
                    // });

                    // return () => subscription.unsubscribe(); // ✅ hợp lệ
                    return
                } else {
                    console.warn("WebSocket chưa kết nối!");
                    observer.error("WebSocket chưa kết nối!");
                    return; // ✅ thêm return ở đây
                }
            } catch (error) {
                console.error("Lỗi khi gửi review:", error);
                observer.error(error);
                return; // ✅ thêm return ở đây
            }
        });
    }

    // hàm thêm reviewReplies
    sendReviewReplies(reviewReplies: reviewReplies) {
        const token = localStorage.getItem('accessToken');
        console.log("fontend gọi thêm reviewreplies")
        console.log("Dữ liệu gửi đi:", JSON.stringify(reviewReplies));
        console.log("Đang gửi tin nhắn đến:", this.stompClient);

        return new Observable(observe => {
            this.stompClient.publish({
                destination: '/app/user/replies/add',
                body: JSON.stringify(reviewReplies),
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            observe.next();  // Thông báo đã gửi xong
            observe.complete();  // Kết thúc Observable
        }).subscribe();
    }


    getReview(): Observable<reviewModel> {
        return this.reviewSubject.asObservable().pipe(filter(review => review !== null)) as Observable<reviewModel>;
    }
    getReplies(): Observable<reviewReplies> {
        console.log(" gọi tới get replies")
        return this.replySubject.asObservable().pipe(filter(review => review !== null)) as Observable<reviewReplies>;
    }
    disconnect() {
        if (this.stompClient) {
            this.stompClient.deactivate();
        }
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
}


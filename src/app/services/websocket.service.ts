// //dùng để đăng kí websocket để nhận được đánh giá và trả lời đánh giá
// import { Injectable } from "@angular/core";
// import { Client, StompSubscription } from '@stomp/stompjs';
// import { reviewModel } from "../models/reviews.model";
// import { reviewReplies } from "../models/ReviewReplies.model";
// import { Observable, Subject } from "rxjs";

// @Injectable({
//     providedIn: "root"
// })

// export class WebSocketService {
//     disconnect() {
//         throw new Error('Method not implemented.');
//     }
//     private stompClient: Client;
//     private reviewSubscription: StompSubscription | null = null; // để lưu subscription hiện tại
//     private replySubscription: StompSubscription | null = null;
//     private replySubject = new Subject<reviewReplies>();
//     constructor() {
//         this.stompClient = new Client({
//             brokerURL: 'ws://localhost:8080/ws/',
//         });
//         this.stompClient.onConnect = () => {
//             console.log('Connected to WebSocket');
//         };
//         this.stompClient.activate();
//     }
//     // đăng kí nhận review và reply theo id bác sĩ
//     subscribeReviewsToDOctor(doctorId: number, reviews: reviewModel[]) {
//         if (this.reviewSubscription) {
//             this.reviewSubscription.unsubscribe();
//         }

//         // tạo một kênh ( url ) (giống như đăng kí url để nhận thông tin) để nhận tin mới khi server gửi đến
//         const channel = `/topic/profile/${doctorId}`;
//         // bắt đầu đăng kí kênh subscribe
//         this.reviewSubscription = this.stompClient.subscribe(channel, message => {
//             // Chuyển đổi dữ liệu nhận được về kiểu ReviewReplies
//             const newReply: reviewModel = JSON.parse(message.body);
//             reviews.unshift(newReply)
//         })
//     }

//     subscribeRepliesToDoctor(doctorId: number) {
//         if (this.replySubscription) {
//             this.replySubscription?.unsubscribe();
//         }
//         const channel = `/topic/profile/${doctorId}/replies`;
//         this.stompClient.subscribe(channel, message => {
//             const newReplies: reviewReplies = JSON.parse(message.body);
//             this.replySubject.next(newReplies);
//         })

//     }
//     getReplies(): Observable<reviewReplies> {
//         return this.replySubject.asObservable();
//     }


// }


// import { Injectable } from "@angular/core";
// import { Client } from '@stomp/stompjs';
// import * as SockJS from 'sockjs-client';
// import { StompSubscription } from "@stomp/stompjs";
// import { reviewModel } from "../models/reviews.model";
// import { reviewReplies } from "../models/ReviewReplies.model";
// import { BehaviorSubject, Observable, Subject } from "rxjs";

// @Injectable({
//     providedIn: "root"
// })
// export class WebSocketService {
//     disconnect() {
//         throw new Error('Method not implemented.');
//     }
//     private stompClient: Client;
//     private reviewSubscription: StompSubscription | null = null;
//     private replySubscription: StompSubscription | null = null;
//     private replySubject = new Subject<reviewReplies>();
//     private reviewSubject = new BehaviorSubject<any>(null);
//     constructor() {
//         this.stompClient = new Client({
//             brokerURL: 'ws://localhost:8080/ws', // Nếu dùng WebSocket thuần
//             // brokerURL: '/ws', // Nếu dùng SockJS
//             connectHeaders: {
//               login: 'guest',
//               passcode: 'guest',
//             },
//             debug: (msg) => console.log(msg),
//             reconnectDelay: 5000, // Tự động kết nối lại sau 5s nếu bị mất kết nối
//             heartbeatIncoming: 4000,
//             heartbeatOutgoing: 4000,
//           });

//         this.stompClient.onConnect = () => {
//             console.log("Connected to WebSocket using SockJS");
//         };

//         this.stompClient.onStompError = (frame) => {
//             console.error("Broker reported error: " + frame.headers["message"]);
//             console.error("Additional details: " + frame.body);
//         };

//         this.stompClient.activate();
//     }
//     sendReview(review: reviewModel) {
//         this.stompClient.publish({ destination: '/app/user/review/add', body: JSON.stringify(review) });
//     }
//     getReviewUpdates() {
//         return this.reviewSubject.asObservable();
//     }
//     subscribeReviewsToDoctor(doctorId: number, reviews: reviewModel[]) {
//         if (this.reviewSubscription) {
//             this.reviewSubscription.unsubscribe();
//         }

//         const channel = `/topic/profile/${doctorId}`;
//         this.reviewSubscription = this.stompClient.subscribe(channel, message => {
//             const newReply: reviewModel = JSON.parse(message.body);
//             reviews.unshift(newReply);
//         });
//     }

//     subscribeRepliesToDoctor(doctorId: number) {
//         if (this.replySubscription) {
//             this.replySubscription?.unsubscribe();
//         }

//         const channel = `/topic/profile/${doctorId}/replies`;
//         this.replySubscription = this.stompClient.subscribe(channel, message => {
//             const newReplies: reviewReplies = JSON.parse(message.body);
//             this.replySubject.next(newReplies);
//         });
//     }

//     getReplies(): Observable<reviewReplies> {
//         return this.replySubject.asObservable();
//     }
// }
import { Injectable } from "@angular/core";
import { Client, StompSubscription } from '@stomp/stompjs';
import { reviewModel } from "../models/reviews.model";
import { reviewReplies } from "../models/ReviewReplies.model";
import { BehaviorSubject, catchError, filter, Observable, of, switchMap } from "rxjs";
import * as SockJS from 'sockjs-client';
import { HttpClient } from "@angular/common/http";
@Injectable({
    providedIn: "root"
})
export class WebSocketService {
    private stompClient!: Client;
    private reviewSubscription: StompSubscription | null = null;
    private replySubscription: StompSubscription | null = null;
    private pendingMessages: any[] = []; // Lưu trữ yêu cầu WebSocket chưa gửi
    private reviewSubject = new BehaviorSubject<reviewModel | null>(null);
    private replySubject = new BehaviorSubject<reviewReplies[]>([]);
    cdr: any;

    constructor(private http: HttpClient) {
        this.initWebSocket();
    }

    private async initWebSocket() {
        const token = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken')
        const { Client } = await import("@stomp/stompjs");
        const { default: SockJS } = await import("sockjs-client");

        const socket = new SockJS("http://localhost:8080/ws");
        this.stompClient = new Client({
            webSocketFactory: () => socket as any,
            debug: (msg) => console.log(msg),
            reconnectDelay: 5000,
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

    private handleWebSocketError(error: any, review: any) {
        if (error.status === 403) { // Nếu lỗi là 403, cần làm mới token
            console.warn("⚠️ Token hết hạn, cần làm mới...");
            this.pendingMessages.push(review); // Lưu yêu cầu bị lỗi vào danh sách chờ

            this.refreshToken().subscribe(newToken => {
                if (newToken) {
                    console.log("✅ Token mới đã có, gửi lại yêu cầu");
                    this.retryPendingMessages(newToken);
                } else {
                    console.error("🚫 Không thể làm mới token");
                }
            });
        }
    }
    private refreshToken(): Observable<string | null> {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            console.error("🚫 Không tìm thấy refresh token");
            return of(null);
        }

        return this.http.post<any>('/auth/refresh', { refreshToken }).pipe(
            switchMap((response) => {
                console.log("✅ Token mới đã được lấy");
                localStorage.setItem('accessToken', response.accessToken);
                return of(response.accessToken);
            }),
            catchError((error) => {
                console.error("❌ Không thể làm mới token:", error);
                return of(null);
            })
        );
    }
    private retryPendingMessages(token: string) {
        while (this.pendingMessages.length > 0) {
            const review = this.pendingMessages.shift();
            this.sendReview(review); // Gửi lại yêu cầu bị chặn
        }
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
    sendReview(review: reviewModel) {
        console.log("fontend gọi thêm review")
        this.stompClient.publish({ destination: '/app/user/review/add', body: JSON.stringify(review) });
    }

    getReviewUpdates(): Observable<reviewModel> {
        return this.reviewSubject.asObservable().pipe(filter(review => review !== null)) as Observable<reviewModel>;
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


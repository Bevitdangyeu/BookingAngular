import { appointmentModel } from "./appoinment.model";
import { DoctorModel } from "./doctor.model";
import { userModel } from "./user.model";
import { reviewReplies } from "./ReviewReplies.model";
export interface reviewModel {
    reviewsId?: number;
    content: string;
    createAt?: Date;
    updateAt?: Date;
    user?: Partial<userModel>;
    doctor?: Partial<DoctorModel>; // partial giúp cho đối tượng doctor k cần phải có đầy đủ các thuộc tính, có thể chỉ cần gán 1 hoặc 2 giá trị
    appointment?: Partial<appointmentModel>;
    start: number;
    replies?: reviewReplies[]
    showReplies?: boolean;

}
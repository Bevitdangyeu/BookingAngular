import { DoctorModel } from "./doctor.model";
import { TopicModel } from "./topic.model";
import { userModel } from "./user.model";

export interface PostModel {
    postId?: number;
    title: string;
    content: string;
    createAt?: Date;
    updateAt?: Date;
    image?: string;
    tag?: string;
    doctorDTO?: DoctorModel;
    like?: number;
    type?: string;
    category: TopicModel;
}
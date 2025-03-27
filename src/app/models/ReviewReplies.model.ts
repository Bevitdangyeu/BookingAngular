import { Timestamp } from "rxjs";
import { userModel } from "./user.model";
import { reviewModel } from "./reviews.model";

export interface reviewReplies {
    idReviewReplies: number;
    content: String;
    createAt: Date;
    updateAt: Date;
    user: userModel;
    reviews: reviewModel;
}
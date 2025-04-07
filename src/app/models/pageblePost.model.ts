import { PostModel } from "./post.model";

export interface PagebleModel {
    totalPages: number,
    currentPage: number,
    listPostDTO: PostModel[]
}
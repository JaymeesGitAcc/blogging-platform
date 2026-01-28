import type { Author } from "./post.types";

export interface Comment {
    _id: string,
    content: string,
    author: Author,
    post: string,
    createdAt: string,
    updatedAt?:string,
    __v?:string
}
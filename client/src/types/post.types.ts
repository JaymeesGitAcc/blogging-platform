export type Author = {
	authorId: string
	name: string
	email: string
}

export interface Post {
    postId: string
	title: string
	content: string
	imageUrl: string
	excerpt?: string
	author: Author
	status: "published" | "draft"
	tags: string[]
	createdAt: string
	updatedAt: string
	likes: string[]
	views: number
}

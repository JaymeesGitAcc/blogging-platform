export type Author = {
	_id: string
	name: string
	email: string
}

export type Image = {
	url: string,
	publicId: string
}

export interface Post {
	coverImage: Image
	_id: string
	title: string
	slug: string
	content: string
	excerpt: string
	author: Author
	status: "published" | "draft"
	tags: string[]
	views: number
	isDeleted: boolean
	createdAt: string
	updatedAt: string
	likes: string[]
}
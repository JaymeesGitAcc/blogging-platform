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

// {
//         "coverImage": {
//             "url": "https://res.cloudinary.com/dolxzljww/image/upload/v1768839415/zo4xevui9dwzjbhmazf7.jpg",
//             "publicId": "zo4xevui9dwzjbhmazf7"
//         },
//         "_id": "696e59f36504b5450d218c39",
//         "title": "Burger",
//         "slug": "burger",
//         "content": "Delicious burgers",
//         "excerpt": "Delicious burgers",
//         "author": {
//             "_id": "696dd9f9b8f9d273e8d5a93f",
//             "name": "Admin",
//             "email": "admin@example.com"
//         },
//         "status": "published",
//         "tags": [],
//         "views": 136,
//         "isDeleted": false,
//         "createdAt": "2026-01-19T16:21:07.841Z",
//         "updatedAt": "2026-01-23T06:53:13.261Z",
//         "__v": 60,
//         "likes": [
//             "696dd9f9b8f9d273e8d5a93f"
//         ]
//     }
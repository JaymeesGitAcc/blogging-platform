export interface StatsProps {
  totalUsers: number
  totalPosts: number
  totalComments: number
  totalLikes: number
  mostLikedPost: {
    id: string
    title: string
    slug: string
    coverImage: string
    likesCount: number
    authorName: string
  }
  mostCommentedPost: {
    id: string
    title: string
    slug: string
    commentsCount: number
    authorName: string
  }
  mostViewedPost: {
    id: string
    title: string
    slug: string
    views: number
    coverImage: string
    authorName: string
  }
  topAuthor: {
    id: string
    name: string
    email: string
    postCount: number
  }
  recentUsers: [
    {
      _id: string
      name: string
      email: string
      createdAt: string
    }
  ]
}

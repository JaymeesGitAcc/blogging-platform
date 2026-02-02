import { ArrowRight, Calendar, Eye, Heart } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card"
import { formatDate } from "@/utils/formatDate"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Link } from "react-router-dom"

interface PostCardProps {
  imageUrl: string
  title: string
  excerpt: string
  authorName: string
  tags: string[]
  likes: string[]
  views: number
  slug: string
  createdAt: string
}

const PostCard = ({
  title,
  excerpt,
  imageUrl,
  authorName,
  tags,
  likes,
  views,
  slug,
  createdAt,
}: PostCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/50 flex flex-col h-full">
      <div className="relative h-48 bg-slate-200 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300">
            <svg
              className="w-16 h-16 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
          </div>
        )}
        {tags && tags.length > 0 && (
          <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
            {tags[0]}
          </Badge>
        )}
      </div>

      <CardHeader>
        <CardTitle className="line-clamp-2 hover:text-primary transition-colors cursor-pointer text-xl">
          <Link to={`/posts/${slug}`}>{title}</Link>
        </CardTitle>
        <CardDescription className="line-clamp-2 text-base">
          {excerpt}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-grow">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold">
              {authorName.charAt(0)}
            </div>
            <span>{authorName}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(createdAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            <span>{views}</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="h-3 w-3" />
            <span>{likes.length}</span>
          </div>
        </div>
        <Link to={`/posts/${slug}`}>
          <Button variant="ghost" size="sm" className="group">
            Read
            <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

export default PostCard

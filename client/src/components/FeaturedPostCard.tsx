import { ArrowRight, Eye, Heart } from "lucide-react"
import { Badge } from "./ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card"
import { Button } from "./ui/button"
import { useNavigate } from "react-router-dom"

interface FeaturedPostCardProps {
  imageUrl: string
  title: string
  excerpt: string
  authorName: string
  tags: string[]
  likes: string[]
  views: number
  slug: string
}

const FeaturedPostCard = ({
  imageUrl,
  title,
  excerpt,
  authorName,
  tags,
  likes,
  views,
  slug,
}: FeaturedPostCardProps) => {
  const navigate = useNavigate()

  return (
    <Card className="flex flex-cols justify-between overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/50">
      <div className="relative h-48 bg-slate-200">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
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
        {tags && tags.length > 0 ? (
          <Badge className="absolute top-4 right-4 bg-primary">React</Badge>
        ) : null}
      </div>
      <CardHeader>
        <CardTitle className="text-xl hover:text-primary transition-colors cursor-pointer">
          {title}
        </CardTitle>
        <CardDescription className="text-base">{excerpt}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
              {authorName?.charAt(0).toUpperCase()}
            </div>
            <span>{authorName}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-4">
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            <span>{views}</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="h-3 w-3" />
            <span>{likes.length}</span>
          </div>
        </div>
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="group"
            onClick={() => {
              navigate(`/${slug}`)
            }}
          >
            Read
            <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

export default FeaturedPostCard

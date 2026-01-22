import { ArrowRight, Calendar, Eye, Heart, User } from "lucide-react"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { formatDate } from "@/utils/formatDate"
import { useNavigate } from "react-router-dom"

interface PostCardProps {
	imageUrl?: string | null
	title: string
	status: string
	tags: string[]
	excerpt: string
	likes: any[]
	authorName: string
	createdAt: string
	views: number
	slug: string
}

const PostCard = ({
	imageUrl,
	title,
	status,
	tags,
	excerpt,
	likes,
	authorName,
	createdAt,
	views,
	slug
}: PostCardProps) => {

	const navigate = useNavigate()

	return (
		<Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
			<div className="relative h-50 overflow-hidden">
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

				{status === "published" && (
					<Badge className="absolute top-4 left-4 bg-green-500 text-white">
						Published
					</Badge>
				)}
				{tags && tags.length > 0 && (
					<Badge className="absolute top-4 right-4 bg-primary text-primary-foreground" variant="outline">
						{tags[0]}
					</Badge>
				)}
			</div>

			<CardHeader>
				<CardTitle className="line-clamp-2 hover:text-primary transition-colors cursor-pointer">
					{title}
				</CardTitle>
				<CardDescription className="line-clamp-2">{excerpt}</CardDescription>
			</CardHeader>

			<CardContent className="flex-grow">
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<div className="flex items-center gap-1">
						<User className="h-4 w-4" />
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
				<Button variant="ghost" size="sm" className="group" onClick={() => {
					navigate(`/${slug}`)
				}}>
					Read
					<ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
				</Button>
			</CardFooter>
		</Card>
	)
}

export default PostCard

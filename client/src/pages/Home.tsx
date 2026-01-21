import PostCard from "@/components/PostCard"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { api } from "@/lib/api"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const Home = () => {
	const [posts, setPosts] = useState<any[] | null>(null)
	const { logout } = useAuth()
	const navigate = useNavigate()

	useEffect(() => {
		;(async () => {
			try {
				const result = await api.get("/api/posts")
				console.log(result.data)
				setPosts(result.data)
			} catch (error: any) {
				console.log(error.message)
			}
		})()
	}, [])
	return (
		<div>
			<Button
				onClick={() => {
					logout()
					navigate("/login")
				}}
			>
				Logout
			</Button>

			<div className="space-y-4 max-w-[1200px] mx-auto sm:grid sm:grid-cols-4 gap-4">
				{posts?.map((post) => (
					<PostCard
						key={post._id}
						authorName={post.author.name}
						imageUrl={post.coverImage ? post.coverImage.url : null}
						status={post.status}
						title={post.title}
						excerpt={post.excerpt}
						createdAt={post.createdAt}
						likes={post.likes}
						tags={post.tags}
						views={post.views}
					/>
				))}
			</div>
		</div>
	)
}

export default Home

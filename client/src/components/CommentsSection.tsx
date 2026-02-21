import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  MessageSquare,
  Send,
  Calendar,
  Trash2,
  Edit2,
} from "lucide-react"
import type { Comment } from "@/types/comment.types"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import {
  addComment,
  deleteComment,
  getCommentsByPost,
  updateComment,
} from "@/services/comments.api"
import { useAuth } from "@/contexts/AuthContext"
import DeleteAlert from "./DeleteAlert"
import type { Post } from "@/types/post.types"
import UpdateCommentDialog from "./UpdateCommentDialog"
import { Link } from "react-router-dom"
import { formatDate } from "@/utils/formatDate"
import CommentSkeleton from "./loaders/CommentSkeleton"

interface CommentsSectionProps {
  post: Post | null
}

function CommentsSection({ post }: CommentsSectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false)
  const [commentToEdit, setCommentToEdit] = useState({
    id: "",
    content: "",
  })
  const [newComment, setNewComment] = useState("")
  const [comments, setComments] = useState<Comment[]>([])
  const [total, setTotal] = useState<number>(0)
  const [loadingComments, setLoadingComments] = useState(false)
  const [commentId, setCommentId] = useState("")
  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(1)
  const { user } = useAuth()
  const limit = 5

  const addCommentHandler = async () => {
    setIsSubmitting(true)
    try {
      if (!newComment.trim()) return

      const response = await addComment(post?._id, newComment)
      const { data } = response

      if (comments.length >= limit) {
        comments.unshift(data)
        comments.pop()
        setComments(comments)
        setHasMore(true)
      } else {
        setComments((prev) => [data, ...prev])
      }

      setTotal((prev) => prev + 1)
      toast.success("Comment added!", { position: "top-right" })
    } catch (error) {
      console.log("Add comment error::", error)
    } finally {
      setIsSubmitting(false)
      setNewComment("")
    }
  }

  const deleteCommentHandler = async (id: string) => {
    try {
      const res = await deleteComment(id)
      if(res) {
        if (comments.length === 1) {
          setPage((prev) => prev - 1)
        }
        setComments((prev) => prev.filter((c) => c._id !== id))
        setTotal((prev) => prev - 1)
        toast.success("Comment Deleted", { position: "top-right" })
      }
    } catch (error) {
      toast.error("Something went wrong", { position: "bottom-right" })
    }
  }

  const updateCommentHandler = async (id: string, comment: string) => {
    try {
      const res = await updateComment(id, comment)
      if(res.data?.content) {
        setComments((prev) =>
          prev.map((c) => (c._id === id ? { ...c, content: comment } : c)),
        )
      }
    } catch (error) {
      toast.error("Something went wrong", { position: "bottom-right" })
    }
  }

  const fetchComments = async (postId: string, pageToLoad = 1, limit = 5) => {
    setLoadingComments(true)
    try {
      const response = await getCommentsByPost(postId, pageToLoad, limit)
      if (!response) return
      const { data, meta } = response

      if (comments.length) {
        setComments((prev) => [...prev, ...data])
      } else {
        setComments(data)
      }
      if (meta.page < meta.totalPages) {
        setHasMore(true)
      } else {
        setHasMore(false)
      }
      setTotal(meta.total)
    } catch (error: any) {
      console.log(error)
    } finally {
      setLoadingComments(false)
    }
  }

  const handleLoadMore = () => {
    setPage((p) => p + 1)
  }

  useEffect(() => {
    if (post) {
      fetchComments(post._id, page, limit)
    }
  }, [post, page, limit])

  return (
    <div className="space-y-6">
      {/* Comments Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <MessageSquare className="h-6 w-6 text-primary" />
            Comments ({total})
          </CardTitle>
          <CardDescription>
            Join the conversation and share your thoughts
          </CardDescription>
        </CardHeader>

        {/* Add Comment Form */}
        <CardContent className="space-y-4">
          {user ? (
            <div className="space-y-3">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                className="min-h-[100px] text-base"
                required
              />
              <div className="flex justify-end">
                <Button
                  className="group bg-[#1A1F36] hover:bg-[#252D45]"
                  onClick={addCommentHandler}
                  disabled={isSubmitting}
                >
                  <Send className="mr-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  {!isSubmitting ? "Post" : "Posting"} Comment
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <Link to="/login">
                <Button type="button" size="sm" variant="secondary">
                  <MessageSquare />
                  Login to Comment
                </Button>
              </Link>
            </div>
          )}

          <Separator />

          {/* Comments List */}
          <div className="space-y-6 mt-6">
            {/* {loadingComments && <div>Loading...</div>} */}
            {total ? (
              <div className="flex flex-end justify-between items-center gap-2">
                <div className="text-sm text-gray-700">
                  Showing {comments.length} of {total}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">
                  No comments yet. Be the first to share your thoughts!
                </p>
              </div>
            )}

            {!loadingComments ? (
              comments.map((comment) => (
                <div key={comment._id} className="flex gap-4">
                  {/* Avatar */}
                  <Avatar className="h-8 w-8 md:h-10 md:w-10 flex-shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {comment.author.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  {/* Comment Content */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap justify-between">
                      <div className="flex gap-2 items-center">
                        <p className="text-xs md:text-[14px] font-semibold text-slate-900">
                          {comment.author.name}
                        </p>
                        <span className="text-slate-400">•</span>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground md:text-[14px]">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(comment.createdAt)}</span>
                        </div>
                      </div>
                      {(user?._id === comment?.author?._id ||
                        user?.role === "admin") && (
                        <div className="flex gap-2">
                          <Button
                            size="icon-sm"
                            variant="destructive"
                            onClick={() => {
                              setOpenDeleteDialog(true)
                              setCommentId(comment?._id)
                            }}
                            className="h-6 w-6 md:h-7 md:w-7"
                          >
                            <Trash2 className="h-3! w-3! md:h-4! md:w-4!" />
                          </Button>
                          <Button
                            size="icon-sm"
                            variant="outline"
                            onClick={() => {
                              setOpenUpdateDialog(true)
                              setCommentToEdit({
                                id: comment._id,
                                content: comment.content,
                              })
                            }}
                            className="h-6 w-6 md:h-7 md:w-7"
                          >
                            <Edit2 className="h-3! w-3! md:h-4! md:w-4!" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <p className="text-slate-700 leading-relaxed text-sm md:text-[14px]">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <>
                {[...Array(3)].map((_, index) => (
                  <CommentSkeleton key={index} />
                ))}
              </>
              
            )}
          </div>
          {hasMore && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleLoadMore}
              disabled={loadingComments}
            >
              Load More...
            </Button>
          )}
        </CardContent>
      </Card>
      <DeleteAlert
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        onConfirm={() => deleteCommentHandler(commentId)}
        title="Comment"
        description="Are you sure you want to delete this comment? This comment will be permanently deleted."
      />
      <UpdateCommentDialog
        open={openUpdateDialog}
        onOpenChange={setOpenUpdateDialog}
        commentId={commentToEdit?.id}
        initialComment={commentToEdit?.content}
        onConfirm={updateCommentHandler}
      />
    </div>
  )
}

export default CommentsSection

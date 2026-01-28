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
  Edit,
} from "lucide-react"
import type { Comment } from "@/types/comment.types"
import { useState } from "react"
import { toast } from "sonner"
import {
  addComment,
  deleteComment,
} from "@/services/comments.api"
import { useAuth } from "@/contexts/AuthContext"
import DeleteAlert from "./DeleteAlert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog"

interface CommentsSectionProps {
  comments: Comment[]
  postId: string
  hasMore?: boolean
  onAddComment: (comment: Comment) => void
  onRemoveComment: (commentId: string) => void
  onUpdateComment: (commentId: string, content: string) => void
  onLoadMore?: () => void
  total: number
}

interface UpdateCommentDialogueProps {
  open: boolean
  onOpenChange: (state: boolean) => void
  onConfirm: (id: string, content: string) => void
  initialComment: string
  commentId: string | undefined
}

const UpdateCommentDialogue = ({
  open,
  onOpenChange,
  onConfirm,
  initialComment,
  commentId,
}: UpdateCommentDialogueProps) => {
  const [content, setContent] = useState(initialComment)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleUpdate = () => {
    setIsUpdating(true)
    if (commentId) onConfirm?.(commentId, content)
    setTimeout(() => {
      setIsUpdating(false)
      onOpenChange(false)
      setContent(initialComment)
    }, 500)
  }

  const handleCancel = () => {
    setContent(initialComment)
    onOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Update Comment</AlertDialogTitle>
          <AlertDialogDescription>
            Make changes to your comment and click update to save.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your content here..."
            className="w-full h-48 p-3 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div className="flex gap-3 justify-end">
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleUpdate}
            disabled={isUpdating}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Edit className="mr-2 h-4 w-4" />
            {isUpdating ? "Updating..." : "Update"}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function CommentsSection({
  comments,
  postId,
  hasMore,
  onLoadMore,
  onAddComment,
  onRemoveComment,
  onUpdateComment,
  total,
}: CommentsSectionProps) {
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  // const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [openDeleteDialogue, setOpenDeleteDialogue] = useState(false)
  const [commentToDelete, setCommentToDelete] = useState<string | undefined>(
    undefined,
  )
  const [openUpdateDialogue, setOpenUpdateDialogue] = useState(false)
  const [commentToEdit, setCommentToEdit] = useState({
    id: "",
    content: "",
  })
  const { user } = useAuth()

  const handleSubmitComment = async () => {
    setIsSubmitting(true)
    try {
      if (comment) {
        const res = await addComment(postId, comment)
        const { data } = res
        onAddComment(data)
        toast.success("Comment added!", { position: "top-right" })
      }
    } catch (error: any) {
      console.log(error.message)
      toast.error("Something went", { position: "bottom-right" })
    } finally {
      setIsSubmitting(false)
      setComment("")
    }
  }

  const handleDeleteComment = async (id: string | undefined) => {
    // setCommentToDelete(id)
    try {
      if (id) onRemoveComment(id)
      await deleteComment(id)
      toast.success("Comment deleted", { position: "top-right" })
    } catch (error: any) {
      console.log(error.message)
      toast.error("Something went", { position: "bottom-right" })
    } finally {
      // setCommentToDelete(undefined)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInHours < 24) {
      return diffInHours === 0 ? "Just now" : `${diffInHours}h ago`
    } else if (diffInDays < 7) {
      return `${diffInDays}d ago`
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    }
  }

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
          <div className="space-y-3">
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts..."
              className="min-h-[100px] text-base"
              required
            />
            <div className="flex justify-end">
              <Button
                className="group"
                onClick={handleSubmitComment}
                disabled={isSubmitting}
              >
                <Send className="mr-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                {!isSubmitting ? "Post" : "Posting"} Comment
              </Button>
            </div>
          </div>

          <Separator />

          {/* Comments List */}
          <div className="space-y-6 mt-6">
            <div className="flex flex-end">
              <div className="text-sm text-gray-700">
                Showing {comments.length} of {total}
              </div>
            </div>
            {total === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">
                  No comments yet. Be the first to share your thoughts!
                </p>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment._id} className="flex gap-4">
                  {/* Avatar */}
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {comment.author.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  {/* Comment Content */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-slate-900">
                        {comment.author.name}
                      </p>
                      <span className="text-slate-400">•</span>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(comment.createdAt)}</span>
                      </div>
                    </div>
                    <p className="text-slate-700 leading-relaxed">
                      {comment.content}
                    </p>
                    {(user?._id === comment?.author?._id ||
                      user?.role === "admin") && (
                      <div className="flex gap-4">
                        <Button
                          size="icon-sm"
                          // variant="outline"
                          onClick={() => {
                            setOpenDeleteDialogue(true)
                            setCommentToDelete(comment?._id)
                          }}
                        >
                          <Trash2 className="h-4 h-4" />
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="outline"
                          onClick={() => {
                            setOpenUpdateDialogue(true)
                            setCommentToEdit({
                              id: comment._id,
                              content: comment.content,
                            })
                          }}
                        >
                          <Edit2 className="h-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          {hasMore && <Button onClick={onLoadMore}>Load More Comments</Button>}
        </CardContent>
      </Card>
      <DeleteAlert
        open={openDeleteDialogue}
        onOpenChange={setOpenDeleteDialogue}
        onConfirm={() => handleDeleteComment(commentToDelete)}
        title="Comment"
        description="Are you sure you want to delete this comment? This comment will be permanently deleted."
      />
      <UpdateCommentDialogue
        open={openUpdateDialogue}
        onOpenChange={setOpenUpdateDialogue}
        commentId={commentToEdit?.id}
        initialComment={commentToEdit?.content}
        onConfirm={onUpdateComment}
      />
    </div>
  )
}

export default CommentsSection

import { useEffect, useState } from "react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog"
import { Edit } from "lucide-react"

interface UpdateCommentDialogProps {
  open: boolean
  onOpenChange: (state: boolean) => void
  onConfirm: (id: string, content: string) => void
  initialComment: string
  commentId: string | undefined
}

const UpdateCommentDialog = ({
  open,
  onOpenChange,
  onConfirm,
  initialComment,
  commentId,
}: UpdateCommentDialogProps) => {
  const [content, setContent] = useState("")
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

  useEffect(() => {
    setContent(initialComment)
  }, [initialComment])


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

export default UpdateCommentDialog
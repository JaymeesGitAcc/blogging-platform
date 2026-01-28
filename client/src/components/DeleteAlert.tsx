import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog"

interface DeleteAlertProps {
  open: boolean
  onOpenChange: (state: boolean) => void
  onConfirm: () => void
  description?: string
  title?:string
}

const defaultDescription = "Are you sure you want to delete this blog article? This action cannot be undone and the article will be permanently removed."

const DeleteAlert = ({
  title="Article",
  open,
  onOpenChange,
  onConfirm,
  description=defaultDescription
}: DeleteAlertProps) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = () => {
    setIsDeleting(true)
    onConfirm?.()
    setTimeout(() => {
      setIsDeleting(false)
      onOpenChange(false)
    }, 1000)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex gap-3 justify-end">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteAlert

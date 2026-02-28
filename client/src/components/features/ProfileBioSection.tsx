import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BookOpen, Edit, Save, AlertCircle } from "lucide-react"
import { updateBio } from "@/services/user.api"
import { toast } from "sonner"

interface ProfileBioSectionProps {
  userBio: string
}

const ProfileBioSection = ({ userBio }: ProfileBioSectionProps) => {
  const [bio, setBio] = useState(userBio)
  const [tempBio, setTempBio] = useState("")
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleEdit = () => {
    setTempBio(bio)
    setError("")
    setOpen(true)
  }

  const handleSave = async () => {
    setError("")

    if (!tempBio.trim()) {
      setError("Bio cannot be empty")
      return
    }

    if (tempBio.length > 500) {
      setError("Bio must be less than 500 characters")
      return
    }

    setLoading(true)

    try {
      await updateBio(tempBio.trim())

      toast.success("Bio Updated Successfully", { position: "top-center" })

      setBio(tempBio)
      setOpen(false)
    } catch (err) {
      setError("Failed to update bio. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setTempBio("")
    setError("")
    setOpen(false)
  }

  return (
    <>
      {/* Bio Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Bio
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={handleEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </div>
          <CardDescription>Tell others about yourself</CardDescription>
        </CardHeader>
        <CardContent>
          {bio ? (
            <p className="text-slate-700 leading-relaxed">
              <i>{bio}</i>
            </p>
          ) : (
            <p className="text-muted-foreground italic">
              No bio added yet. Click edit to add your bio.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Edit Bio Dialog */}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Bio</AlertDialogTitle>
            <AlertDialogDescription>
              Write a short bio to tell others about yourself
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 py-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="bio">Your Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself..."
                value={tempBio}
                onChange={(e) => setTempBio(e.target.value)}
                className="min-h-[150px] resize-none"
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground text-right">
                {tempBio.length} / 500 characters
              </p>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel} disabled={loading}>
              Cancel
            </AlertDialogCancel>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Bio
                </>
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default ProfileBioSection

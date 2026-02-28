import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  User,
  Mail,
  Calendar,
  FileText,
  Heart,
  Shield,
  Trash2,
} from "lucide-react"
import { formatDate } from "@/utils/formatDate"
import { api } from "@/lib/api"
import { useParams } from "react-router-dom"
import { toast } from "sonner"
import ProfileSkeleton from "@/components/loaders/ProfileSkeleton"
import CountUp from "react-countup"
import { Button } from "@/components/ui/button"
import DeleteAccountDialog from "@/components/DeleteAccountDialog"
import ProfileBioSection from "@/components/features/ProfileBioSection"

type UserDataTypes = {
  user: {
    _id: string
    name: string
    email: string
    role: string
    status: "active" | "blocked"
    createdAt: string
    updatedAt?: string
    __v?: number
    owner?: boolean
    bio: string
  }
  totalPosts: number
  totalLikesReceived: number
}

const UserProfile = () => {
  const [userData, setUserData] = useState<UserDataTypes | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showAccountDeleteDialog, setShowAccountDeleteDialog] = useState(false)
  const { id } = useParams()

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true)
      try {
        const res = await api.get(`/api/users/profile/${id}`)
        const { data } = res.data
        setUserData(data)
      } catch (error) {
        toast.error("Something went wrong", { position: "bottom-right" })
      } finally {
        setIsLoading(false)
      }
    }
    loadUser()
  }, [])

  if (isLoading) return <ProfileSkeleton />

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header Card */}
        <Card>
          <CardContent className="pt-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar */}
              <Avatar className="h-32 w-32 border-4 border-primary/20">
                <AvatarFallback className="bg-[#1A1F36] text-white text-4xl font-bold">
                  {getInitials(String(userData?.user?.name))}
                </AvatarFallback>
              </Avatar>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-3">
                  <h1 className="text-3xl font-bold text-slate-900">
                    {userData?.user?.name}
                  </h1>
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <Badge className="bg-green-500">
                      {userData?.user?.status}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <Shield className="h-3 w-3" />
                      {userData?.user?.role}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-col gap-2 text-slate-600 mb-4">
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <Mail className="h-4 w-4" />
                    <span>{userData?.user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Joined {formatDate(String(userData?.user?.createdAt))}
                    </span>
                  </div>
                </div>

                {/* <Button className="group">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button> */}
              </div>
            </div>
          </CardContent>
        </Card>

       
        <ProfileBioSection userBio={userData?.user?.bio || ""} />
        

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total Posts
              </CardTitle>
              <FileText className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-slate-900">
                <CountUp end={userData?.totalPosts || 0} duration={1} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Published articles
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total Likes Received
              </CardTitle>
              <Heart className="h-5 w-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-slate-900">
                <CountUp end={userData?.totalLikesReceived || 0} duration={1} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Across all posts
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Account Details Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Account Details
            </CardTitle>
            <CardDescription>
              Your account information and settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-slate-900">User ID</p>
                <p className="text-sm text-muted-foreground">
                  Unique identifier
                </p>
              </div>
              <Badge variant="outline" className="font-mono text-xs">
                {userData?.user?._id}
              </Badge>
            </div>

            <Separator />

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-slate-900">Email Address</p>
                <p className="text-sm text-muted-foreground">
                  Your primary email
                </p>
              </div>
              <p className="text-sm text-slate-700">{userData?.user?.email}</p>
            </div>

            <Separator />

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-slate-900">Account Status</p>
                <p className="text-sm text-muted-foreground">
                  Current account state
                </p>
              </div>
              <Badge className="bg-green-500 capitalize">
                {userData?.user?.status}
              </Badge>
            </div>

            <Separator />

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-slate-900">Member Since</p>
                <p className="text-sm text-muted-foreground">
                  Account creation date
                </p>
              </div>
              <p className="text-sm text-slate-700">
                {formatDate(String(userData?.user?.createdAt))}
              </p>
            </div>

            <Separator />

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-slate-900">
                  Delete Your account
                </p>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowAccountDeleteDialog(true)}
                className="group"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Account
              </Button>

              <DeleteAccountDialog
                open={showAccountDeleteDialog}
                onOpenChange={setShowAccountDeleteDialog}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default UserProfile

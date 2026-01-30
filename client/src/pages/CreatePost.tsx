import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Upload, Save, ImagePlus, Tag, X } from "lucide-react"
import { useState } from "react"
import { createPost } from "@/services/posts.api"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

const CreatePost = () => {
  const [title, setTitle] = useState("")
  const [status, setStatus] = useState("published")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState("")
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCoverImage(file)

      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setCoverImage(null)
    setImagePreview(null)
  }

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Title is required", { position: "bottom-right" })
      return
    }

    if (!content.trim()) {
      toast.error("Content is required", { position: "bottom-right" })
      return
    }

    if (!["draft", "published"].includes(status)) {
      toast.error("Status must be Draft or Published", {
        position: "bottom-right",
      })
      return
    }
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("content", content)
      formData.append("status", status)

      if (tags.trim()) {
        const tagsArray = tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
        formData.append("tags", JSON.stringify(tagsArray))
      }
      if (coverImage) {
        formData.append("coverImage", coverImage)
      }

      const response = await createPost(formData)

      if (response) {
        let message =
          status === "published"
            ? "Blog Published successfully"
            : "Blog saved as draft"
        toast.success(message, { position: "top-right" })
        console.log(response)

        setTimeout(() => {
          navigate(`/posts/${response.data.slug}`)
        }, 500)
      }
    } catch (error: any) {
      toast.error("Failed to create post", {
        position: "bottom-right",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title Section */}
            <Card>
              <CardHeader>
                <CardTitle>Post Details</CardTitle>
                <CardDescription>
                  Give your post a compelling title and content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-base">
                    Title *
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter an engaging title for your post..."
                    className="text-lg h-12"
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Keep it clear and descriptive (60-80 characters recommended)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content" className="text-base">
                    Content *
                  </Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your story here..."
                    className="min-h-[400px] text-base leading-relaxed"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Cover Image Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImagePlus className="h-5 w-5" />
                  Cover Image
                </CardTitle>
                <CardDescription>
                  Upload a compelling cover image for your post
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!imagePreview ? (
                  <label htmlFor="cover-image" className="cursor-pointer">
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center hover:border-primary transition-colors">
                      <Upload className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                      <p className="text-lg font-medium mb-2">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        PNG, JPG, WEBP up to 10MB
                      </p>
                      <Button variant="outline" size="sm" type="button">
                        Choose File
                      </Button>
                    </div>
                    <Input
                      id="cover-image"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                ) : (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Cover preview"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={removeImage}
                      type="button"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <div className="mt-4 p-3 bg-slate-100 rounded-lg">
                      <p className="text-sm font-medium text-slate-700">
                        {coverImage?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {coverImage
                          ? (coverImage.size / 1024 / 1024).toFixed(2)
                          : "0.00"}{" "}
                        MB
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Publish Settings</CardTitle>
                <CardDescription>
                  Configure your post visibility
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-base">
                    Status *
                  </Label>
                  <Select defaultValue={status} onValueChange={setStatus}>
                    <SelectTrigger id="status" className="h-11">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                          <span>Draft</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="published">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span>Published</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Drafts are only visible to you
                  </p>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="tags"
                    className="text-base flex items-center gap-2"
                  >
                    <Tag className="h-4 w-4" />
                    Tags
                  </Label>
                  <Input
                    id="tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="tech, gadgets, science"
                    className="h-11"
                  />
                  <p className="text-sm text-muted-foreground">
                    Separate tags with commas
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-base">✨ Writing Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Hook readers with a strong opening</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Use headings to break up content</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Add relevant tags for discoverability</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Choose an eye-catching cover image</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card>
              <CardContent className="pt-6 space-y-3">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Publishing" : "Publish"} Blog
                </Button>
                <Button variant="ghost" className="w-full">
                  Discard
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePost

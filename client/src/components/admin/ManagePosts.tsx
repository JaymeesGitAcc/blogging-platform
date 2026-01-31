import { type ColumnDef } from "@tanstack/react-table"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Edit, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { Link } from "react-router-dom"
import { formatDate } from "@/utils/formatDate"
import { deletePost } from "@/services/posts.api"
import DeleteAlert from "../DeleteAlert"
import { toast } from "sonner"
import PostsDataTable from "../PostsDataTable"
import type { Users } from "@/types/admin.types"

const shortenTitle = (title = "", length = 30) => {
  return title.length > length ? title.substring(0, length) + "..." : title
}

type Posts = {
  id: string
  title: string
  status: "published" | "draft"
  authorName: string
  likesCount: number
  views: number
  createdAt: string
  slug: string
  authorEmail: string
}

interface GetPostsTableColumnsProps {
  setOpenDeleteAlert: (state: boolean) => void
  setPostToDelete: (state: string | undefined) => void
}

const getPostsTableColumns = ({
  setOpenDeleteAlert,
  setPostToDelete,
}: GetPostsTableColumnsProps) => {
  const columns: ColumnDef<Posts>[] = [
    {
      accessorKey: "title",
      header: () => (
        <div className="px-4 py-5 text-left text-sm font-bold text-slate-900">
          Title
        </div>
      ),
      cell: ({ row }) => (
        <div className="px-4 py-2 text-sm font-semibold text-slate-900 max-w-xs">
          <Link
            to={`/posts/${row.original.slug}`}
            className="truncate hover:underline"
          >
            {shortenTitle(row.getValue("title"))}
          </Link>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          className={`${row.getValue("status") === "published" ? "bg-green-500" : "bg-yellow-500"} text-[11px]`}
        >
          {row.getValue("status")}
        </Badge>
      ),
    },
    {
      accessorKey: "authorName",
      header: "Author",
    },
    {
      accessorKey: "authorEmail",
      header: "Email",
    },
    {
      accessorKey: "likesCount",
      header: "Likes",
    },
    {
      accessorKey: "views",
      header: "Views",
    },
    {
      accessorKey: "createdAt",
      header: "Created On",
      cell: ({ row }) => {
        return <span>{formatDate(row.getValue("createdAt"))}</span>
      },
    },
    {
      id: "actions",
      accessorKey: "",
      header: "Actions",
      cell: ({ row }) => {
        //   console.log(row.original)

        return (
          <div className="space-x-2">
            <Link to={`/update/${row.original.slug}`}>
              <div className="inline-flex items-center justify-center h-9 w-9 border rounded-md bg-zinc-800 hover:bg-zinc-900 text-white duration-150">
                <Edit className="h-4 w-4" />
              </div>
            </Link>

            <Button
              size="icon"
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => {
                setOpenDeleteAlert(true)
                setPostToDelete(row.original.id)
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  return columns
}

const ManagePosts = () => {
  const [posts, setPosts] = useState<Posts[]>([])
  const [postToDelete, setPostToDelete] = useState<string | undefined>(
    undefined,
  )
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false)
  const [page, setPage] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [limit, setLimit] = useState(5)

  const hasNext = currentPage < totalPages
  const hasPrev = currentPage > 1

  const handleChangeLimit = (value: string) => {
    setLimit(Number(value))
  }

  const handleDeletePost = async () => {
    try {
      const res = await deletePost(postToDelete)
      console.log(res.data)
      toast.success("Post Deleted Successfully", { position: "top-right" })
      setPosts((posts) => posts.filter((post) => post.id !== postToDelete))
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong", { position: "bottom-right" })
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) setPage((prev) => prev + 1)
  }

  const handlePrev = () => {
    if (currentPage > 1) setPage((prev) => prev - 1)
  }

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const res = await api.get(
          `/api/admin/posts?limit=${limit}&page=${page}`,
        )
        setPosts(res?.data?.data)
        setTotalPages(res?.data?.meta?.totalPages)
        setCurrentPage(res?.data?.meta?.page)
        console.log(res?.data?.meta)
      } catch (error) {
        console.log(error)
      }
    }

    loadPosts()
  }, [page, limit])

  return (
    <div>
      <PostsDataTable
        columns={getPostsTableColumns({ setOpenDeleteAlert, setPostToDelete })}
        data={posts}
        hasNext={hasNext}
        hasPrev={hasPrev}
        onNext={handleNext}
        onPrev={handlePrev}
        rowsPerPage={String(limit)}
        handleChange={handleChangeLimit}
      />
      <DeleteAlert
        onConfirm={handleDeletePost}
        onOpenChange={setOpenDeleteAlert}
        open={openDeleteAlert}
      />
    </div>
  )
}

export default ManagePosts

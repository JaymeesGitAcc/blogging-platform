import type { Users } from "@/types/admin.types"
import type { ColumnDef } from "@tanstack/react-table"
import UsersDataTable from "../UsersDataTable"
import { useEffect, useState } from "react"
import { getAllUsersAdmin, toggleUserStatus } from "@/services/admin.api"
import { Button } from "../ui/button"
import { formatDate } from "@/utils/formatDate"
import { Badge } from "../ui/badge"
import { toast } from "sonner"

const getUsersTableColumns = (onStatusChange: (id: string) => void) => {
  const columns: ColumnDef<Users>[] = [
    {
      accessorKey: "name",
      header: () => (
        <div className="px-4 py-5 text-left text-slate-900">Name</div>
      ),
      cell: ({ row }) => (
        <div className="px-4 py-2 text-sm font-semibold text-slate-900 max-w-xs">
          {row.getValue("name")}
        </div>
      ),
    },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "role", header: "Role" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          className={
            row.original.status === "active" ? "bg-green-500" : "bg-red-600"
          }
        >
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: "postsCount",
      header: "Posts",
    },
    {
      accessorKey: "createdAt",
      header: "Joined On",
      cell: ({ row }) => (
        <span className="font-semibold">
          {formatDate(row.getValue("createdAt"))}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const status = row.original.status
        const userId = row.original._id
        return (
          <Button
            size="xs"
            onClick={() => onStatusChange(userId)}
            className={`${status === "active" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}`}
            disabled={row.original.owner}
          >
            {status === "active" ? "Block" : "Unblock"}
          </Button>
        )
      },
    },
  ]

  return columns
}

const ManageUsers = () => {
  const [users, setUsers] = useState<Users[]>([])
  const [page, setPage] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [limit, setLimit] = useState(5)
  const [isLoading, setIsLoading] = useState(false)
  const hasNext = currentPage < totalPages
  const hasPrev = currentPage > 1

  const handleNext = () => {
    if (currentPage < totalPages) setPage((prev) => prev + 1)
  }

  const handlePrev = () => {
    if (currentPage > 1) setPage((prev) => prev - 1)
  }

  const handleLimitChange = (value: string) => {
    setLimit(Number(value))
  }

  const handleUserStatusChange = async (id: string) => {
    try {
      const res = await toggleUserStatus(id)
      console.log(res)
      setUsers((prev) =>
        prev.map((user) =>
          user._id === id
            ? {
                ...user,
                status: user.status === "active" ? "blocked" : "active",
              }
            : user,
        ),
      )
      toast.success(res.message, {
        position: "top-right",
        description: `${res?.data?.name}${res?.data?.status === "active" ? " unblocked" : " blocked"}`,
      })
    } catch (error:any) {
      toast.error(error?.response?.data?.message || "Something went wrong", { position: "bottom-right" })
    }
  }

  useEffect(() => {
    const loadUsers = async () => {
     try {
       setIsLoading(true)
       const res = await getAllUsersAdmin(page, limit)
       const { users, pagination } = res
       setUsers(users)
       setTotalPages(pagination.totalPages)
       setCurrentPage(pagination.currentPage)
     } catch (error) {
        console.log(error)
     } finally {
      setIsLoading(false)
     }
    }

    loadUsers()
  }, [page, limit])

  return (
    <div>
      <UsersDataTable
        columns={getUsersTableColumns(handleUserStatusChange)}
        data={users}
        handleChange={handleLimitChange}
        hasNext={hasNext}
        hasPrev={hasPrev}
        rowsPerPage={String(limit)}
        onNext={handleNext}
        onPrev={handlePrev}
        loading={isLoading}
      />
    </div>
  )
}

export default ManageUsers

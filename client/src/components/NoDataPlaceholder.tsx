import { Database } from "lucide-react"

const NoDataPlaceholder = ({ message = "No data available" }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <Database className="h-16 w-16 text-gray-300 mb-4" />
      <p className="text-gray-500 text-lg font-medium">{message}</p>
      <p className="text-gray-400 text-sm mt-2">
        There are no records to display
      </p>
    </div>
  )
}

export default NoDataPlaceholder

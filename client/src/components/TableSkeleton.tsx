function TableSkeletonRow({ columns = 7 }) {
  return (
    <tr className="border-b">
      {[...Array(columns)].map((_, index) => (
        <td key={index} className="px-4 py-3">
          <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4"></div>
        </td>
      ))}
    </tr>
  )
}

function TableSkeleton({ rows = 6, columns = 7 }) {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100">
      <table className="w-full bg-gradient-to-br from-slate-50 to-slate-100">
        <tbody className="bg-white divide-y divide-slate-200">
          {[...Array(rows)].map((_, index) => (
            <TableSkeletonRow key={index} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TableSkeleton

const CommentSkeleton = () => {
  return (
    <div className="flex gap-4">
      <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-slate-200 animate-pulse flex-shrink-0"></div>
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="h-4 bg-slate-200 rounded animate-pulse w-24"></div>
          <div className="h-2 w-2 rounded-full bg-slate-200 animate-pulse"></div>
          <div className="h-4 bg-slate-200 rounded animate-pulse w-20"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 rounded animate-pulse w-full"></div>
          <div className="h-4 bg-slate-200 rounded animate-pulse w-5/6"></div>
        </div>
      </div>
    </div>
  )
}

export default CommentSkeleton

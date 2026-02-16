import PostCardSkeleton from "../PostCardSkeleton"

const AllPostsPageSkeleton = () => {
  return (
    <div>
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="mb-8 space-y-3">
          <div className="h-10 bg-slate-200 rounded animate-pulse w-64"></div>
          <div className="h-5 bg-slate-200 rounded animate-pulse w-96"></div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <PostCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default AllPostsPageSkeleton

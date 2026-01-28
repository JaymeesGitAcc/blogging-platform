import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";

const PostCardSkeleton = () => {
  return (
    <Card className="overflow-hidden">
      {/* Image Skeleton */}
      <div className="h-48 bg-slate-200 animate-pulse"></div>

      <CardHeader>
        {/* Title Skeleton */}
        <div className="space-y-2">
          <div className="h-6 bg-slate-200 rounded animate-pulse w-3/4"></div>
          <div className="h-6 bg-slate-200 rounded animate-pulse w-1/2"></div>
        </div>
        
        {/* Description Skeleton */}
        <div className="space-y-2 mt-3">
          <div className="h-4 bg-slate-200 rounded animate-pulse w-full"></div>
          <div className="h-4 bg-slate-200 rounded animate-pulse w-5/6"></div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Author Skeleton */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-slate-200 animate-pulse"></div>
          <div className="h-4 bg-slate-200 rounded animate-pulse w-24"></div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-4 border-t">
        {/* Meta Info Skeleton */}
        <div className="flex items-center gap-3">
          <div className="h-3 bg-slate-200 rounded animate-pulse w-16"></div>
          <div className="h-3 bg-slate-200 rounded animate-pulse w-12"></div>
          <div className="h-3 bg-slate-200 rounded animate-pulse w-12"></div>
        </div>
        {/* Button Skeleton */}
        <div className="h-8 bg-slate-200 rounded animate-pulse w-20"></div>
      </CardFooter>
    </Card>
  );
}

export default PostCardSkeleton
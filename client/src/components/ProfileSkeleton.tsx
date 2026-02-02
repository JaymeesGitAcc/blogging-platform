import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { User, FileText, Heart } from 'lucide-react';

function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header Card Skeleton */}
        <Card>
          <CardContent className="pt-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar Skeleton */}
              <div className="h-32 w-32 rounded-full bg-slate-200 animate-pulse"></div>

              {/* User Info Skeleton */}
              <div className="flex-1 w-full space-y-4">
                <div className="space-y-3">
                  <div className="h-8 bg-slate-200 rounded animate-pulse w-48 mx-auto md:mx-0"></div>
                  <div className="flex gap-2 justify-center md:justify-start">
                    <div className="h-6 bg-slate-200 rounded-full animate-pulse w-16"></div>
                    <div className="h-6 bg-slate-200 rounded-full animate-pulse w-16"></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="h-4 bg-slate-200 rounded animate-pulse w-56 mx-auto md:mx-0"></div>
                  <div className="h-4 bg-slate-200 rounded animate-pulse w-48 mx-auto md:mx-0"></div>
                </div>

                <div className="h-10 bg-slate-200 rounded animate-pulse w-32 mx-auto md:mx-0"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards Skeleton */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="h-4 bg-slate-200 rounded animate-pulse w-24"></div>
              <FileText className="h-5 w-5 text-slate-300" />
            </CardHeader>
            <CardContent>
              <div className="h-10 bg-slate-200 rounded animate-pulse w-20 mb-2"></div>
              <div className="h-3 bg-slate-200 rounded animate-pulse w-32"></div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="h-4 bg-slate-200 rounded animate-pulse w-32"></div>
              <Heart className="h-5 w-5 text-slate-300" />
            </CardHeader>
            <CardContent>
              <div className="h-10 bg-slate-200 rounded animate-pulse w-20 mb-2"></div>
              <div className="h-3 bg-slate-200 rounded animate-pulse w-28"></div>
            </CardContent>
          </Card>
        </div>

        {/* Account Details Card Skeleton */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-slate-300" />
              <div className="h-6 bg-slate-200 rounded animate-pulse w-40"></div>
            </CardTitle>
            <CardDescription>
              <div className="h-4 bg-slate-200 rounded animate-pulse w-56 mt-2"></div>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(4)].map((_, index) => (
              <React.Fragment key={index}>
                <div className="flex items-center justify-between py-3">
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded animate-pulse w-24"></div>
                    <div className="h-3 bg-slate-200 rounded animate-pulse w-32"></div>
                  </div>
                  <div className="h-6 bg-slate-200 rounded animate-pulse w-32"></div>
                </div>
                {index < 3 && <Separator />}
              </React.Fragment>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ProfileSkeleton;
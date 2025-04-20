import { Skeleton } from "@/components/ui/skeleton"

export default function ContactLoading() {
  return (
    <div className="container max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <Skeleton className="h-10 w-64 mx-auto mb-4" />
        <Skeleton className="h-4 w-full max-w-2xl mx-auto mb-2" />
        <Skeleton className="h-4 w-full max-w-xl mx-auto" />
      </div>

      <div className="max-w-md mx-auto space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-48 w-full rounded-lg" />
        <Skeleton className="h-48 w-full rounded-lg" />
        <Skeleton className="h-48 w-full rounded-lg" />
      </div>
    </div>
  )
}

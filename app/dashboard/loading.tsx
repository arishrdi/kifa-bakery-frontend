import { PageHeaderSkeleton, StatCardsSkeleton, CardSkeleton } from "@/components/loading-skeleton"

export default function Loading() {
  return (
    <div className="flex flex-col space-y-4">
      <PageHeaderSkeleton />
      <StatCardsSkeleton />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <CardSkeleton />
        </div>
        <div className="col-span-3">
          <CardSkeleton />
        </div>
      </div>
    </div>
  )
}


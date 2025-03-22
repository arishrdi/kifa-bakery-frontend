import { PageHeaderSkeleton, StatCardsSkeleton, TabsSkeleton, CardSkeleton } from "@/components/loading-skeleton"

export default function Loading() {
  return (
    <div className="flex flex-col space-y-4">
      <PageHeaderSkeleton />
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <div className="h-10 w-full rounded-md border border-input bg-background px-3 py-2"></div>
        </div>
        <div className="flex-1">
          <div className="h-10 w-full rounded-md border border-input bg-background px-3 py-2"></div>
        </div>
      </div>
      <TabsSkeleton tabs={5} />
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


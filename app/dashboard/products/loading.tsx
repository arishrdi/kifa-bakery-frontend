import { PageHeaderSkeleton, CardSkeleton, TableSkeleton, TabsSkeleton } from "@/components/loading-skeleton"

export default function Loading() {
  return (
    <div className="flex flex-col space-y-4">
      <PageHeaderSkeleton />
      <CardSkeleton  rows={6}/>
        <TabsSkeleton />
        <TableSkeleton columns={6} />
    </div>
  )
}


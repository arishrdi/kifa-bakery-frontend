import { PageHeaderSkeleton, CardSkeleton } from "@/components/loading-skeleton"

export default function Loading() {
  return (
    <div className="flex flex-col space-y-4">
      <PageHeaderSkeleton />
      <CardSkeleton />
      <div className="grid gap-4 md:grid-cols-2">
        <CardSkeleton rows={3} />
        <CardSkeleton rows={3} />
      </div>
    </div>
  )
}


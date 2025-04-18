import { PageHeaderSkeleton, CardSkeleton } from "@/components/loading-skeleton"

export default function Loading() {
  return (
    <div className="flex flex-col space-y-4">
      <PageHeaderSkeleton />
      <CardSkeleton />
    </div>
  )
}


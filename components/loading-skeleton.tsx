import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function PageHeaderSkeleton() {
  return (
    <div className="flex items-center justify-between mb-4">
      <Skeleton className="h-10 w-[200px]" />
      <div className="flex items-center space-x-2">
        <Skeleton className="h-10 w-[150px]" />
        <Skeleton className="h-10 w-10" />
      </div>
    </div>
  )
}

export function CardSkeleton({ header = true, rows = 5 }: { header?: boolean; rows?: number }) {
  return (
    <Card>
      {header && (
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-[250px] mb-2" />
          <Skeleton className="h-4 w-[350px]" />
        </CardHeader>
      )}
      <CardContent>
        <div className="space-y-2">
          {Array.from({ length: rows }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function StatCardsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-5 w-[120px]" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-7 w-[100px] mb-1" />
            <Skeleton className="h-4 w-[150px]" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function TableSkeleton({
  header = true,
  rows = 5,
  columns = 4,
}: { header?: boolean; rows?: number; columns?: number }) {
  return (
    <div className="space-y-4">
      {header && (
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-[250px]" />
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-[200px]" />
            <Skeleton className="h-10 w-[100px]" />
          </div>
        </div>
      )}
      <div className="rounded-md border">
        <div className="border-b">
          <div className="flex h-12 items-center px-4">
            {Array.from({ length: columns }).map((_, i) => (
              <div key={i} className={`flex-1 ${i === columns - 1 ? "text-right" : ""}`}>
                <Skeleton className="h-4 w-[80%]" />
              </div>
            ))}
          </div>
        </div>
        <div>
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex h-16 items-center border-b px-4 last:border-0">
              {Array.from({ length: columns }).map((_, j) => (
                <div key={j} className={`flex-1 ${j === columns - 1 ? "text-right" : ""}`}>
                  <Skeleton className="h-4 w-[80%]" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function TabsSkeleton({ tabs = 4 }: { tabs?: number }) {
  return (
    <div className="mb-4">
      <div className="border-b">
        <div className="flex h-10 items-center space-x-4">
          {Array.from({ length: tabs }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-[100px]" />
          ))}
        </div>
      </div>
    </div>
  )
}

export function ChartSkeleton({ height = 350 }: { height?: number }) {
  return (
    <div className="rounded-md border p-4">
      <Skeleton className={`w-full h-[${height}px]`} />
    </div>
  )
}


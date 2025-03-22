import {
  PageHeaderSkeleton,
  CardSkeleton,
  TableSkeleton,
} from "@/components/loading-skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col space-y-4">
      <PageHeaderSkeleton />
      <CardSkeleton />
      <TableSkeleton columns={6} />
    </div>
  );
}

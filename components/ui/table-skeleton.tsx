import { Skeleton } from "@/components/ui/skeleton"

interface TableSkeletonProps {
  columns: number
  rows?: number
  avatarColumn?: boolean
}

export function TableSkeleton({ columns, rows = 5, avatarColumn = true }: TableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r} className="border-b">
          {Array.from({ length: columns }).map((_, c) => (
            <td key={c} className="px-5 py-4">
              {c === 0 && avatarColumn ? (
                <div className="flex items-center gap-3">
                  <Skeleton className="h-9 w-9 shrink-0 rounded-lg" />
                  <div className="flex flex-col gap-1.5">
                    <Skeleton className="h-3.5 w-28" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ) : (
                <Skeleton className="h-4 w-full max-w-[120px]" />
              )}
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}

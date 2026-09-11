"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PaginationBarProps {
  page: number
  totalPages: number
  totalElements: number
  onPageChange: (page: number) => void
}

export function PaginationBar({ page, totalPages, totalElements, onPageChange }: PaginationBarProps) {
  if (totalElements === 0) return null

  return (
    <div className="flex items-center justify-between border-t border-border-default px-5 py-3">
      <span className="text-xs text-muted-foreground">
        Page {page + 1} of {Math.max(totalPages, 1)} · {totalElements} total
      </span>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 0}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="h-3.5 w-3.5" /> Prev
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={page + 1 >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}

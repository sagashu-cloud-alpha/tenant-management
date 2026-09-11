import { cn } from "@/lib/utils"

export function CharCount({ value, max }: { value: string; max: number }) {
  const count = value.length
  return (
    <div className={cn("text-[11px] text-right", count >= max ? "text-destructive" : "text-muted-foreground")}>
      {count}/{max}
    </div>
  )
}

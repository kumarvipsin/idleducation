import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
<<<<<<< HEAD
      className={cn("animate-pulse rounded-md bg-muted", className)}
=======
      className={cn("animate-pulse rounded-md bg-muted/70", className)}
>>>>>>> origin/main
      {...props}
    />
  )
}

export { Skeleton }

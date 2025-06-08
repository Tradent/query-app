import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-sun-500 text-white hover:bg-sun-600",
        secondary: "border-transparent bg-earth-500 text-white hover:bg-earth-600",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        earth: "border-transparent bg-earth-500 text-white hover:bg-earth-600",
        sun: "border-transparent bg-sun-500 text-white hover:bg-sun-600",
        forest: "border-transparent bg-forest-500 text-white hover:bg-forest-600",
        soil: "border-transparent bg-soil-500 text-white hover:bg-soil-600",
        sky: "border-transparent bg-sky-500 text-white hover:bg-sky-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }

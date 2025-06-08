import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-sun-500 text-white hover:bg-sun-600",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 border-sun-200",
        outline: "border border-sun-200 bg-background hover:bg-sun-50 hover:text-sun-700 text-sun-600",
        secondary: "bg-sun-100 text-sun-900 hover:bg-sun-200 border border-sun-200",
        ghost: "hover:bg-sun-100 hover:text-sun-700 text-sun-600",
        link: "text-sun-600 underline-offset-4 hover:underline",
        earth: "bg-earth-500 text-white hover:bg-earth-600 shadow-sm border border-earth-600/20",
        orange: "bg-orange-500 text-white hover:bg-orange-600 shadow-sm border border-orange-600/20",
        sun: "bg-sun-500 text-white hover:bg-sun-600 shadow-sm border border-sun-600/20",
        forest: "bg-sun-600 text-white hover:bg-sun-700",
        soil: "bg-sun-500 text-white hover:bg-sun-600",
        sky: "bg-sun-500 text-white hover:bg-sun-600",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "sun",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }

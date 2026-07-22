import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const battleButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-bold uppercase tracking-wider ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden group",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(188,19,254,0.4)] hover:shadow-[0_0_25px_rgba(188,19,254,0.6)]",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-[0_0_15px_rgba(19,193,254,0.4)] hover:shadow-[0_0_25px_rgba(19,193,254,0.6)]",
        gold: "bg-gold text-black hover:bg-gold/90 shadow-[0_0_15px_rgba(255,215,0,0.4)] hover:shadow-[0_0_25px_rgba(255,215,0,0.6)]",
        outline: "border-2 border-primary/50 bg-transparent text-primary hover:bg-primary/10 hover:border-primary",
        ghost: "hover:bg-white/10 text-white",
      },
      size: {
        default: "h-12 px-8 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-16 px-12 text-lg font-black",
        icon: "h-12 w-12",
      },
      glowing: {
        true: "animate-pulse-neon",
        false: "",
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
      glowing: false,
    },
  }
)

export interface BattleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof battleButtonVariants> {
  asChild?: boolean
}

const BattleButton = React.forwardRef<HTMLButtonElement, BattleButtonProps>(
  ({ className, variant, size, glowing, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(battleButtonVariants({ variant, size, glowing, className }))}
        ref={ref}
        {...props}
      >
        <span className="relative z-10">{props.children}</span>
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </Comp>
    )
  }
)
BattleButton.displayName = "BattleButton"

export { BattleButton, battleButtonVariants }

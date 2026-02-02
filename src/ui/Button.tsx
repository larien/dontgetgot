import { Slot } from "@radix-ui/react-slot";
import { type ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  asChild?: boolean;
}

const variants = {
  primary:
    "bg-dgg-lime text-black hover:bg-dgg-lime-bright border-2 border-black/20 font-semibold uppercase tracking-wide",
  secondary:
    "bg-dgg-yellow text-black hover:bg-dgg-yellow-dark border-2 border-black/20 font-semibold uppercase tracking-wide",
  ghost:
    "bg-transparent text-dgg-muted border border-transparent hover:bg-dgg-surface hover:text-zinc-200",
  danger:
    "bg-dgg-failed text-white hover:bg-dgg-failed-bright border-2 border-black/20 font-semibold uppercase tracking-wide",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={`
          inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm
          transition-colors focus:outline-none focus:ring-2 focus:ring-dgg-lime focus:ring-offset-2 focus:ring-offset-dgg-bg
          disabled:pointer-events-none disabled:opacity-50
          ${variants[variant]}
          ${className}
        `.trim()}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

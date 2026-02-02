import { type HTMLAttributes, forwardRef } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "muted";
}

const variants = {
  default:
    "bg-dgg-lime/25 text-dgg-lime-bright border-2 border-dgg-lime/50 font-semibold uppercase tracking-wide",
  success:
    "bg-dgg-nailed/25 text-dgg-nailed-bright border-2 border-dgg-nailed/50 font-semibold uppercase tracking-wide",
  muted:
    "bg-dgg-yellow/15 text-dgg-yellow border border-dgg-yellow/40",
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = "", variant = "default", ...props }, ref) => (
    <span
      ref={ref}
      className={`
        inline-flex items-center rounded-md px-2.5 py-0.5 text-xs
        ${variants[variant]}
        ${className}
      `.trim()}
      {...props}
    />
  )
);
Badge.displayName = "Badge";

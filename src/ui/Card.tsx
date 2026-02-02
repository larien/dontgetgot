import { type HTMLAttributes, forwardRef } from "react";

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = "", ...props }, ref) => (
    <div
      ref={ref}
      className={`rounded-xl border-2 border-dgg-yellow/30 bg-dgg-surface p-5 shadow-sm ${className}`.trim()}
      {...props}
    />
  )
);
Card.displayName = "Card";

export const CardTitle = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className = "", ...props }, ref) => (
  <h3
    ref={ref}
    className={`text-sm font-bold uppercase tracking-wide text-zinc-200 ${className}`.trim()}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

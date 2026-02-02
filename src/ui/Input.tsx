import { type InputHTMLAttributes, forwardRef } from "react";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className = "", ...props }, ref) => (
    <input
      ref={ref}
      className={`
        w-full rounded-lg border-2 border-dgg-border bg-dgg-bg px-3 py-2
        text-zinc-100 placeholder:text-dgg-muted
        focus:outline-none focus:ring-2 focus:ring-dgg-lime focus:border-dgg-lime
        ${className}
      `.trim()}
      {...props}
    />
  )
);
Input.displayName = "Input";

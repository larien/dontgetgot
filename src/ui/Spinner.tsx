import { type HTMLAttributes } from "react";

export function Spinner({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`inline-block h-5 w-5 animate-spin rounded-full border-2 border-dgg-border border-t-dgg-lime ${className}`.trim()}
      role="status"
      aria-label="Loading"
      {...props}
    />
  );
}

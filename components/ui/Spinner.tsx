import { cn } from "@/lib/cn";

export default function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-5 h-5 rounded-full border-2 border-border-muted border-t-accent-purple animate-spin",
        className
      )}
    />
  );
}

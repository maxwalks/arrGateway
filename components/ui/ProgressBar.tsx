import { cn } from "@/lib/cn";

const colorMap = {
  lime: "bg-accent-lime",
  amber: "bg-accent-amber",
  purple: "bg-accent-purple",
  red: "bg-red-500",
  muted: "bg-text-muted",
} as const;

interface ProgressBarProps {
  value: number; // 0–100
  color?: keyof typeof colorMap;
  className?: string;
}

export default function ProgressBar({
  value,
  color = "lime",
  className,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div
      className={cn("h-1.5 w-full bg-border-muted rounded-full overflow-hidden", className)}
    >
      <div
        className={cn("h-full rounded-full transition-all", colorMap[color])}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

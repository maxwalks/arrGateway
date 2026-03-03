import { cn } from "@/lib/cn";

const variants = {
  lime: "bg-accent-lime/10 text-accent-lime border-accent-lime/20",
  amber: "bg-accent-amber/10 text-accent-amber border-accent-amber/20",
  purple: "bg-accent-purple/10 text-accent-purple border-accent-purple/20",
  cyan: "bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20",
  red: "bg-red-500/10 text-red-400 border-red-500/20",
  muted: "bg-border-muted/40 text-text-muted border-border-muted",
} as const;

interface BadgeProps {
  variant?: keyof typeof variants;
  children: React.ReactNode;
  className?: string;
}

export default function Badge({
  variant = "muted",
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

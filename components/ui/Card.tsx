import { cn } from "@/lib/cn";

const accentBorder = {
  purple: "border-accent-purple",
  lime: "border-accent-lime",
  amber: "border-accent-amber",
  none: "border-border-muted",
} as const;

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  accent?: keyof typeof accentBorder;
}

export default function Card({
  accent = "none",
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "bg-surface border rounded-xl",
        accentBorder[accent],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

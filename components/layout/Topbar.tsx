interface TopbarProps {
  title: string;
  actions?: React.ReactNode;
}

export default function Topbar({ title, actions }: TopbarProps) {
  return (
    <header className="h-14 border-b border-border-muted flex items-center justify-between px-6 bg-background">
      <h1 className="text-base font-semibold text-text-primary">{title}</h1>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </header>
  );
}

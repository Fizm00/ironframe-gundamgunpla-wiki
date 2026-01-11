import { Database } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
    icon?: LucideIcon;
    title?: string;
    message?: string;
    className?: string;
}

export function EmptyState({
    icon: Icon = Database,
    title = "NO DATA FOUND",
    message = "TRY ADJUSTING SEARCH PARAMETERS",
    className = "h-64"
}: EmptyStateProps) {
    return (
        <div className={`${className} flex flex-col items-center justify-center text-foreground-muted border border-dashed border-border`}>
            <Icon className="w-12 h-12 mb-4 opacity-50" />
            <h3 className="font-orbitron text-xl">{title}</h3>
            <p className="font-mono text-sm uppercase">{message}</p>
        </div>
    );
}

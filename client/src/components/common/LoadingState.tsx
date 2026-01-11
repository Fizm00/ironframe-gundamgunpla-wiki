import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
    message?: string;
    className?: string;
    iconClassName?: string;
}

export function LoadingState({
    message = "LOADING...",
    className = "h-96",
    iconClassName = "text-neon-cyan"
}: LoadingStateProps) {
    return (
        <div className={`${className} flex flex-col items-center justify-center gap-4`}>
            <Loader2 className={`w-12 h-12 animate-spin ${iconClassName}`} />
            <p className="font-mono text-foreground-muted animate-pulse tracking-widest uppercase">{message}</p>
        </div>
    );
}

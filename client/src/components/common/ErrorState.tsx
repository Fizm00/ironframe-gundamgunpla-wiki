import { AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
    title?: string;
    message?: string;
    className?: string;
}

export function ErrorState({
    title = "CONNECTION FAULT",
    message = "UNABLE TO RETRIEVE DATA PACKETS",
    className = "h-64"
}: ErrorStateProps) {
    return (
        <div className={`${className} flex flex-col items-center justify-center text-destructive border border-destructive/20 bg-destructive/5`}>
            <AlertTriangle className="w-12 h-12 mb-4" />
            <h3 className="font-orbitron text-xl uppercase">{title}</h3>
            <p className="font-mono opacity-70 uppercase">{message}</p>
        </div>
    );
}

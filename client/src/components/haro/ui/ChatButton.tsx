import { MessageSquareText } from 'lucide-react';

interface ChatButtonProps {
    onClick: () => void;
}

export function ChatButton({ onClick }: ChatButtonProps) {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-slate-950 text-neon-blue border border-neon-blue rounded-full shadow-lg hover:bg-neon-blue hover:text-black transition-all duration-300 hover:scale-105 active:scale-95 group"
            aria-label="Open Haro Chat"
        >
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-[2.5px] border-slate-950 z-10"></div>
            <MessageSquareText className="w-7 h-7" strokeWidth={2.5} />
        </button>
    );
}

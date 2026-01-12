import { useState } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
    onSend: (text: string) => void;
    isLoading: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
    const [value, setValue] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!value.trim() || isLoading) return;
        onSend(value);
        setValue('');
    };

    return (
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
            <form onSubmit={handleSubmit} className="relative group">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Type your question..."
                    className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-500 rounded-lg py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all border border-transparent font-medium text-sm"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={!value.trim() || isLoading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 rounded-md hover:bg-indigo-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                    aria-label="Send Message"
                >
                    <Send className="w-4 h-4" />
                </button>
            </form>
            <div className="text-[10px] text-center mt-3 text-slate-400 flex items-center justify-center gap-1.5 opacity-60">
                IronFrame Intelligence • Powered by Google Gemini
            </div>
        </div>
    );
}

import { useRef, useEffect } from 'react';
import { Bot, RefreshCw, X } from 'lucide-react';
import { MessageItem } from './MessageItem';
import { ChatInput } from './ChatInput';
import type { Message } from '../types';

interface ChatWindowProps {
    messages: Message[];
    isLoading: boolean;
    onSend: (text: string) => void;
    onClear: () => void;
    onClose: () => void;
}

export function ChatWindow({ messages, isLoading, onSend, onClear, onClose }: ChatWindowProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] sm:w-[450px] h-[600px] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-200 bg-white dark:bg-slate-950 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 font-sans">
            <div className="px-5 py-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-neon-blue border border-slate-700">
                        <Bot className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold font-orbitron text-slate-800 dark:text-white text-sm leading-tight tracking-wide">IronFrame Assistant</h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono font-medium flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                            SYSTEM ONLINE
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={onClear}
                        className="text-slate-400 hover:text-neon-blue p-2 rounded-md hover:bg-slate-800 transition-colors"
                        title="Clear Chat"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-red-500 p-2 rounded-md hover:bg-slate-800 transition-colors"
                        title="Close Chat"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent bg-slate-50 dark:bg-slate-950">
                {messages.map((msg) => (
                    <MessageItem key={msg.id} message={msg} />
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl rounded-tl-sm p-4 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <ChatInput onSend={onSend} isLoading={isLoading} />
        </div>
    );
}

import { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, RefreshCw, MessageSquareText } from 'lucide-react';
import api from '@/lib/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'haro';
    timestamp: Date;
}

export function HaroChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            text: "IronFrame Archive System Online. Asking for query...",
            sender: 'haro',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await api.post<{ answer: string }>('/chat/ask', { query: userMessage.text });

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: response.data.answer,
                sender: 'haro',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: "System Error. Connection interrupted.",
                sender: 'haro',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating Chat Button - Wireframe Style */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-slate-950 text-neon-blue border border-neon-blue rounded-full shadow-lg hover:bg-neon-blue hover:text-black transition-all duration-300 hover:scale-105 active:scale-95 group"
                >
                    <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-[2.5px] border-slate-950 z-10"></div>
                    <MessageSquareText className="w-7 h-7" strokeWidth={2.5} />
                    <span className="sr-only">Open Chat</span>
                </button>
            )}

            {/* Chat Window - Modern & Professional */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 z-50 w-[380px] sm:w-[450px] h-[600px] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-200 bg-white dark:bg-slate-950 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 font-sans">

                    {/* Header */}
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
                                onClick={() => setMessages([])}
                                className="text-slate-400 hover:text-neon-blue p-2 rounded-md hover:bg-slate-800 transition-colors"
                                title="Clear Chat"
                            >
                                <RefreshCw className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-slate-400 hover:text-red-500 p-2 rounded-md hover:bg-slate-800 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent bg-slate-50 dark:bg-slate-950">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${msg.sender === 'user'
                                        ? 'bg-cyan-950/40 border border-cyan-800/50 text-cyan-50 font-medium rounded-tr-sm'
                                        : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-tl-sm border border-slate-200 dark:border-slate-800'
                                        }`}
                                >
                                    {msg.sender === 'haro' ? (
                                        <div className="prose prose-sm max-w-none dark:prose-invert prose-p:leading-relaxed prose-p:mb-3 prose-ul:my-2 prose-li:my-0.5">
                                            <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                                                {msg.text}
                                            </ReactMarkdown>
                                        </div>
                                    ) : (
                                        msg.text
                                    )}
                                </div>
                            </div>
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

                    {/* Input Area */}
                    <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
                        <form onSubmit={handleSendMessage} className="relative group">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Type your question..."
                                className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-500 rounded-lg py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all border border-transparent font-medium text-sm"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={!inputValue.trim() || isLoading}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 rounded-md hover:bg-indigo-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                        <div className="text-[10px] text-center mt-3 text-slate-400 flex items-center justify-center gap-1.5 opacity-60">
                            IronFrame Intelligence • Powered by Google Gemini
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

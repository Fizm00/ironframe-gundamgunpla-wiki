import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import type { Message } from '../types';

interface MessageItemProps {
    message: Message;
}

export function MessageItem({ message }: MessageItemProps) {
    const isUser = message.sender === 'user';

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${isUser
                        ? 'bg-cyan-950/40 border border-cyan-800/50 text-cyan-50 font-medium rounded-tr-sm'
                        : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-tl-sm border border-slate-200 dark:border-slate-800'
                    }`}
            >
                {message.sender === 'haro' ? (
                    <div className="prose prose-sm max-w-none dark:prose-invert prose-p:leading-relaxed prose-p:mb-3 prose-ul:my-2 prose-li:my-0.5">
                        <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                            {message.text}
                        </ReactMarkdown>
                    </div>
                ) : (
                    message.text
                )}
            </div>
        </div>
    );
}

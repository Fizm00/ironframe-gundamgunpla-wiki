import { useState, useRef, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import type { Message } from '../types';

export function useHaroChat() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            text: "IronFrame Archive System Online. Asking for query...",
            sender: 'haro',
            timestamp: new Date()
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    const sendMessage = async (text: string) => {
        if (!text.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
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
            console.error("Haro Chat Error:", error);
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

    const clearMessages = () => setMessages([]);

    return {
        messages,
        isLoading,
        sendMessage,
        clearMessages,
        messagesEndRef
    };
}

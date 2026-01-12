import { useState } from 'react';
import { useHaroChat } from './hooks/useHaroChat';
import { ChatButton } from './ui/ChatButton';
import { ChatWindow } from './ui/ChatWindow';

export function HaroChat() {
    const [isOpen, setIsOpen] = useState(false);
    const { messages, isLoading, sendMessage, clearMessages } = useHaroChat();

    return (
        <>
            {!isOpen && <ChatButton onClick={() => setIsOpen(true)} />}

            {isOpen && (
                <ChatWindow
                    messages={messages}
                    isLoading={isLoading}
                    onSend={sendMessage}
                    onClear={clearMessages}
                    onClose={() => setIsOpen(false)}
                />
            )}
        </>
    );
}

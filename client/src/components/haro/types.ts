export type MessageSender = 'user' | 'haro';

export interface Message {
    id: string;
    text: string;
    sender: MessageSender;
    timestamp: Date;
}

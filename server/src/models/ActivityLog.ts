
import mongoose, { Document, Schema } from 'mongoose';

export interface IActivityLog extends Document {
    action: string; // e.g., "Created", "Updated", "Deleted"
    entity: string; // e.g., "Mobile Suit", "Pilot", "Gunpla"
    details: string; // e.g., "RX-78-2 Gundam"
    user: string; // Username or ID who performed the action
    timestamp: Date;
}

const ActivityLogSchema: Schema = new Schema({
    action: { type: String, required: true },
    entity: { type: String, required: true },
    details: { type: String, required: true },
    user: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

export const ActivityLog = mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);

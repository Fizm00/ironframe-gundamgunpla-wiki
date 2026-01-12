
import mongoose, { Document, Schema } from 'mongoose';

export interface IActivityLog extends Document {
    action: string;
    entity: string;
    details: string;
    user: string;
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

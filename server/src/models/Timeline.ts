import mongoose, { Document, Schema } from 'mongoose';

export interface ITimeline extends Document {
    name: string;
    description: string;
    imageUrl?: string;
    series: string[]; // List of series in this timeline
    order: number; // For sorting eras chronologically (UC first, etc)
    createdAt: Date;
    updatedAt: Date;
}

const TimelineSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    imageUrl: { type: String },
    series: [{ type: String }],
    order: { type: Number, default: 0 }
}, {
    timestamps: true
});

export const Timeline = mongoose.model<ITimeline>('Timeline', TimelineSchema);

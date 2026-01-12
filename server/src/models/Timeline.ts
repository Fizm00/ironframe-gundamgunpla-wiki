import mongoose, { Document, Schema } from 'mongoose';

export interface ITimeline extends Document {
    name: string;
    description: string;
    imageUrl?: string;
    series: string[];
    order: number;
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

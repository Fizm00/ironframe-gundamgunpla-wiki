import mongoose, { Document, Schema } from 'mongoose';

export interface ITimelineEvent extends Document {
    title: string;
    year: string;
    date: string;
    description: string;
    timeline?: mongoose.Types.ObjectId;
    involvedFactions: mongoose.Types.ObjectId[];
    imageUrl: string;
    createdAt: Date;
    updatedAt: Date;
}

const TimelineEventSchema: Schema = new Schema({
    title: { type: String, required: true },
    year: { type: String, required: true },
    date: { type: String },
    description: { type: String },
    timeline: { type: mongoose.Schema.Types.ObjectId, ref: 'Timeline' },
    involvedFactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Faction' }],
    imageUrl: { type: String }
}, {
    timestamps: true
});

TimelineEventSchema.index({ title: 'text', description: 'text', year: 'text' });

export const TimelineEvent = mongoose.model<ITimelineEvent>('TimelineEvent', TimelineEventSchema);

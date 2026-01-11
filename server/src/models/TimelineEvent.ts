import mongoose, { Document, Schema } from 'mongoose';

export interface ITimelineEvent extends Document {
    title: string;
    year: string; // e.g., "UC 0079"
    date: string; // exact date if known
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
// Sort by Year logic could be complex with string years (UC, CE etc), standardizing on a numeric field later might be good.
// For now, rely on standard query sorting.

export const TimelineEvent = mongoose.model<ITimelineEvent>('TimelineEvent', TimelineEventSchema);

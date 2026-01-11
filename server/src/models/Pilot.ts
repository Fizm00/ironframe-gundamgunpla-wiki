import mongoose, { Document, Schema } from 'mongoose';

export interface IPilot extends Document {
    name: string;
    callsign: string;
    age: number;
    rank: string;
    faction: mongoose.Types.ObjectId;
    mobileSuits: mongoose.Types.ObjectId[];
    status: 'Active' | 'KIA' | 'MIA' | 'Retired';
    description: string;
    imageUrl: string;
    createdAt: Date;
    updatedAt: Date;
}

const PilotSchema: Schema = new Schema({
    name: { type: String, required: true },
    callsign: { type: String },
    age: { type: Number },
    rank: { type: String },
    faction: { type: mongoose.Schema.Types.ObjectId, ref: 'Faction' },
    mobileSuits: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MobileSuit' }],
    status: {
        type: String,
        enum: ['Active', 'KIA', 'MIA', 'Retired'],
        default: 'Active'
    },
    description: { type: String },
    imageUrl: { type: String }
}, {
    timestamps: true
});

PilotSchema.index({ name: 'text', callsign: 'text' });

export const Pilot = mongoose.model<IPilot>('Pilot', PilotSchema);

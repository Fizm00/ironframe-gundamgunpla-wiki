import mongoose, { Document, Schema } from 'mongoose';

export interface ILoreMobileSuit extends Document {
    name: string;
    series: string;
    faction?: string; // ObjectId represented as string
    url: string;
    imageUrl?: string;
    description?: string;
    history?: string;
    design?: string;
    production?: Record<string, string>; // Key-Value pairs like "Manufacturer": "Anaheim Electronics"
    development?: Record<string, string>; // "Developed from": "RX-78-2"
    specifications?: Record<string, string>; // "Height": "18.0m"
    performance?: string | Record<string, string>; // "Max Speed": "100 km/h" or text block
    armaments?: { category: string; items: string[] }[];
    variants?: string[];
    knownPilots?: string[];
    appearances?: string[];
    behindTheScenes?: string;

    createdAt: Date;
    updatedAt: Date;
}

const LoreMobileSuitSchema: Schema = new Schema({
    name: { type: String, required: true, index: true },
    series: { type: String, index: true },
    faction: { type: Schema.Types.ObjectId, ref: 'Faction', index: true },
    url: { type: String, required: true, unique: true },
    imageUrl: { type: String },
    description: { type: String },

    history: { type: String },
    design: { type: String },
    production: { type: Schema.Types.Mixed },
    development: { type: Schema.Types.Mixed },
    specifications: { type: Schema.Types.Mixed },
    performance: { type: Schema.Types.Mixed },
    armaments: [{
        category: String,
        items: [String]
    }],
    variants: [{ type: String }],
    knownPilots: [{ type: String }],
    appearances: [{ type: String }],
    behindTheScenes: { type: String }
}, {
    timestamps: true
});

LoreMobileSuitSchema.index({ name: 'text', description: 'text', series: 'text' });

export const LoreMobileSuit = mongoose.model<ILoreMobileSuit>('LoreMobileSuit', LoreMobileSuitSchema);

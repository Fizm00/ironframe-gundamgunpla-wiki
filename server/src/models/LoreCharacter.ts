import mongoose, { Document, Schema } from 'mongoose';

export interface ILoreCharacter extends Document {
    name: string;
    url: string;
    series: string;
    description: string;
    history: string;
    personality?: string;
    skills?: string;
    notes?: string;
    profile: Record<string, string>;
    mecha: string[];
    vehicles: string[];
    imageUrl: string;
    createdAt: Date;
    updatedAt: Date;
}

const LoreCharacterSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    url: { type: String, required: true, unique: true },
    series: { type: String, default: 'Unknown' },
    description: { type: String },
    history: { type: String },
    personality: { type: String },
    skills: { type: String },
    notes: { type: String },
    profile: { type: Map, of: String },
    mecha: [{ type: String }],
    vehicles: [{ type: String }],
    imageUrl: { type: String }
}, {
    timestamps: true
});

LoreCharacterSchema.index({ name: 'text', series: 'text' });
LoreCharacterSchema.index({ mecha: 1 });

export const LoreCharacter = mongoose.model<ILoreCharacter>('LoreCharacter', LoreCharacterSchema);

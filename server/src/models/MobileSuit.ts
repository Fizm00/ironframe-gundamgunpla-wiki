import mongoose, { Document, Schema } from 'mongoose';

export interface IMobileSuit extends Document {
    name: string;
    modelNumber: string;
    manufacturer: string;
    operator: string;
    description: string;
    imageUrl: string;
    height: number; // in meters
    weight: number; // in tons
    armor: string;
    powerOutput: number; // in kW
    scale: string;
    price: number;
    armaments: string[];
    pilots: mongoose.Types.ObjectId[];
    faction?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const MobileSuitSchema: Schema = new Schema({
    name: { type: String, required: true },
    modelNumber: { type: String, required: true, unique: true },
    manufacturer: { type: String, required: true },
    operator: { type: String },
    description: { type: String },
    imageUrl: { type: String },
    grade: { type: String, index: true },
    scale: { type: String },
    price: { type: Number },
    releaseDate: { type: String },
    height: { type: Number },
    weight: { type: Number },
    armor: { type: String },
    powerOutput: { type: Number },
    armaments: [{ type: String }],
    pilots: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pilot' }],
    faction: { type: mongoose.Schema.Types.ObjectId, ref: 'Faction' }
}, {
    timestamps: true
});

// Index for search
MobileSuitSchema.index({ name: 'text', modelNumber: 'text', description: 'text' });

export const MobileSuit = mongoose.model<IMobileSuit>('MobileSuit', MobileSuitSchema);

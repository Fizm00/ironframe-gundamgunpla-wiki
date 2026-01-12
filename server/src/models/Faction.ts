import mongoose, { Schema, Document } from 'mongoose';

export interface IFaction extends Document {
    name: string;
    names?: {
        en?: string;
        ja?: string;
    };
    activeEra: string;
    description?: string;
    imageUrl?: string;
    leaders: string[];
    organizationType?: string;

    purpose?: string;
    sphereOfInfluence?: string;
    allies: string[];
    enemies: string[];
    firstSeen?: string;
    lastSeen?: string;
    appearances: string[];
    information?: string;

    history?: string;
    government?: string;
    military?: string;
    behindTheScenes?: string;
    technologies?: string;

    vehicles: string[];
    mobileWeapons: string[];
    miscellaneous: string[];

    forces: {
        name: string;
        description?: string;
        imageUrl?: string;
        purpose?: string;
        ledBy: string[];
        parent?: string;
        subdivisions: string[];
        allies: string[];
        enemies: string[];
        firstSeen?: string;
        lastSeen?: string;

        headquarters?: string;

        history?: string;
        branches: string[];
        majorMilitaryBases: string[];
        members: string[];
        militaryRanks: string[];

        mobileWeapons: string[];
        vehicles: string[];
        teams: string[];
    }[];

    createdAt: Date;
    updatedAt: Date;
}

const FactionSchema: Schema = new Schema({
    name: { type: String, required: true },
    names: {
        en: { type: String },
        ja: { type: String }
    },
    activeEra: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String },
    leaders: [{ type: String }],
    organizationType: { type: String },

    purpose: { type: String },
    sphereOfInfluence: { type: String },
    allies: [{ type: String }],
    enemies: [{ type: String }],
    firstSeen: { type: String },
    lastSeen: { type: String },
    appearances: [{ type: String }],
    information: { type: String },

    history: { type: String },
    government: { type: String },
    military: { type: String },
    behindTheScenes: { type: String },
    technologies: { type: String },

    vehicles: [{ type: String }],
    mobileWeapons: [{ type: String }],
    miscellaneous: [{ type: String }],

    forces: [{
        name: { type: String, required: true },
        description: { type: String },
        imageUrl: { type: String },

        purpose: { type: String },
        ledBy: [{ type: String }],
        parent: { type: String },
        subdivisions: [{ type: String }],
        allies: [{ type: String }],
        enemies: [{ type: String }],
        firstSeen: { type: String },
        lastSeen: { type: String },

        headquarters: { type: String },

        history: { type: String },

        branches: [{ type: String }],
        majorMilitaryBases: [{ type: String }],
        members: [{ type: String }],
        militaryRanks: [{ type: String }],

        mobileWeapons: [{ type: String }],
        vehicles: [{ type: String }],
        teams: [{ type: String }]
    }]
}, {
    timestamps: true
});

FactionSchema.index({ name: 1, activeEra: 1 }, { unique: true });

FactionSchema.index({ name: 'text', description: 'text', 'names.en': 'text' });

export const Faction = mongoose.model<IFaction>('Faction', FactionSchema);

export interface LoreCharacter {
    _id: string;
    name: string;
    url: string;
    series: string;
    description?: string;
    history?: string;
    personality?: string;
    skills?: string;
    notes?: string;
    profile?: Record<string, string>;
    mecha?: string[];
    vehicles?: string[];
    imageUrl?: string;
    createdAt: string;
    updatedAt: string;
}

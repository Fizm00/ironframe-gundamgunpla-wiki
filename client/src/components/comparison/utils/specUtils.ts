import type { LoreMobileSuit } from '@/services/lore';

export const getNormalizedSpec = (suit: LoreMobileSuit, key: string): string => {
    // Helper to find key case-insensitively
    const check = (obj: Record<string, string> | undefined, targets: string[]) => {
        if (!obj) return undefined;
        for (const t of targets) {
            const found = Object.keys(obj).find(k => k.toLowerCase() === t.toLowerCase() || k.toLowerCase().includes(t.toLowerCase()));
            if (found) return obj[found];
        }
        return undefined;
    };

    let val: string | undefined = undefined;

    // Normalization Mapping
    switch (key) {
        case 'Model Number':
            val = check(suit.specifications, ['Model number', 'Model']);
            break;
        case 'Height':
            val = check(suit.specifications, ['Overall height', 'Head height', 'Height']);
            break;
        case 'Weight':
            val = check(suit.specifications, ['Empty weight', 'Base weight', 'Weight']);
            break;
        case 'Max Weight':
            val = check(suit.specifications, ['Full weight', 'Max weight', 'Mass']);
            break;
        case 'Armor Materials':
            val = check(suit.specifications, ['Armor materials', 'Armor']);
            break;
        case 'Power Output':
            val = check(suit.performance, ['Power output', 'Generator output']) ||
                check(suit.specifications, ['Power output', 'Generator output']);
            break;
        case 'Total Thrust':
            val = check(suit.performance, ['Propulsion', 'Thrust', 'Total thrust']) ||
                check(suit.specifications, ['Propulsion', 'Thrust']);
            break;
        case 'Sensor Radius':
            val = check(suit.performance, ['Sensor radius', 'Sensors range']) ||
                check(suit.specifications, ['Sensor radius', 'Sensors']);
            break;
        default:
            val = undefined;
    }

    return val || '-';
};

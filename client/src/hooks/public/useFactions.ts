import { useState, useEffect } from 'react';
import { factionService } from '@/services/factions';
import type { Faction } from '@/services/factions';
import { useDebounce } from '@/hooks/useDebounce';

export function useFactions() {
    const [factions, setFactions] = useState<Faction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        const fetchFactions = async () => {
            setLoading(true);
            try {
                const data = await factionService.getAll({ search: debouncedSearch });
                setFactions(data);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch factions", err);
                setError("Failed to load faction data.");
            } finally {
                setLoading(false);
            }
        };

        fetchFactions();
    }, [debouncedSearch]);

    // Grouping helper
    const groupedFactions = factions.reduce((acc, faction) => {
        const era = faction.activeEra || 'Unknown Era';
        if (!acc[era]) acc[era] = [];
        acc[era].push(faction);
        return acc;
    }, {} as Record<string, Faction[]>);

    // Get sorted Eras (simple string sort for now, or define order constant)
    // Defined Era Order
    const eraOrder = [
        "Universal Century",
        "Future Century",
        "After Colony",
        "After War",
        "Correct Century",
        "Cosmic Era",
        "Anno Domini", // User wrote "Amno Domini" but "Anno Domini" is correct for Gundam 00. I will check standard usage.
        "Advanced Generation",
        "Regild Century",
        "Post Disaster",
        "Build Fighters", // Often categorized separately
        "Ad Stella"
    ];

    const eras = Object.keys(groupedFactions).sort((a, b) => {
        const indexA = eraOrder.indexOf(a);
        const indexB = eraOrder.indexOf(b);

        // If both are in the list, sort by index
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        // If only A is in list, it comes first
        if (indexA !== -1) return -1;
        // If only B is in list, it comes first
        if (indexB !== -1) return 1;
        // Fallback to alphabetical for unknown eras
        return a.localeCompare(b);
    });

    return {
        factions,
        groupedFactions,
        eras,
        loading,
        error,
        search,
        setSearch
    };
}

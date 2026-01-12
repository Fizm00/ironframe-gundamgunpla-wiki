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

    const groupedFactions = factions.reduce((acc, faction) => {
        const era = faction.activeEra || 'Unknown Era';
        if (!acc[era]) acc[era] = [];
        acc[era].push(faction);
        return acc;
    }, {} as Record<string, Faction[]>);


    const eraOrder = [
        "Universal Century",
        "Future Century",
        "After Colony",
        "After War",
        "Correct Century",
        "Cosmic Era",
        "Anno Domini",
        "Advanced Generation",
        "Regild Century",
        "Post Disaster",
        "Build Fighters",
        "Ad Stella"
    ];

    const eras = Object.keys(groupedFactions).sort((a, b) => {
        const indexA = eraOrder.indexOf(a);
        const indexB = eraOrder.indexOf(b);

        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
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

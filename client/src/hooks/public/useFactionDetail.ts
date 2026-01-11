import { useState, useEffect } from 'react';
import { factionService } from '../../services/factions';
import type { Faction } from '../../services/factions';

interface UseFactionDetailReturn {
    faction: Faction | null;
    isLoading: boolean;
    error: string | null;
}

export const useFactionDetail = (id: string | undefined): UseFactionDetailReturn => {
    const [faction, setFaction] = useState<Faction | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFaction = async () => {
            if (!id) return;

            try {
                setIsLoading(true);
                const data = await factionService.getById(id);
                setFaction(data);
                setError(null);
            } catch (err: any) {
                console.error('Error fetching faction details:', err);
                setError('Failed to load faction details.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchFaction();
    }, [id]);

    return { faction, isLoading, error };
};

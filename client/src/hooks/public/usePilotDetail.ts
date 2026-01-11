import { useState, useEffect } from 'react';
import axios from 'axios';
import type { LoreCharacter } from '@/types/LoreCharacter';

export function usePilotDetail(id?: string) {
    const [character, setCharacter] = useState<LoreCharacter | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }

        const fetchCharacter = async () => {
            setLoading(true);
            setError(false);
            try {
                const { data } = await axios.get(`/api/lore-characters/${id}`);
                setCharacter(data);
            } catch (err) {
                console.error('Error fetching character:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchCharacter();
    }, [id]);

    return { character, loading, error };
}

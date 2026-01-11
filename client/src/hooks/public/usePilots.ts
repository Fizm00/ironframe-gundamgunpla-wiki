import { useState, useEffect } from 'react';
import axios from 'axios';
import type { LoreCharacter } from '@/types/LoreCharacter';

import { useDebounce } from '../useDebounce';

export function usePilots() {
    const [characters, setCharacters] = useState<LoreCharacter[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Debounce search term only
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        const fetchCharacters = async () => {
            setLoading(true);
            setError(false);
            try {
                const { data } = await axios.get('/api/lore-characters', {
                    params: {
                        page,
                        limit: 12,
                        search: debouncedSearch
                    }
                });
                setCharacters(data.characters || []);
                setTotalPages(data.pages || 1);
            } catch (err) {
                console.error('Error fetching pilots:', err);
                setCharacters([]);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchCharacters();
    }, [debouncedSearch, page]);

    return {
        characters,
        loading,
        error,
        search,
        setSearch,
        page,
        setPage,
        totalPages
    };
}

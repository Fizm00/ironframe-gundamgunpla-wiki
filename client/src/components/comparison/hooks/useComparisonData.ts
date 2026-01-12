import { useState, useEffect } from 'react';
import { useComparison } from '@/context/ComparisonContext';
import { loreService, type LoreMobileSuit } from '@/services/lore';

export function useComparisonData() {
    const { selectedIds, removeMobileSuit } = useComparison();
    const [suits, setSuits] = useState<LoreMobileSuit[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (selectedIds.length === 0) {
                setSuits([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const promises = selectedIds.map(id => loreService.getById(id));
                const results = await Promise.all(promises);
                setSuits(results);
            } catch (error) {
                console.error("Failed to fetch comparison data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedIds]);

    return {
        suits,
        loading,
        selectedIds,
        removeMobileSuit
    };
}

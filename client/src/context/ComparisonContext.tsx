import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface ComparisonContextType {
    selectedIds: string[];
    addMobileSuit: (id: string, name: string) => void;
    removeMobileSuit: (id: string) => void;
    clearComparison: () => void;
    isInComparison: (id: string) => boolean;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export function ComparisonProvider({ children }: { children: React.ReactNode }) {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('ironframe_comparison');
        if (saved) {
            try {
                setSelectedIds(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to load comparison state", e);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('ironframe_comparison', JSON.stringify(selectedIds));
    }, [selectedIds]);

    const addMobileSuit = (id: string, name: string) => {
        if (selectedIds.includes(id)) {
            toast.error(`${name} is already in comparison!`);
            return;
        }
        if (selectedIds.length >= 3) {
            toast.error("Can only compare up to 3 Mobile Suits.");
            return;
        }
        setSelectedIds(prev => [...prev, id]);
        toast.success(`Added ${name} to comparison`);
    };

    const removeMobileSuit = (id: string) => {
        setSelectedIds(prev => prev.filter(item => item !== id));
    };

    const clearComparison = () => {
        setSelectedIds([]);
        toast.success("Comparison cleared");
    };

    const isInComparison = (id: string) => selectedIds.includes(id);

    return (
        <ComparisonContext.Provider value={{ selectedIds, addMobileSuit, removeMobileSuit, clearComparison, isInComparison }}>
            {children}
        </ComparisonContext.Provider>
    );
}

export function useComparison() {
    const context = useContext(ComparisonContext);
    if (context === undefined) {
        throw new Error('useComparison must be used within a ComparisonProvider');
    }
    return context;
}

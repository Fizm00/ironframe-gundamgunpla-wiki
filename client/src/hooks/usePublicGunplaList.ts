
import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { mobileSuitService } from '@/services/mobileSuits';
import { useDebounce } from '@/hooks/useDebounce';

export function usePublicGunplaList() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const [selectedGrade, setSelectedGrade] = useState('');

    const grades = ["HG", "RG", "MG", "PG", "EG", "SD", "FM", "MGEX"];

    const { data, isLoading, isError } = useQuery({
        queryKey: ['mobileSuits', page, debouncedSearch, selectedGrade],
        queryFn: () => mobileSuitService.getAll({
            page,
            limit: 30,
            keyword: debouncedSearch,
            grade: selectedGrade
        }),
        placeholderData: keepPreviousData
    });

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const handleGradeFilter = (grade: string) => {
        setSelectedGrade(grade === selectedGrade ? '' : grade);
        setPage(1);
    };

    return {
        suits: data?.mobileSuits || [],
        totalPages: data?.pages || 1,
        isLoading,
        isError,
        page,
        setPage,
        search,
        handleSearch,
        selectedGrade,
        handleGradeFilter,
        grades
    };
}

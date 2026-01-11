
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { loreService } from '@/services/lore';
import type { LoreMobileSuit } from '@/services/lore';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, Plus, Search, Loader2 } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

export function LoreList() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const queryClient = useQueryClient();

    const { data, isLoading, isPlaceholderData } = useQuery({
        queryKey: ['loreMobileSuits', page, debouncedSearch],
        queryFn: () => loreService.getAll({ page, limit: 10, search: debouncedSearch }),
        placeholderData: keepPreviousData
    });

    const deleteMutation = useMutation({
        mutationFn: loreService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['loreMobileSuits'] });
        },
        onError: (error: Error) => {
            alert(`Error deleting: ${error.message}`);
        }
    });

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this Mobile Suit entry?')) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-orbitron font-bold text-foreground mb-2">Lore Database</h1>
                    <p className="text-foreground-muted text-sm">Manage Mechabay lore entries.</p>
                </div>

                <Link to="/admin/lore/new" className="bg-primary text-primary-foreground font-bold font-orbitron px-4 py-2 rounded hover:bg-primary/90 transition flex items-center">
                    <Plus className="w-4 h-4 mr-2" /> Add New Entry
                </Link>
            </div>

            <div className="bg-surface/50 border border-border rounded-lg overflow-hidden backdrop-blur-sm">
                <div className="p-4 border-b border-border flex items-center bg-surface-hover/20">
                    <Search className="w-5 h-5 text-foreground-muted mr-3" />
                    <input
                        type="text"
                        placeholder="Search Mobile Suits..."
                        className="bg-transparent border-none outline-none text-foreground w-full font-mono text-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        autoFocus
                    />
                    {isLoading && <Loader2 className="w-4 h-4 animate-spin text-primary ml-2" />}
                </div>

                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-surface-hover text-xs text-primary uppercase font-orbitron">
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Series</th>
                                <th className="px-6 py-4">Updated</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {isLoading && !data ? (
                                <tr>
                                    <td colSpan={4} className="text-center py-20 text-primary">
                                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                                        Loading Data...
                                    </td>
                                </tr>
                            ) : data?.mobileSuits.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="text-center py-20 text-foreground-muted font-mono">
                                        No entries found.
                                    </td>
                                </tr>
                            ) : (
                                data?.mobileSuits.map((suit: LoreMobileSuit) => (
                                    <tr key={suit._id} className={`hover:bg-surface-hover transition-colors ${isPlaceholderData ? 'opacity-50' : ''}`}>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-foreground">{suit.name}</div>
                                            <div className="text-xs text-foreground-muted font-mono">{suit.url}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-foreground/70">{suit.series || 'N/A'}</td>
                                        <td className="px-6 py-4 text-sm text-foreground-muted font-mono">
                                            {new Date().toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <Link to={`/admin/lore/${suit._id}/edit`} className="inline-block p-2 text-primary hover:bg-primary/10 rounded">
                                                <Edit2 className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(suit._id!)}
                                                className="inline-block p-2 text-destructive hover:bg-destructive/10 rounded"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-border flex justify-between items-center text-xs text-foreground-muted">
                    <div>Page {data?.page || 1} of {data?.pages || 1} ({data?.total || 0} entries)</div>
                    <div className="space-x-2">
                        <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 bg-surface-hover rounded hover:bg-surface disabled:opacity-30 border border-border">Prev</button>
                        <button disabled={page === (data?.pages || 1)} onClick={() => setPage(p => p + 1)} className="px-3 py-1 bg-surface-hover rounded hover:bg-surface disabled:opacity-30 border border-border">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

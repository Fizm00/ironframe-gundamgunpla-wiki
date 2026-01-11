import { useMobileSuitList } from '@/hooks/admin/useMobileSuitList';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, Plus, Search } from 'lucide-react';
import { AdminTable, AdminPagination } from '@/components/admin/ui/AdminTable';
import type { LoreMobileSuit } from '@/services/lore';

export function MobileSuitList() {
    const { data, isLoading, setPage, search, setSearch, handleDelete } = useMobileSuitList();

    const columns = [
        {
            header: "Image",
            accessor: (suit: LoreMobileSuit) => (
                <div className="w-16 h-16 rounded overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900">
                    {suit.imageUrl ? (
                        <img src={suit.imageUrl} alt={suit.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Img</div>
                    )}
                </div>
            )
        },
        {
            header: "Name",
            accessor: (suit: LoreMobileSuit) => (
                <>
                    <div className="font-bold text-gray-900 dark:text-white">{suit.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">{suit.url}</div>
                </>
            )
        },
        {
            header: "Series",
            accessor: (suit: LoreMobileSuit) => <span className="text-sm text-gray-700 dark:text-gray-300">{suit.series || 'N/A'}</span>
        },
        {
            header: "Updated",
            accessor: () => <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">{new Date().toLocaleDateString()}</span>
        },
        {
            header: "Actions",
            headerClassName: "text-right",
            className: "text-right",
            accessor: (suit: LoreMobileSuit) => (
                <div className="space-x-2">
                    <Link to={`/admin/mobile-suits/${suit._id}/edit`} className="inline-block p-2 text-brand-500 hover:bg-brand-500/10 rounded transition-colors" title="Edit">
                        <Edit2 className="w-4 h-4" />
                    </Link>
                    <button
                        onClick={() => handleDelete(suit._id!, suit.name)}
                        className="inline-block p-2 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                        title="Delete"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-orbitron font-bold text-gray-900 dark:text-white mb-2">Mobile Suits</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Manage Mobile Suit Database entries.</p>
                </div>

                <Link to="/admin/mobile-suits/new" className="bg-brand-500 text-white font-bold font-orbitron px-4 py-2 rounded hover:bg-brand-600 transition flex items-center">
                    <Plus className="w-4 h-4 mr-2" /> Add New Unit
                </Link>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden backdrop-blur-sm">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center bg-gray-50 dark:bg-gray-900/50">
                    <Search className="w-5 h-5 text-gray-400 mr-3" />
                    <input
                        type="text"
                        placeholder="Search Mobile Suits..."
                        className="bg-transparent border-none outline-none text-gray-700 dark:text-gray-200 w-full font-mono text-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        autoFocus
                    />
                </div>

                <AdminTable
                    data={data?.mobileSuits || []}
                    columns={columns}
                    isLoading={isLoading}
                    keyField="_id"
                />

                <AdminPagination
                    currentPage={data?.page || 1}
                    totalPages={data?.pages || 1}
                    totalItems={data?.total || 0}
                    onPageChange={setPage}
                />
            </div>
        </div>
    );
}

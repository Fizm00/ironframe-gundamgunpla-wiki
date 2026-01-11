import { Link } from 'react-router-dom';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { useGunplaList } from '@/hooks/admin/useGunplaList';
import { AdminTable, AdminPagination, AdminSearchBar } from '@/components/admin/ui/AdminTable';
import type { MobileSuit } from '@/services/mobileSuits';

export function GunplaList() {
    const { data, isLoading, page, setPage, search, setSearch, handleDelete } = useGunplaList();

    const columns = [
        {
            header: "Image",
            accessor: (suit: MobileSuit) => (
                <div className="w-16 h-16 rounded overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900">
                    {suit.imageUrl ? (
                        <img src={suit.imageUrl} alt={suit.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Img</div>
                    )}
                </div>
            ),
            className: "w-24"
        },
        {
            header: "Product Name",
            accessor: (suit: MobileSuit) => (
                <div>
                    <div className="font-bold text-gray-900 dark:text-white">{suit.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">{suit.modelNumber}</div>
                </div>
            )
        },
        {
            header: "Grade",
            accessor: (suit: MobileSuit) => (
                <span className={`px-2 py-1 rounded text-xs font-bold font-mono ${suit.grade?.includes('HG') ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/30' :
                    suit.grade?.includes('MG') ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-500/30' :
                        suit.grade?.includes('PG') ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/30' :
                            suit.grade?.includes('RG') ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30' :
                                'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
                    }`}>
                    {suit.grade || 'N/A'}
                </span>
            )
        },
        {
            header: "Manufacturer",
            accessor: (suit: MobileSuit) => (
                <span className="font-exo text-gray-600 dark:text-gray-300">{suit.manufacturer}</span>
            )
        },
        {
            header: "Actions",
            accessor: (suit: MobileSuit) => (
                <div className="flex justify-end gap-2">
                    <Link to={`/admin/gunpla/${suit._id}/edit`} className="inline-block p-2 text-brand-500 hover:bg-brand-500/10 rounded transition-colors" title="Edit">
                        <Edit2 className="w-4 h-4" />
                    </Link>
                    <button
                        onClick={() => handleDelete(suit._id)}
                        className="inline-block p-2 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                        title="Delete"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            ),
            className: "text-right"
        }
    ];

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-orbitron font-bold text-gray-900 dark:text-white mb-2">Gunpla Database</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Manage commercial Gunpla product entries.</p>
                </div>

                <Link to="/admin/gunpla/new" className="bg-brand-500 text-white font-bold font-orbitron px-4 py-2 rounded hover:bg-brand-600 transition flex items-center shadow-lg hover:shadow-brand-500/25">
                    <Plus className="w-4 h-4 mr-2" /> Add New Product
                </Link>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden backdrop-blur-sm">
                <AdminSearchBar value={search} onChange={setSearch} placeholder="Search Gunpla..." isLoading={isLoading} />

                <AdminTable
                    columns={columns}
                    data={data?.mobileSuits || []}
                    isLoading={isLoading}
                    keyField="_id"
                    emptyMessage="No Gunpla entries found."
                />

                <AdminPagination
                    currentPage={page}
                    totalPages={data?.pages || 1}
                    totalItems={data?.total || 0}
                    onPageChange={setPage}
                />
            </div>
        </div>
    );
}

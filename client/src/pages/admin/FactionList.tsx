import { Link } from 'react-router-dom';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { useFactionList } from '@/hooks/admin/useFactionList';
import { AdminTable, AdminSearchBar, AdminPagination } from '@/components/admin/ui/AdminTable';
import type { Column } from '@/components/admin/ui/AdminTable';
import type { Faction } from '@/services/factions';

export function FactionList() {
    const {
        search,
        setSearch,
        page,
        setPage,
        isLoading,
        factions,
        totalItems,
        totalPages,
        handleDelete
    } = useFactionList();

    const columns: Column<Faction>[] = [
        {
            header: "Image",
            accessor: (faction) => (
                <div className="w-16 h-16 rounded overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 shadow-sm">
                    {faction.imageUrl ? (
                        <img src={faction.imageUrl} alt={faction.name} referrerPolicy="no-referrer" className="w-full h-full object-cover object-top" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Img</div>
                    )}
                </div>
            ),
            className: "w-24"
        },
        {
            header: 'Faction Name',
            accessor: (faction) => (
                <div>
                    <div className="font-bold text-gray-900 dark:text-white font-orbitron">{faction.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[250px]">{faction.description?.substring(0, 60)}...</div>
                </div>
            )
        },
        {
            header: 'Active Era',
            accessor: (faction) => (
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30">
                    {faction.activeEra}
                </span>
            )
        },
        {
            header: 'Stats',
            accessor: (faction) => (
                <div className="flex flex-col gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <span>{faction.forces?.length || 0} Forces</span>
                    <span>{faction.mobileWeapons?.length || 0} Mobile Suits</span>
                </div>
            )
        },
        {
            header: 'Actions',
            accessor: (faction) => (
                <div className="flex justify-end gap-2">
                    <Link to={`/admin/factions/${faction._id}/edit`} className="p-2 text-brand-500 hover:bg-brand-500/10 rounded transition-colors" title="Edit">
                        <Edit2 className="w-4 h-4" />
                    </Link>
                    <button
                        onClick={() => handleDelete(faction._id)}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded transition-colors"
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
                    <h1 className="text-3xl font-orbitron font-bold text-gray-900 dark:text-white mb-2">Faction Roster</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Manage geopolitical entities and military organizations.</p>
                </div>
                <Link to="/admin/factions/new" className="bg-brand-500 text-white font-bold font-orbitron px-4 py-2 rounded hover:bg-brand-600 transition flex items-center shadow-lg hover:shadow-brand-500/25">
                    <Plus className="w-4 h-4 mr-2" /> Register Faction
                </Link>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden backdrop-blur-sm shadow-sm">
                <AdminSearchBar
                    value={search}
                    onChange={setSearch}
                    placeholder="Search Factions..."
                    isLoading={isLoading}
                />

                <AdminTable
                    data={factions}
                    columns={columns}
                    isLoading={isLoading}
                    keyField="_id"
                    emptyMessage="No factions found."
                />

                <AdminPagination
                    currentPage={page}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    onPageChange={setPage}
                />
            </div>
        </div>
    );
}

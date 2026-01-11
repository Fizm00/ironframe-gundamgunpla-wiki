import { Link } from 'react-router-dom';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { usePilotList } from '@/hooks/admin/usePilotList';
import { AdminTable, AdminPagination, AdminSearchBar } from '@/components/admin/ui/AdminTable';
import type { LoreCharacter } from '@/types/LoreCharacter';

export function PilotList() {
    const { data, isLoading, page, setPage, search, setSearch, handleDelete } = usePilotList();

    const columns = [
        {
            header: "Image",
            accessor: (pilot: LoreCharacter) => (
                <div className="w-16 h-16 rounded overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 shadow-sm">
                    {pilot.imageUrl ? (
                        <img src={pilot.imageUrl} alt={pilot.name} referrerPolicy="no-referrer" className="w-full h-full object-cover object-top" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Img</div>
                    )}
                </div>
            ),
            className: "w-24"
        },
        {
            header: "Pilot Name",
            accessor: (pilot: LoreCharacter) => (
                <div>
                    <div className="font-bold text-gray-900 dark:text-white font-orbitron">{pilot.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[250px]">{pilot.description?.substring(0, 60)}...</div>
                </div>
            )
        },
        {
            header: "Series / Affiliation",
            accessor: (pilot: LoreCharacter) => (
                <div className="space-y-1">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30">
                        {pilot.series || 'Unknown Series'}
                    </span>
                    {pilot.profile?.['Affiliation'] && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                            {pilot.profile['Affiliation']}
                        </div>
                    )}
                </div>
            )
        },
        {
            header: "Rank",
            accessor: (pilot: LoreCharacter) => (
                <span className="font-mono text-xs font-medium text-gray-600 dark:text-gray-300">
                    {pilot.profile?.['Rank'] || 'N/A'}
                </span>
            )
        },
        {
            header: "Actions",
            accessor: (pilot: LoreCharacter) => (
                <div className="flex justify-end gap-2">
                    <Link to={`/admin/pilots/${pilot._id}/edit`} className="inline-block p-2 text-brand-500 hover:bg-brand-500/10 rounded transition-colors" title="Edit">
                        <Edit2 className="w-4 h-4" />
                    </Link>
                    <button
                        onClick={() => handleDelete(pilot._id)}
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
                    <h1 className="text-3xl font-orbitron font-bold text-gray-900 dark:text-white mb-2">Pilot Roster</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Manage pilot profiles and records.</p>
                </div>

                <Link to="/admin/pilots/new" className="bg-brand-500 text-white font-bold font-orbitron px-4 py-2 rounded hover:bg-brand-600 transition flex items-center shadow-lg hover:shadow-brand-500/25">
                    <Plus className="w-4 h-4 mr-2" /> Register Pilot
                </Link>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden backdrop-blur-sm shadow-sm">
                <AdminSearchBar value={search} onChange={setSearch} placeholder="Search Pilots..." isLoading={isLoading} />

                <AdminTable
                    columns={columns}
                    data={data?.characters || []}
                    isLoading={isLoading}
                    keyField="_id"
                    emptyMessage="No pilots found."
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

import { Link } from 'react-router-dom';
import { Edit2 } from 'lucide-react';
import { AdminTable, AdminSearchBar } from '@/components/admin/ui/AdminTable';
import type { Column } from '@/components/admin/ui/AdminTable';
import type { Timeline } from '@/services/timeline';
import { useAdminTimelineList } from '@/hooks/admin/useAdminTimelineList';

export function TimelineList() {
    const { search, setSearch, isLoading, timelines } = useAdminTimelineList();

    const columns: Column<Timeline>[] = [
        {
            header: "Image",
            accessor: (timeline) => (
                <div className="w-16 h-16 rounded overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 shadow-sm">
                    {timeline.imageUrl ? (
                        <img src={timeline.imageUrl} alt={timeline.name} referrerPolicy="no-referrer" className="w-full h-full object-cover object-top" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Img</div>
                    )}
                </div>
            ),
            className: "w-24"
        },
        {
            header: "Era Name",
            accessor: (timeline) => (
                <div>
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 dark:text-white font-orbitron">{timeline.name}</span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[300px]">{timeline.description}</div>
                </div>
            )
        },
        {
            header: "Order",
            accessor: (timeline) => (
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30">
                    Seq {String(timeline.order).padStart(2, '0')}
                </span>
            )
        },
        {
            header: "Events",
            accessor: (_timeline) => (
                <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                    View Details
                </div>
            )
        },
        {
            header: "Actions",
            accessor: (timeline) => (
                <div className="flex justify-end gap-2">
                    <Link to={`/admin/timeline/${timeline._id}/edit`} className="p-2 text-brand-500 hover:bg-brand-500/10 rounded transition-colors" title="Edit">
                        <Edit2 className="w-4 h-4" />
                    </Link>
                </div>
            ),
            className: "text-right"
        }
    ];

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-orbitron font-bold text-gray-900 dark:text-white mb-2">Timeline Eras</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Manage timeline eras and their descriptions.</p>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden backdrop-blur-sm shadow-sm">
                <AdminSearchBar
                    value={search}
                    onChange={setSearch}
                    placeholder="Search Eras..."
                    isLoading={isLoading}
                />

                <AdminTable
                    data={timelines}
                    columns={columns}
                    isLoading={isLoading}
                    keyField="_id"
                    emptyMessage="No eras found."
                />
            </div>
        </div>
    );
}

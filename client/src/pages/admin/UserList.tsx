import { Trash2, User as UserIcon } from 'lucide-react';
import { useUserList } from '@/hooks/admin/useUserList';
import { AdminTable, AdminSearchBar } from '@/components/admin/ui/AdminTable';
import type { Column } from '@/components/admin/ui/AdminTable';
import type { User } from '@/services/users';

export function UserList() {
    const {
        search,
        setSearch,
        users,
        isLoading,
        handleRoleChange,
        handleDelete
    } = useUserList();

    const columns: Column<User>[] = [
        {
            header: "Avatar",
            accessor: (user) => (
                <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900">
                    <img
                        src={user.avatar?.startsWith('/uploads') ? `http://localhost:5000${user.avatar}` : (user.avatar || '/images/user/user-01.png')}
                        alt={user.username}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/user/user-01.png';
                        }}
                    />
                </div>
            ),
            className: "w-16"
        },
        {
            header: 'User Info',
            accessor: (user) => (
                <div>
                    <div className="font-bold text-gray-900 dark:text-white font-orbitron">{user.username}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{user.email}</div>
                </div>
            )
        },
        {
            header: 'Role',
            accessor: (user) => (
                <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-bold font-mono uppercase ${user.role === 'admin'
                        ? 'bg-neon-purple/10 text-neon-purple border border-neon-purple/20'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
                        }`}>
                        {user.role}
                    </span>
                    <button
                        onClick={() => handleRoleChange(user._id, user.role === 'admin' ? 'user' : 'admin')}
                        className="text-xs underline text-brand-500 hover:text-brand-600 transition-colors"
                    >
                        {user.role === 'admin' ? 'Demote' : 'Promote'}
                    </button>
                </div>
            )
        },
        {
            header: 'Actions',
            accessor: (user) => (
                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => handleDelete(user._id)}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                        title="Delete User"
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
                    <h1 className="text-3xl font-orbitron font-bold text-gray-900 dark:text-white mb-2">User Management</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Manage registered users and access roles.</p>
                </div>
                <div className="px-4 py-2 bg-brand-500/10 text-brand-500 rounded border border-brand-500/20 flex items-center gap-2">
                    <UserIcon className="w-4 h-4" />
                    <span className="font-bold font-mono">{users.length} Users</span>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden backdrop-blur-sm shadow-sm">
                <AdminSearchBar
                    value={search}
                    onChange={setSearch}
                    placeholder="Search Users..."
                    isLoading={isLoading}
                />

                <AdminTable
                    data={users}
                    columns={columns}
                    isLoading={isLoading}
                    keyField="_id"
                    emptyMessage="No users found."
                />
            </div>
        </div>
    );
}

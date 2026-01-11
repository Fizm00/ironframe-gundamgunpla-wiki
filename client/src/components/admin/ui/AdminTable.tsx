
import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";

export interface Column<T> {
    header: string;
    accessor: (item: T) => ReactNode;
    className?: string;
    headerClassName?: string;
}

interface AdminTableProps<T> {
    data: T[];
    columns: Column<T>[];
    isLoading: boolean;
    keyField: keyof T;
    emptyMessage?: string;
}

export function AdminTable<T>({ data, columns, isLoading, keyField, emptyMessage = "No entries found." }: AdminTableProps<T>) {
    return (
        <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left">
                <thead>
                    <tr className="bg-gray-50 dark:bg-gray-900/50 text-xs text-brand-500 uppercase font-orbitron">
                        {columns.map((col, idx) => (
                            <th key={idx} className={`px-6 py-4 ${col.headerClassName || ''}`}>
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {isLoading && !data ? (
                        <tr>
                            <td colSpan={columns.length} className="text-center py-20 text-brand-500">
                                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                                Loading Data...
                            </td>
                        </tr>
                    ) : data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="text-center py-20 text-gray-500 dark:text-gray-400 font-mono">
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        data.map((item) => (
                            <tr key={String(item[keyField])} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                {columns.map((col, idx) => (
                                    <td key={idx} className={`px-6 py-4 ${col.className || ''}`}>
                                        {col.accessor(item)}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    onPageChange: (page: number) => void;
}

export function AdminPagination({ currentPage, totalPages, totalItems, onPageChange }: PaginationProps) {
    return (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
            <div>Page {currentPage} of {totalPages} ({totalItems} entries)</div>
            <div className="space-x-2">
                <button
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 border border-gray-200 dark:border-gray-700"
                >
                    Prev
                </button>
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 border border-gray-200 dark:border-gray-700"
                >
                    Next
                </button>
            </div>
        </div>
    );
}

interface SearchBarProps {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    isLoading?: boolean;
}

export function AdminSearchBar({ value, onChange, placeholder = "Search...", isLoading }: SearchBarProps) {
    return (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center bg-gray-50 dark:bg-gray-900/50">
            <input
                type="text"
                placeholder={placeholder}
                className="bg-transparent border-none outline-none text-gray-700 dark:text-gray-200 w-full font-mono text-sm pl-2"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            {isLoading && <Loader2 className="w-4 h-4 animate-spin text-brand-500 ml-2" />}
        </div>
    );
}

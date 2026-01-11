
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (newPage: number) => void;
    accentColorClass?: string;
}

export function Pagination({
    page,
    totalPages,
    onPageChange,
    accentColorClass = "text-neon-cyan hover:border-neon-cyan hover:text-neon-cyan"
}: PaginationProps) {
    if (totalPages <= 1) return null;

    const activeClasses = `border-current ${accentColorClass.split(' ').filter(c => !c.startsWith('hover:')).join(' ')}`;
    const inactiveClasses = `border-border text-foreground-muted hover:text-foreground hover:border-foreground/50`;

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);

            if (page > 3) {
                pages.push('...');
            }

            const start = Math.max(2, page - 1);
            const end = Math.min(totalPages - 1, page + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (page < totalPages - 2) {
                pages.push('...');
            }

            pages.push(totalPages);
        }
        return pages;
    };

    return (
        <div className="mt-16 flex justify-center items-center gap-2 font-mono flex-wrap">
            <button
                onClick={() => onPageChange(Math.max(1, page - 1))}
                disabled={page === 1}
                className={`p-2 border rounded transition-colors disabled:opacity-30 disabled:hover:border-border disabled:cursor-not-allowed ${inactiveClasses}`}
                aria-label="Previous Page"
            >
                <ChevronLeft className="w-4 h-4" />
            </button>

            {getPageNumbers().map((pageNum, idx) => (
                pageNum === '...' ? (
                    <span key={`ellipsis-${idx}`} className="px-2 text-foreground-muted">
                        <MoreHorizontal className="w-4 h-4" />
                    </span>
                ) : (
                    <button
                        key={pageNum}
                        onClick={() => onPageChange(pageNum as number)}
                        className={`w-9 h-9 flex items-center justify-center border rounded text-sm transition-all duration-300
                            ${page === pageNum
                                ? `${activeClasses} bg-current/10 font-bold`
                                : inactiveClasses
                            }
                        `}
                    >
                        {pageNum}
                    </button>
                )
            ))}

            <button
                onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className={`p-2 border rounded transition-colors disabled:opacity-30 disabled:hover:border-border disabled:cursor-not-allowed ${inactiveClasses}`}
                aria-label="Next Page"
            >
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
}

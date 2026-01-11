import { Link } from 'react-router-dom';
import { Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePublicMobileSuitList } from '@/hooks/usePublicMobileSuitList';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import { PublicPageHeader } from '@/components/common/PublicPageHeader';
import { SearchInput } from '@/components/common/SearchInput';
import { Pagination } from '@/components/common/Pagination';

export function MobileSuitListPage() {
    const {
        suits,
        totalPages,
        isLoading,
        isError,
        page,
        setPage,
        search,
        handleSearch
    } = usePublicMobileSuitList();

    return (
        <div className="min-h-screen bg-background bg-grid-faint text-foreground pt-24 pb-12 px-4 md:px-8 transition-colors duration-300">

            <PublicPageHeader
                icon={Cpu}
                subtitle="ARCHIVES // LORE"
                titlePrefix="MOBILE SUIT"
                titleHighlight="ARCHIVES"
                highlightColorClass="from-neon-blue to-neon-cyan"
                iconColorClass="text-neon-blue"
            >
                <SearchInput
                    value={search}
                    onChange={handleSearch}
                    placeholder="SEARCH ARCHIVES..."
                    focusColorClass="focus:border-neon-blue focus:ring-neon-blue text-neon-blue"
                />
            </PublicPageHeader>

            <div className="max-w-7xl mx-auto">
                {isLoading ? (
                    <LoadingState message="DECRYPTING DATA..." iconClassName="text-neon-blue" />
                ) : isError ? (
                    <ErrorState title="NETWORK ERROR" message="UNABLE TO CONNECT TO ARCHIVE SERVER" />
                ) : suits.length === 0 ? (
                    <EmptyState title="NO RECORDS FOUND" message="ADJUST SEARCH PARAMETERS" className="h-64 border-dashed" />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {suits.map((suit: any, i: number) => (
                            <motion.div
                                key={suit._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <Link to={`/mobile-suits/${suit._id}`} className="group relative block bg-surface border border-border hover:border-neon-blue/50 transition-all overflow-hidden h-full flex-col">
                                    <div className="relative aspect-3/4 overflow-hidden bg-background">
                                        <div className="absolute inset-0 opacity-20"
                                            style={{
                                                backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
                                                backgroundSize: '20px 20px'
                                            }}
                                        />
                                        {suit.imageUrl ? (
                                            <img
                                                src={suit.imageUrl}
                                                alt={suit.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-foreground/10 font-orbitron text-4xl">?</div>
                                        )}

                                        <div className="absolute bottom-0 left-0 w-full p-2 bg-linear-to-t from-black/90 to-transparent">
                                            <span className="font-mono text-[10px] text-neon-blue bg-black/50 backdrop-blur px-2 py-0.5 border border-neon-blue/30 inline-block truncate max-w-full">
                                                {suit.series}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-4 grow flex flex-col">
                                        <h3 className="font-orbitron font-bold text-md mb-2 truncate text-foreground group-hover:text-neon-blue transition-colors">
                                            {suit.name}
                                        </h3>
                                        <p className="text-foreground-muted text-xs font-mono line-clamp-3">
                                            {suit.description}
                                        </p>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}

                <Pagination
                    page={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    accentColorClass="text-neon-blue hover:border-neon-blue hover:text-neon-blue"
                />
            </div>
        </div>
    );
}

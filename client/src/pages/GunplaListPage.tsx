import { Link } from 'react-router-dom';
import { Database } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePublicGunplaList } from '@/hooks/usePublicGunplaList';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import { PublicPageHeader } from '@/components/common/PublicPageHeader';
import { SearchInput } from '@/components/common/SearchInput';
import { Pagination } from '@/components/common/Pagination';

export function GunplaListPage() {
    const {
        suits,
        totalPages,
        isLoading,
        isError,
        page,
        setPage,
        search,
        handleSearch,
        selectedGrade,
        handleGradeFilter,
        grades
    } = usePublicGunplaList();

    return (
        <div className="min-h-screen bg-background bg-grid-faint text-foreground pt-24 pb-12 px-4 md:px-8 transition-colors duration-300">

            <PublicPageHeader
                icon={Database}
                subtitle="DATABASE // ARCHIVE"
                titlePrefix="GUNPLA"
                titleHighlight="DATABASE"
                highlightColorClass="from-neon-blue to-neon-cyan"
                iconColorClass="text-neon-cyan"
            >
                <SearchInput
                    value={search}
                    onChange={handleSearch}
                    placeholder="SEARCH UNIT ID..."
                    focusColorClass="focus:border-neon-cyan focus:ring-neon-cyan text-neon-cyan"
                />
            </PublicPageHeader>

            <div className="max-w-7xl mx-auto flex flex-wrap gap-2 items-center mb-8">
                <span className="text-sm font-mono text-foreground-muted mr-2">GRADE FILTER:</span>
                <button
                    onClick={() => handleGradeFilter('')}
                    className={`px-3 py-1 font-mono text-xs border transition-all ${selectedGrade === '' ? 'border-neon-cyan bg-neon-cyan/10 text-neon-cyan' : 'border-border text-foreground-muted hover:border-foreground/30'}`}
                >
                    ALL
                </button>
                {grades.map(grade => (
                    <button
                        key={grade}
                        onClick={() => handleGradeFilter(grade)}
                        className={`px-3 py-1 font-mono text-xs border transition-all ${selectedGrade === grade ? 'border-neon-cyan bg-neon-cyan/10 text-neon-cyan' : 'border-border text-foreground-muted hover:border-foreground/30'}`}
                    >
                        {grade}
                    </button>
                ))}
            </div>

            <div className="max-w-7xl mx-auto">
                {isLoading ? (
                    <LoadingState message="ACCESSING ARCHIVES..." iconClassName="text-neon-cyan" />
                ) : isError ? (
                    <ErrorState title="CONNECTION FAULT" message="UNABLE TO RETRIEVE DATA PACKETS" />
                ) : suits.length === 0 ? (
                    <EmptyState title="NO DATA FOUND" message="TRY ADJUSTING SEARCH PARAMETERS" className="h-64 border-dashed" />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {suits.map((suit: any, i: number) => (
                            <motion.div
                                key={suit._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <Link to={`/gunpla/${suit._id}`} className="group relative block bg-surface border border-border hover:border-neon-cyan/50 transition-all overflow-hidden h-full flex-col">
                                    <div className="relative aspect-4/3 overflow-hidden bg-black/40">
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

                                        <div className="absolute bottom-0 left-0 w-full p-3 bg-linear-to-t from-black/80 to-transparent flex justify-between items-end">
                                            <span className="font-mono text-[10px] text-neon-cyan bg-neon-cyan/10 px-2 py-0.5 border border-neon-cyan/30">
                                                {suit.modelNumber}
                                            </span>
                                            {suit.grade && (
                                                <span className="font-mono text-[10px] text-white/80 bg-white/10 px-2 py-0.5 border border-white/20">
                                                    {suit.grade}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-5 grow flex flex-col">
                                        <h3 className="font-orbitron font-bold text-lg mb-1 truncate text-foreground group-hover:text-neon-cyan transition-colors">
                                            {suit.name}
                                        </h3>
                                        <p className="text-foreground-muted text-xs font-mono mb-4 uppercase tracking-wider">
                                            {suit.manufacturer || "Unknown Mfg."}
                                        </p>

                                        <div className="mt-auto pt-4 border-t border-border flex justify-between text-xs font-mono text-foreground-muted">
                                            <span className={suit.releaseDate ? "text-neon-cyan/80" : ""}>
                                                {suit.releaseDate ? `RELEASE: ${suit.releaseDate.split(' ').pop()}` : "RELEASE: N/A"}
                                            </span>
                                            <span>HGT: <span className="text-foreground">{suit.height || "N/A"}m</span></span>
                                        </div>
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
                    accentColorClass="text-neon-cyan hover:border-neon-cyan hover:text-neon-cyan"
                />
            </div>
        </div>
    );
}

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { PublicPageHeader } from '../components/common/PublicPageHeader';
import { SearchInput } from '../components/common/SearchInput';
import { Pagination } from '../components/common/Pagination';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { usePilots } from '@/hooks/public/usePilots';

const Pilots = () => {
    const {
        characters,
        loading,
        error,
        search,
        setSearch,
        page,
        setPage,
        totalPages
    } = usePilots();

    return (
        <div className="min-h-screen bg-background bg-grid-faint text-foreground pt-24 pb-12 px-4 md:px-8 transition-colors duration-300 relative group/page">
            <div className="relative z-10">
                <PublicPageHeader
                    icon={Users}
                    subtitle="PERSONNEL // RECORDS"
                    titlePrefix="PILOT"
                    titleHighlight="ROSTER"
                    highlightColorClass="from-neon-blue to-neon-cyan"
                    iconColorClass="text-neon-blue"
                >
                    <SearchInput
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="SEARCH PERSONNEL..."
                        focusColorClass="focus:border-neon-green focus:ring-neon-green text-neon-green"
                    />
                </PublicPageHeader>

                <div className="max-w-7xl mx-auto">
                    {loading ? (
                        <LoadingState message="ACCESSING PERSONNEL DATABASE..." iconClassName="text-neon-green" />
                    ) : error ? (
                        <ErrorState title="ACCESS DENIED" message="UNABLE TO RETRIEVE PERSONNEL RECORDS" />
                    ) : characters.length === 0 ? (
                        <EmptyState title="NO RECORDS FOUND" message="ADJUST SEARCH PARAMETERS" className="h-64 border-dashed" />
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {characters.map((char, i) => (
                                <motion.div
                                    key={char._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <Link to={`/pilots/${char._id}`} className="group relative block bg-surface/50 backdrop-blur-sm border border-border hover:border-neon-green/40 hover:bg-surface hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex-col rounded-xl">
                                        <div className="relative h-72 overflow-hidden bg-black/50">
                                            {char.imageUrl ? (
                                                <img
                                                    src={char.imageUrl}
                                                    alt={char.name}
                                                    referrerPolicy="no-referrer"
                                                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-foreground/10 font-orbitron text-4xl">?</div>
                                            )}
                                            <div className="absolute inset-0 bg-linear-to-t from-surface via-transparent to-transparent opacity-80" />

                                            <div className="absolute bottom-0 left-0 w-full p-4">
                                                {char.profile?.['Rank'] && (
                                                    <span className="font-mono text-[10px] tracking-wider text-neon-green bg-black/80 backdrop-blur-md px-2 py-1 rounded border border-neon-green/20">
                                                        {char.profile['Rank'].toUpperCase()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="p-5 grow flex flex-col">
                                            <h2 className="font-orbitron font-bold text-xl mb-1 truncate text-foreground group-hover:text-neon-green transition-colors">
                                                {char.name}
                                            </h2>
                                            {char.profile?.['Affiliation'] && (
                                                <p className="text-xs font-mono text-foreground-muted uppercase tracking-wide mb-4 truncate">
                                                    {char.profile['Affiliation']}
                                                </p>
                                            )}

                                            {/* Minimalist Stats */}
                                            <div className="mt-auto pt-4 border-t border-border/50 flex justify-between items-center text-[10px] font-mono text-foreground-muted/70">
                                                <span>
                                                    {char.mecha && char.mecha.length > 0
                                                        ? `${char.mecha.length} UNIT${char.mecha.length !== 1 ? 'S' : ''}`
                                                        : 'NO UNITS'}
                                                </span>
                                                <span className="group-hover:text-neon-green group-hover:translate-x-1 transition-all duration-300 flex items-center gap-1">
                                                    VIEW FILE <span className="text-[8px]">▶</span>
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    <div className="mt-8 flex justify-center">
                        <Pagination
                            page={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                            accentColorClass="text-neon-cyan hover:border-neon-cyan hover:text-neon-cyan"

                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pilots;

import { motion } from 'framer-motion';
import { Flag } from 'lucide-react';
import { PublicPageHeader } from '../components/common/PublicPageHeader';
import { SearchInput } from '../components/common/SearchInput';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { useFactions } from '../hooks/public/useFactions';
import { FactionCard } from '@/components/public/factions/FactionCard';

export const Factions = () => {
    const {
        groupedFactions,
        eras,
        loading,
        error,
        search,
        setSearch
    } = useFactions();

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    return (
        <div className="min-h-screen bg-background bg-grid-faint text-foreground pt-24 pb-12 px-4 md:px-8 transition-colors duration-300">
            <div className="relative z-10">
                <PublicPageHeader
                    icon={Flag}
                    subtitle="MILITARY ORGANIZATIONS"
                    titlePrefix="FACTION"
                    titleHighlight="DATABASE"
                >
                    <SearchInput
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="SEARCH FACTIONS..."
                    />
                </PublicPageHeader>

                {loading && <LoadingState />}
                {error && <ErrorState message={error} />}

                {!loading && !error && (
                    <div className="space-y-16">
                        {eras.length === 0 ? (
                            <EmptyState message="No factions found matching your criteria." />
                        ) : (
                            eras.map(era => (
                                <div key={era} className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <h2 className="text-2xl font-orbitron font-bold text-neon-cyan tracking-wider flex items-center gap-2">
                                            <Flag className="w-6 h-6" />
                                            {era}
                                        </h2>
                                        <div className="h-px bg-linear-to-r from-transparent via-neon-cyan/50 to-transparent flex-1" />
                                    </div>

                                    <motion.div
                                        variants={container}
                                        initial="hidden"
                                        animate="show"
                                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                    >
                                        {groupedFactions[era].map((faction) => (
                                            <FactionCard key={faction._id} faction={faction} />
                                        ))}
                                    </motion.div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

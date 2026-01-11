import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useFactionDetail } from '../hooks/public/useFactionDetail';
import { useFactionImages } from '../hooks/public/useFactionImages';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { FactionHero } from '@/components/public/factions/FactionHero';
import { FactionNavigation } from '@/components/public/factions/FactionNavigation';
import type { TabId } from '@/components/public/factions/FactionNavigation';
import { FactionSidebar } from '@/components/public/factions/sidebar/FactionSidebar';
import { FactionOverview } from '@/components/public/factions/tabs/FactionOverview';
import { FactionLore } from '@/components/public/factions/tabs/FactionLore';
import { FactionMilitary } from '@/components/public/factions/tabs/FactionMilitary';
import { FactionTech } from '@/components/public/factions/tabs/FactionTech';

export const FactionDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { faction, isLoading, error } = useFactionDetail(id);
    const [activeTab, setActiveTab] = useState<TabId>('overview');
    const weaponImages = useFactionImages(faction || undefined, activeTab);

    if (isLoading) return <LoadingState />;
    if (error || !faction) return <ErrorState message={error || 'Faction not found'} />;

    return (
        <div className="min-h-screen bg-background bg-grid-faint text-foreground pt-0 pb-12">
            <FactionHero faction={faction} />

            <div className="container mx-auto px-4 -mt-8 relative z-40">
                <FactionNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

                <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-3 space-y-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {activeTab === 'overview' && <FactionOverview faction={faction} />}
                                {activeTab === 'lore' && <FactionLore faction={faction} />}
                                {activeTab === 'military' && <FactionMilitary faction={faction} />}
                                {activeTab === 'tech' && <FactionTech faction={faction} weaponImages={weaponImages} />}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="space-y-6">
                        <FactionSidebar faction={faction} />
                    </div>
                </div>
            </div>
        </div>
    );
};

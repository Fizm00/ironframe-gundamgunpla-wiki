import { motion } from 'framer-motion';
import { Loader2, History } from 'lucide-react';
import { PublicPageHeader } from '@/components/common/PublicPageHeader';
import { usePublicTimelines } from '@/hooks/public/usePublicTimelines';
import { TimelineCard } from '@/components/public/timeline/TimelineCard';

export function PublicTimelineList() {
    const { timelines, isLoading } = usePublicTimelines();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-neon-cyan" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background bg-grid-faint text-foreground pt-24 pb-12 px-4 md:px-8 transition-colors duration-300">
            <PublicPageHeader
                icon={History}
                subtitle="CHRONOLOGICAL ARCHIVES"
                titlePrefix="UNIVERSAL"
                titleHighlight="TIMELINE"
                highlightColorClass="from-neon-blue to-neon-cyan"
                iconColorClass="text-neon-cyan"
            />

            <div className="max-w-7xl mx-auto">
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xl text-muted-foreground max-w-3xl font-light leading-relaxed mb-12"
                >
                    Explore the vast history of the Gundam Metaserver. From the Universal Century to the Ad Stella, trace the conflicts and events that shaped humanity's expansion into space.
                </motion.p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {timelines?.map((timeline, index) => (
                        <motion.div
                            key={timeline._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.4 }}
                        >
                            <TimelineCard timeline={timeline} index={index} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { timelineService } from '@/services/timeline';
import { motion } from 'framer-motion';
import { Loader2, ArrowLeft, History } from 'lucide-react';

export function PublicTimelineDetail() {
    const { id } = useParams<{ id: string }>();
    const { data: timeline, isLoading } = useQuery({
        queryKey: ['public-timeline', id],
        queryFn: () => timelineService.getById(id!),
        enabled: !!id
    });

    if (isLoading || !timeline) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-neon-cyan" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background bg-grid-faint text-foreground pb-20">
            {/* Hero Section */}
            <div className="relative h-[50vh] min-h-[400px]">
                <div className="absolute inset-0">
                    <img
                        src={timeline.imageUrl || '/images/placeholder-timeline.jpg'}
                        alt={timeline.name}
                        className="w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-background to-transparent" />
                </div>

                <div className="absolute inset-0 flex flex-col justify-end pb-12 px-4 md:px-8 max-w-7xl mx-auto">
                    <Link to="/timeline" className="inline-flex items-center text-muted-foreground hover:text-neon-cyan mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Timelines
                    </Link>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-black font-orbitron text-foreground mb-6"
                    >
                        {timeline.name}
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-3xl text-muted-foreground text-lg leading-relaxed backdrop-blur-sm bg-black/30 p-6 rounded-xl border border-white/10"
                    >
                        {timeline.description}
                    </motion.div>
                </div>
            </div>

            {/* Chronology */}
            <div className="max-w-5xl mx-auto px-4 md:px-8 mt-16">
                <div className="flex items-center gap-3 mb-10 text-neon-cyan">
                    <History className="w-6 h-6" />
                    <h2 className="text-2xl font-bold font-orbitron tracking-wider">CHRONOLOGICAL EVENTS</h2>
                </div>

                <div className="relative border-l-2 border-border ml-4 md:ml-6 space-y-12">
                    {timeline.events.map((event, index) => (
                        <motion.div
                            key={event._id}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                            className="relative pl-8 md:pl-12"
                        >
                            {/* Dot */}
                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-background border-2 border-neon-cyan shadow-[0_0_10px_rgba(34,211,238,0.5)]" />

                            {/* Content */}
                            <div className="flex flex-col md:flex-row md:items-start gap-4">
                                <div className="md:w-32 shrink-0 pt-1">
                                    <span className="font-mono text-neon-cyan font-bold bg-neon-cyan/10 px-2 py-1 rounded border border-neon-cyan/20 text-sm">
                                        {event.year}
                                    </span>
                                </div>
                                <div className="space-y-2 pb-8">
                                    <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                                        {event.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {timeline.events.length === 0 && (
                        <div className="pl-12 text-muted-foreground italic">
                            No chronological data available for this timeline yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

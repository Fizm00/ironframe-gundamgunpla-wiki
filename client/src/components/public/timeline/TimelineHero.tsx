import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import type { Timeline } from '@/services/timeline';

interface TimelineHeroProps {
    timeline: Timeline;
}

export function TimelineHero({ timeline }: TimelineHeroProps) {
    return (
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
    );
}

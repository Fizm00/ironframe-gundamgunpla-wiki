import { motion } from 'framer-motion';
import { History } from 'lucide-react';
import type { TimelineEvent } from '@/services/timeline';

interface TimelineChronologyProps {
    events: TimelineEvent[];
}

export function TimelineChronology({ events }: TimelineChronologyProps) {
    return (
        <div className="max-w-5xl mx-auto px-4 md:px-8 mt-16">
            <div className="flex items-center gap-3 mb-10 text-neon-cyan">
                <History className="w-6 h-6" />
                <h2 className="text-2xl font-bold font-orbitron tracking-wider">CHRONOLOGICAL EVENTS</h2>
            </div>

            <div className="relative border-l-2 border-border ml-4 md:ml-6 space-y-12">
                {events.map((event) => (
                    <motion.div
                        key={event._id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.3 }}
                        className="relative pl-8 md:pl-12"
                    >
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-background border-2 border-neon-cyan shadow-[0_0_10px_rgba(34,211,238,0.5)]" />

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

                {events.length === 0 && (
                    <div className="pl-12 text-muted-foreground italic">
                        No chronological data available for this timeline yet.
                    </div>
                )}
            </div>
        </div>
    );
}

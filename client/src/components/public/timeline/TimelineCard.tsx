import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ChevronRight } from 'lucide-react';
import type { Timeline } from '@/services/timeline';

interface TimelineCardProps {
    timeline: Timeline;
    index: number;
}

export function TimelineCard({ timeline, index }: TimelineCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Link
            to={`/timeline/${timeline._id}`}
            className="group relative h-[420px] overflow-hidden rounded-xl bg-surface/30 backdrop-blur-sm border border-white/10 hover:border-neon-cyan/50 hover:shadow-[0_0_15px_rgba(0,188,212,0.15)] transition-all duration-500 flex flex-col"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Background Image */}
            <div className="relative h-48 shrink-0 overflow-hidden border-b border-white/5">
                <div className={`absolute inset-0 bg-linear-to-t from-gray-950 via-transparent to-transparent z-10 duration-500 ${isHovered ? 'opacity-80' : 'opacity-100'}`} />
                <img
                    src={timeline.imageUrl || '/images/placeholder-timeline.jpg'}
                    alt={timeline.name}
                    className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
                />
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-linear-to-t from-black/80 to-transparent z-20 flex justify-between items-end">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30 backdrop-blur-md uppercase">
                        {timeline.name} ERA
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="relative p-5 flex flex-col grow">
                <div className="flex items-center gap-2 mb-2 text-neon-cyan font-mono text-xs tracking-widest uppercase opacity-70">
                    <Calendar className="w-3 h-3" />
                    <span>Sequence {String(index + 1).padStart(2, '0')}</span>
                </div>
                <h2 className="text-2xl font-bold font-orbitron text-white mb-2 group-hover:text-neon-cyan transition-colors truncate">
                    {timeline.name}
                </h2>
                <p className="text-gray-400 line-clamp-3 text-sm leading-relaxed mb-4">
                    {timeline.description}
                </p>

                <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center text-xs font-mono font-bold text-gray-500">
                    <span>FULL CHRONOLOGY</span>
                    <span className="text-neon-cyan flex items-center gap-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                        ACCESS <ChevronRight className="w-3 h-3" />
                    </span>
                </div>
            </div>
        </Link>
    );
}

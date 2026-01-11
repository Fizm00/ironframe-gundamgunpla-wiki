
import { Cpu } from 'lucide-react';
import { manufacturers } from '@/data/landingData';

export function BrandMarquee() {
    return (
        <div className="w-full bg-surface border-y border-border py-4 overflow-hidden relative">
            <div className="absolute inset-0 z-10 pointer-events-none bg-linear-to-r from-background via-transparent to-background" />
            <div className="flex animate-scroll whitespace-nowrap gap-12 items-center">
                {[...manufacturers, ...manufacturers].map((brand, i) => (
                    <span key={i} className="text-foreground/30 font-orbitron text-sm md:text-xl font-bold uppercase tracking-widest flex items-center gap-4">
                        <Cpu className="w-4 h-4 opacity-50" /> {brand}
                    </span>
                ))}
            </div>
        </div>
    );
}

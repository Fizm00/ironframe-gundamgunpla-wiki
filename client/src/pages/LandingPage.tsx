import { useRef } from 'react';
import { InfiniteScrollShowcase } from '@/components/landing/InfiniteScrollShowcase';
import { BentoFeatures } from '@/components/landing/BentoFeatures';
import { TimelinePreview } from '@/components/landing/TimelinePreview';
import { TechSpecs } from '@/components/landing/TechSpecs';
import { HeroSection } from '@/components/landing/HeroSection';
import { BrandMarquee } from '@/components/landing/BrandMarquee';

export function LandingPage() {
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <div ref={containerRef} className="relative min-h-screen overflow-hidden bg-background text-foreground transition-colors duration-300">
            <div className="fixed inset-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                }}
            />
            <div className="fixed inset-0 bg-gradient-radial from-neon-blue/5 via-transparent to-transparent opacity-50 pointer-events-none" />

            <HeroSection />
            <BrandMarquee />

            <InfiniteScrollShowcase />
            <TechSpecs />
            <BentoFeatures />
            <TimelinePreview />
        </div>
    );
}

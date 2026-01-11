import { showcaseScreenshots } from '@/data/landingData';

const tripleSet = [...showcaseScreenshots, ...showcaseScreenshots, ...showcaseScreenshots];

export function InfiniteScrollShowcase() {
    return (
        <section className="py-24 overflow-hidden relative bg-background">
            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col lg:flex-row gap-16 items-center">

                    <div className="w-full lg:w-1/3 mb-10 lg:mb-0 z-20">
                        <div className="animate-fade-in-up">
                            <h2 className="text-neon-cyan font-mono tracking-widest mb-4 flex items-center gap-2">
                                <div className="w-2 h-2 bg-neon-cyan/50 animate-pulse" />
                                SYSTEM ARCHIVES
                            </h2>
                            <h3 className="text-4xl md:text-5xl font-orbitron font-bold text-foreground mb-6 leading-tight">
                                UNLIMITED <br />
                                <span className="bg-clip-text bg-linear-to-r text-neon-cyan">DATA ACCESS</span>
                            </h3>
                            <p className="text-foreground-muted font-exo leading-relaxed mb-8">
                                Dive into the most comprehensive Mobile Suit database in the solar system.
                                Our archives are constantly updating with real-time telemetry from every major conflict in the Universal Century and beyond.
                            </p>

                            <div className="flex gap-4">
                                <div className="bg-surface border border-border p-4 rounded-lg">
                                    <div className="text-2xl font-bold font-mono text-foreground">4K+</div>
                                    <div className="text-xs text-foreground-muted uppercase tracking-wider">High-Res Assets</div>
                                </div>
                                <div className="bg-surface border border-border p-4 rounded-lg">
                                    <div className="text-2xl font-bold font-mono text-foreground">0.02s</div>
                                    <div className="text-xs text-foreground-muted uppercase tracking-wider">Query Latency</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-2/3 h-[1000px] relative overflow-hidden mask-gradient-y">
                        <div className="absolute top-0 left-0 right-0 h-40 bg-linear-to-b from-background to-transparent z-20 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 right-0 h-40 bg-linear-to-t from-background to-transparent z-20 pointer-events-none" />

                        <div className="flex gap-8 h-full">
                            <div className="w-1/2 overflow-hidden h-full relative">
                                <div className="animate-scroll-up transform-gpu flex flex-col gap-8 pb-8 will-change-transform">
                                    {tripleSet.map((src, i) => (
                                        <div key={`up-${i}`} className="relative group rounded-xl overflow-hidden border-2 border-border/50 shadow-2xl bg-surface shrink-0">
                                            <div className="absolute inset-0 bg-neon-blue/0 group-hover:bg-neon-blue/10 transition-colors duration-500 z-10" />
                                            <img
                                                src={src}
                                                alt="Interface UI"
                                                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 block"
                                                loading="eager"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="w-1/2 overflow-hidden h-full relative">
                                <div className="animate-scroll-down transform-gpu flex flex-col gap-8 pb-8 will-change-transform">
                                    {[...tripleSet].reverse().map((src, i) => (
                                        <div key={`down-${i}`} className="relative group rounded-xl overflow-hidden border-2 border-border/50 shadow-2xl bg-surface shrink-0">
                                            <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/10 transition-colors duration-500 z-10" />
                                            <img
                                                src={src}
                                                alt="Interface UI"
                                                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 block"
                                                loading="eager"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-neon-blue/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2" />
        </section>
    );
}

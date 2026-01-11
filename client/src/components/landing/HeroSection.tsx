
import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Radio } from 'lucide-react';
import { spotlightUnits } from '@/data/landingData';

export function HeroSection() {
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 500], ["0%", "50%"]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    const [spotlightUnit, setSpotlightUnit] = useState(spotlightUnits[0]);

    useEffect(() => {
        const random = spotlightUnits[Math.floor(Math.random() * spotlightUnits.length)];
        setSpotlightUnit(random);
    }, []);

    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
            <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-linear-to-b from-transparent via-background/50 to-background" />
            </motion.div>

            <div className="container mx-auto px-4 z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex items-center gap-2 text-neon-cyan font-mono text-sm tracking-[0.2em] mb-4">
                            <Radio className="w-4 h-4 animate-pulse" />
                            SYSTEM ONLINE // {spotlightUnit.name.split(' ')[0]}
                        </div>
                        <h1 className="text-5xl md:text-7xl font-orbitron font-black leading-none mb-2">
                            IRON<span className="text-transparent bg-clip-text bg-linear-to-r from-neon-blue to-neon-cyan">FRAME</span>
                        </h1>
                        <p className="text-2xl md:text-3xl font-exo font-light text-foreground/80 tracking-wide">
                            TACTICAL MOBILE SUIT DATABASE
                        </p>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="text-foreground-muted max-w-lg font-mono text-sm border-l-2 border-neon-blue pl-4 py-2"
                    >
                        "{spotlightUnit.quote}" <br />
                        Access comprehensive archives of Gunpla, Mobile Suits, Pilots, and Historical Events.
                        Authorized Initialized.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex flex-wrap gap-4 pt-4"
                    >
                        <Link to="/gunpla" className="group relative px-8 py-3 bg-neon-cyan/10 border border-neon-cyan/50 hover:bg-neon-cyan hover:text-black transition-all duration-300 overflow-hidden">
                            <div className="absolute inset-0 bg-surface/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            <span className="relative flex items-center font-orbitron tracking-wider font-bold">
                                ACCESS DATABASE <ChevronRight className="ml-2 w-4 h-4" />
                            </span>
                        </Link>
                        <button className="px-8 py-3 border border-border hover:border-foreground/50 hover:bg-surface-hover transition-all font-mono text-sm tracking-widest text-foreground">
                            BECOME_PILOT
                        </button>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="relative hidden md:block h-[80vh]"
                >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-neon-blue/20 rounded-full animate-spin-slow pointer-events-none" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-dashed border-neon-cyan/20 rounded-full animate-[spin_10s_linear_infinite_reverse] pointer-events-none" />

                    <img
                        src={spotlightUnit.image}
                        alt="Spotlight Unit"
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[90%] w-auto object-contain drop-shadow-[0_0_30px_rgba(0,255,255,0.3)]"
                    />

                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 4 }}
                        className="absolute top-1/4 right-0 bg-surface/80 backdrop-blur border border-border p-3"
                    >
                        <div className="text-[10px] text-neon-cyan font-mono">STATUS</div>
                        <div className="text-foreground font-bold font-orbitron">OPERATIONAL</div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}

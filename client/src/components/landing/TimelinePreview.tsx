import { motion } from 'framer-motion';
import { ArrowRight, Clock, ChevronsRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { timelinePeriods } from '@/data/landingData';

export function TimelinePreview() {
    return (
        <section className="py-24 relative overflow-hidden bg-background">
            <div className="absolute inset-0 z-0 opacity-10"
                style={{
                    backgroundImage: 'radial-gradient(circle at 50% 50%, var(--color-neon-blue) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />

            <div className="container mx-auto px-4 relative z-10">
                <div className="mb-16 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 text-neon-cyan font-mono text-sm tracking-widest mb-4 px-4 py-1 border border-neon-cyan/30 rounded-full bg-neon-cyan/5"
                    >
                        <Clock className="w-4 h-4" />
                        CHRONOLOGICAL ARCHIVES
                    </motion.div>
                    <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-foreground mb-4">
                        SELECT YOUR ERA
                    </h2>
                    <p className="text-foreground-muted font-exo max-w-2xl mx-auto">
                        Explore the rich history of the Gundam multiverse. From the original space colonies to the latest corporate wars.
                    </p>
                </div>

                <div className="relative mt-20">
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-border to-transparent hidden lg:block" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative pt-8">
                        {timelinePeriods.map((era, index) => (
                            <motion.div
                                key={era.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                viewport={{ once: true }}
                                className="group relative pt-8 lg:pt-0"
                            >
                                <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[calc(50%+2rem)] w-4 h-4 rounded-full bg-background border-2 ${era.borderColor} hidden lg:block z-20 group-hover:scale-150 transition-transform duration-300 shadow-[0_0_15px_currentColor] text-neon-blue`} />
                                <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 w-0.5 h-8 bg-border hidden lg:block group-hover:bg-neon-blue transition-colors duration-300`} />

                                <Link to="/timelines" className="block h-full">
                                    <div className={`
                                        h-full p-6 bg-surface/50 backdrop-blur-sm border border-border 
                                        hover:border-opacity-100 hover:bg-surface 
                                        transition-all duration-300 rounded-xl flex flex-col items-center text-center
                                        group-hover:shadow-[0_0_30px_-10px_rgba(0,0,0,0.5)]
                                        relative overflow-hidden
                                    `}>
                                        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-300" style={{ color: `var(--color-${era.color.split('-')[1]})` }} />

                                        <div className={`text-4xl font-black font-orbitron mb-2 bg-linear-to-r ${era.color} bg-clip-text text-transparent`}>
                                            {era.year}
                                        </div>
                                        <h3 className="text-xl font-bold font-orbitron text-foreground mb-3 group-hover:text-white transition-colors">
                                            {era.name}
                                        </h3>
                                        <p className="text-sm text-foreground-muted font-exo leading-relaxed mb-6 grow">
                                            {era.desc}
                                        </p>

                                        <div className="mt-auto pt-4 border-t border-border w-full flex justify-center">
                                            <span className="flex items-center text-xs font-mono tracking-widest text-foreground group-hover:text-neon-blue transition-colors">
                                                EXPLORE ERA <ChevronsRight className="w-4 h-4 ml-1" />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="mt-24 text-center">
                    <Link to="/timelines" className="inline-flex items-center px-8 py-4 bg-neon-blue/10 border border-neon-blue/30 text-neon-blue hover:bg-neon-blue hover:text-black transition-all duration-300 font-orbitron font-bold tracking-wider rounded-sm group">
                        VIEW FULL TIMELINE
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
}

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { bentoFeatures } from '@/data/landingData';

export function BentoFeatures() {
    return (
        <section className="py-24 bg-background relative">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <h2 className="text-neon-cyan font-mono tracking-widest mb-4 uppercase">
                        — Modular Design
                    </h2>
                    <h3 className="text-4xl font-orbitron font-bold text-foreground mb-4">
                        EVERYTHING YOU NEED
                    </h3>
                    <p className="text-foreground-muted font-exo">
                        A fully integrated suite of tools for collectors, builders, and lore enthusiasts.
                    </p>
                </div>

                <div className="grid grid-cols-12 gap-6">
                    {bentoFeatures.map((feature, i) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.1 }}
                            viewport={{ once: true, margin: "-50px" }}
                            className={`${feature.colSpan} group relative rounded-2xl overflow-hidden border border-border bg-surface hover:border-foreground/20 transition-all duration-500 h-[300px] will-change-transform`}
                        >
                            {feature.image && (
                                <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500">
                                    <img src={feature.image} alt={feature.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-linear-to-t from-background via-background/50 to-transparent" />
                                </div>
                            )}

                            <div className="absolute inset-0 flex flex-col justify-between p-8 z-10 h-full">
                                <div className="flex justify-between items-start">
                                    <div className={`p-3 rounded-xl ${feature.bg} ${feature.border} border backdrop-blur-sm`}>
                                        <feature.icon className={`w-6 h-6 ${feature.color}`} />
                                    </div>
                                    <Link to={feature.link} className="p-2 rounded-full border border-border bg-background/50 hover:bg-foreground hover:text-background transition-colors">
                                        <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>

                                <div>
                                    <h4 className="text-2xl font-orbitron font-bold text-foreground mb-2 group-hover:translate-x-1 transition-transform">{feature.title}</h4>
                                    <p className="text-foreground-muted font-exo group-hover:text-foreground/80 transition-colors text-sm">{feature.desc}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

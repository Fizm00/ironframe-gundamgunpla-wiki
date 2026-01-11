import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { rx78Specs } from '@/data/landingData';

export function TechSpecs() {

    return (
        <section className="py-24 bg-background relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `
                        linear-gradient(var(--foreground) 1px, transparent 1px),
                        linear-gradient(90deg, var(--foreground) 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px'
                }}
            />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16">

                    <div className="w-full lg:w-1/2 relative h-[600px] flex items-center justify-center">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
                            <div className="w-[750px] h-[750px] border border-neon-cyan rounded-full flex items-center justify-center animate-[spin_60s_linear_infinite]">
                                <div className="w-[750px] h-[750px] border border-dashed border-neon-cyan/50 rounded-full" />
                            </div>
                        </div>

                        {/* Scanning Effect (Masked to Circle) */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] rounded-full z-20 pointer-events-none overflow-hidden">
                            <motion.div
                                animate={{ top: ['0%', '100%'], opacity: [0, 1, 0] }}
                                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                                className="absolute left-0 w-full h-1 bg-neon-cyan shadow-[0_0_20px_#00bcd4]"
                            />
                        </div>

                        <div className="relative z-10 w-full h-full flex items-center justify-center">
                            <img
                                src="/RX-78-2.png"
                                alt="Technical Schematic"
                                className="h-[90%] w-auto object-contain grayscale opacity-80 lg:opacity-100 hover:grayscale-0 transition-all duration-500 drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                            />
                        </div>

                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ type: "spring", stiffness: 50, damping: 20, delay: 0.2 }}
                            className="absolute bottom-[55%] left-[20%] hidden md:block z-30"
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-neon-cyan font-mono text-xs bg-black/50 backdrop-blur px-1 border border-neon-cyan/30">COCKPIT: CORE BLOCK</span>
                                <div className="h-px w-24 bg-neon-cyan" />
                                <div className="w-2 h-2 bg-neon-cyan rounded-full animate-ping" />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ type: "spring", stiffness: 50, damping: 20, delay: 0.4 }}
                            className="absolute top-[18%] right-[4%] hidden md:block z-30"
                        >
                            <div className="flex items-center gap-2 flex-row-reverse">
                                <span className="text-neon-cyan font-mono text-xs bg-black/50 backdrop-blur px-1 border border-neon-cyan/30">HEAD UNIT: VULCAN 60MM</span>
                                <div className="h-px w-24 bg-neon-cyan" />
                                <div className="w-2 h-2 bg-neon-cyan rounded-full animate-ping" />
                            </div>
                        </motion.div>
                    </div>

                    <div className="w-full lg:w-1/2">
                        <div className="mb-10">
                            <div className="text-neon-blue font-mono text-sm tracking-widest mb-2 flex items-center gap-2">
                                <Zap className="w-4 h-4" /> TECHNICAL SPECIFICATIONS
                            </div>
                            <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-foreground mb-4">
                                RX-78-2 <br />
                                <span className="text-foreground-muted/50">MOBILE SUIT</span>
                            </h2>
                            <p className="text-foreground-muted font-exo leading-relaxed border-l-2 border-neon-blue pl-4">
                                The RX-78-2 Gundam is the second prototype mobile suit of the RX-78 series produced by the Earth Federation Forces. It was built at Side 7 and pioneered several key technologies.
                            </p>
                        </div>

                        <div className="grid gap-6">
                            {rx78Specs.map((spec, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.1 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    className="bg-surface/50 border border-border p-4 flex items-start gap-4 hover:border-neon-cyan/50 hover:bg-surface transition-all duration-300 group will-change-transform"
                                >
                                    <div className="p-3 bg-background border border-border rounded-lg group-hover:border-neon-cyan text-foreground-muted group-hover:text-neon-cyan transition-colors">
                                        <spec.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-mono text-foreground-muted tracking-wider mb-1">{spec.label}</div>
                                        <div className="text-xl font-bold font-orbitron text-foreground mb-1 group-hover:text-neon-cyan transition-colors">{spec.value}</div>
                                        <div className="text-xs text-foreground-muted/70">{spec.desc}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

import { Github, Twitter, Send, ArrowRight, Zap, Shield, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export function Footer() {
    return (
        <footer className="relative bg-surface pt-20 pb-10 border-t border-border overflow-hidden">
            <motion.div
                className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-neon-cyan to-transparent z-10"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
            />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">

                    <div className="col-span-1 md:col-span-5 space-y-6">
                        <Link to="/" className="inline-block">
                            <h2 className="text-3xl font-orbitron font-black tracking-tighter">
                                IRON<span className="text-neon-blue">FRAME</span>
                            </h2>
                        </Link>
                        <p className="text-foreground-muted font-exo leading-relaxed max-w-md">
                            The definitive database for Mobile Suit technology, historical archives, and pilot records.
                            Authorized access only. Secure connection established.
                        </p>
                        <div className="flex gap-4">
                            <SocialButton icon={Github} label="GitHub" />
                            <SocialButton icon={Twitter} label="Twitter" />
                            <SocialButton icon={Cpu} label="System" />
                        </div>
                    </div>

                    <div className="col-span-1 md:col-span-2 space-y-6">
                        <h4 className="font-orbitron font-bold text-neon-cyan tracking-wider text-sm flex items-center gap-2">
                            <Zap className="w-4 h-4" /> DATABASE
                        </h4>
                        <ul className="space-y-3">
                            <FooterLink to="/gunpla">Gunpla Catalog</FooterLink>
                            <FooterLink to="/pilots">Pilot Roster</FooterLink>
                            <FooterLink to="/timeline">Timeline</FooterLink>
                            <FooterLink to="/factions">Factions</FooterLink>
                        </ul>
                    </div>

                    <div className="col-span-1 md:col-span-2 space-y-6">
                        <h4 className="font-orbitron font-bold text-neon-cyan tracking-wider text-sm flex items-center gap-2">
                            <Shield className="w-4 h-4" /> PROTOCOLS
                        </h4>
                        <ul className="space-y-3">
                            <FooterLink to="/about">Mission Data</FooterLink>
                            <FooterLink to="/api">API Access</FooterLink>
                            <FooterLink to="/privacy">Privacy Level</FooterLink>
                            <FooterLink to="/terms">Terms of Use</FooterLink>
                        </ul>
                    </div>

                    <div className="col-span-1 md:col-span-3 space-y-6">
                        <h4 className="font-orbitron font-bold text-neon-cyan tracking-wider text-sm">
                            SUBSCRIBE TO INTEL
                        </h4>
                        <p className="text-sm text-foreground-muted">
                            Receive high-priority updates on new units and historical leaks.
                        </p>
                        <div className="relative group">
                            <input
                                type="email"
                                placeholder="ENTER_EMAIL_ADDRESS"
                                className="w-full bg-background border border-border px-4 py-3 text-sm font-mono focus:border-neon-blue focus:outline-none transition-colors pr-12"
                            />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-neon-blue hover:text-white transition-colors">
                                <Send className="w-4 h-4" />
                            </button>
                            <div className="absolute inset-0 border border-neon-blue/0 group-focus-within:border-neon-blue/50 pointer-events-none transition-colors" />
                        </div>
                    </div>
                </div>

                <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-foreground-muted/60">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        SYSTEM OPERATIONAL
                    </div>
                    <div>
                        © {new Date().getFullYear()} IRONFRAME PROJECT. VER 2.0.4
                    </div>
                    <div className="flex gap-4">
                        <span className="hover:text-neon-cyan cursor-pointer transition-colors">INIT_SEQ</span>
                        <span className="hover:text-neon-cyan cursor-pointer transition-colors">TERM_CLOSE</span>
                    </div>
                </div>
            </div>

            <div className="absolute right-0 bottom-0 opacity-[0.03] pointer-events-none">
                <h1 className="text-[10rem] md:text-[15rem] font-black font-orbitron leading-none translate-y-[20%] translate-x-[20%]">
                    GUNDAM
                </h1>
            </div>
        </footer>
    );
}

function SocialButton({ icon: Icon, label }: { icon: any, label: string }) {
    return (
        <motion.a
            href="#"
            whileHover={{ scale: 1.1, backgroundColor: "var(--neon-blue)", color: "#000" }}
            className="w-10 h-10 border border-border flex items-center justify-center text-foreground-muted transition-colors hover:border-transparent hover:text-black"
            title={label}
        >
            <Icon className="w-5 h-5" />
        </motion.a>
    );
}

function FooterLink({ children, to }: { children: React.ReactNode, to: string }) {
    return (
        <li>
            <Link to={to} className="group flex items-center gap-2 text-sm text-foreground-muted hover:text-neon-cyan transition-colors">
                <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                <span className="group-hover:translate-x-1 transition-transform">{children}</span>
            </Link>
        </li>
    );
}

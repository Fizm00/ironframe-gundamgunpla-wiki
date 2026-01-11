import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface PublicPageHeaderProps {
    icon: LucideIcon;
    subtitle: string;
    titlePrefix: string;
    titleHighlight: string;
    highlightColorClass?: string;
    iconColorClass?: string;
    children?: React.ReactNode;
}

export function PublicPageHeader({
    icon: Icon,
    subtitle,
    titlePrefix,
    titleHighlight,
    highlightColorClass = "from-neon-blue to-neon-cyan",
    iconColorClass = "text-neon-cyan",
    children
}: PublicPageHeaderProps) {
    return (
        <div className="max-w-7xl mx-auto mb-8 flex flex-col gap-6 border-b border-border pb-8">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex items-center gap-2 ${iconColorClass} font-mono text-sm tracking-widest mb-2`}
                    >
                        <Icon className="w-4 h-4" />
                        {subtitle}
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-orbitron font-bold uppercase"
                    >
                        {titlePrefix} <span className={`text-transparent bg-clip-text bg-linear-to-r ${highlightColorClass}`}>{titleHighlight}</span>
                    </motion.h1>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="w-full md:w-auto"
            >
                {children}
            </motion.div>
        </div>
    );
}

import { type ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import 'lenis/dist/lenis.css';

interface AppShellProps {
    children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
    const location = useLocation();
    const isAdmin = location.pathname.startsWith('/admin');

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    return (
        <div className={`min-h-screen bg-background text-foreground font-inter selection:bg-neon-cyan selection:text-background flex flex-col transition-colors duration-300 ${isAdmin ? '' : ''}`}>
            {!isAdmin && <Navbar />}
            <main className={`grow relative ${isAdmin ? '' : 'pt-20'}`}>
                {!isAdmin && (
                    <div className="fixed inset-0 z-0 opacity-20 pointer-events-none"
                        style={{
                            backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
                            backgroundSize: '50px 50px'
                        }}
                    />
                )}
                <div className="relative z-10 w-full">
                    {children}
                </div>
            </main>
            {!isAdmin && <Footer />}
        </div>
    );
}

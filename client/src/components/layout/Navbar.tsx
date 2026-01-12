import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Users, Shield, Clock, Crosshair, Box, LayoutDashboard, LogOut, Sun, Moon, Cpu, Flag } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '@/services/auth';
import { useTheme } from '@/context/ThemeContext';

const NAV_ITEMS = [
    { name: 'HOME', path: '/', icon: Crosshair },
    { name: 'GUNPLA', path: '/gunpla', icon: Box },
    { name: 'MOBILE SUITS', path: '/mobile-suits', icon: Cpu },
    { name: 'PILOTS', path: '/pilots', icon: Users },
    { name: 'FACTIONS', path: '/factions', icon: Flag },
    { name: 'NETWORK', path: '/relationships', icon: Users },
    { name: 'TIMELINE', path: '/timeline', icon: Clock },
];

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const isAdmin = authService.isAdmin();
    const isAuthenticated = authService.isAuthenticated();
    const { theme, toggleTheme } = useTheme();

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur-none bg-opacity-95 transition-colors duration-300">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                <Link to="/" className="flex items-center space-x-2 group">
                    <div className="p-2 bg-surface border border-neon-blue rounded-none group-hover:bg-neon-blue/10 transition-colors">
                        <Crosshair className="w-6 h-6 text-neon-blue" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-orbitron font-bold text-xl tracking-wider text-foreground">IRONFRAME</span>
                        <span className="text-[10px] text-neon-cyan tracking-[0.2em] font-mono leading-none">GUNPLA & GUNDAM DATABASE</span>
                    </div>
                </Link>

                <div className="hidden md:flex items-center space-x-8">
                    {NAV_ITEMS.filter(item => item.path !== '/').map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className="relative group flex items-center space-x-2 text-foreground-muted hover:text-neon-cyan transition-colors font-exo uppercase tracking-wide text-sm"
                        >
                            <item.icon className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                            <span>{item.name}</span>
                            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-neon-cyan group-hover:w-full transition-all duration-300" />
                        </Link>
                    ))}

                    {isAdmin && (
                        <Link
                            to="/admin/dashboard"
                            className="text-neon-purple hover:text-foreground transition-colors font-exo uppercase tracking-wide text-sm flex items-center font-bold"
                        >
                            <LayoutDashboard className="w-4 h-4 mr-2" />
                            Dashboard
                        </Link>
                    )}

                    <button
                        onClick={toggleTheme}
                        className="p-2 text-foreground-muted hover:text-neon-yellow transition-colors rounded-full hover:bg-surface-hover"
                        aria-label="Toggle Theme"
                    >
                        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>

                    <div className="pl-6 border-l border-border">
                        {isAuthenticated ? (
                            <button
                                onClick={handleLogout}
                                className="px-6 py-2 bg-red-500/10 border border-red-500/50 hover:bg-red-500/20 text-red-400 transition-all font-mono text-xs tracking-widest uppercase flex items-center"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </button>
                        ) : (
                            <Link to="/login">
                                <button className="px-6 py-2 bg-surface-hover border border-border hover:border-neon-blue hover:text-neon-blue transition-all font-mono text-xs tracking-widest text-foreground uppercase clip-path-slant relative overflow-hidden group">
                                    <span className="relative z-10">System Login</span>
                                    <div className="absolute inset-0 bg-neon-blue/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                </button>
                            </Link>
                        )}
                    </div>
                </div>

                <div className="flex md:hidden items-center space-x-4">
                    <button
                        onClick={toggleTheme}
                        className="p-2 text-foreground hover:text-neon-yellow transition-colors"
                    >
                        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>

                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-2 text-foreground hover:text-neon-cyan transition-colors"
                    >
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden border-b border-border bg-surface overflow-hidden"
                    >
                        <div className="container mx-auto px-4 py-8 flex flex-col space-y-4">
                            {NAV_ITEMS.filter(item => item.path !== '/').map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center space-x-4 p-4 border border-border hover:border-neon-cyan/50 hover:bg-surface-hover transition-all group"
                                >
                                    <item.icon className="text-foreground-muted group-hover:text-neon-cyan" />
                                    <span className="font-orbitron text-lg text-foreground group-hover:text-neon-cyan">{item.name}</span>
                                </Link>
                            ))}
                            <Link
                                to="/pilots"
                                className="text-gray-300 hover:text-cyan-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Pilots
                            </Link>
                            {isAdmin && (
                                <Link
                                    to="/admin/dashboard"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center space-x-4 p-4 border border-border hover:border-neon-purple/50 hover:bg-surface-hover transition-all group text-neon-purple"
                                >
                                    <LayoutDashboard className="text-neon-purple group-hover:text-foreground" />
                                    <span className="font-orbitron text-lg text-neon-purple group-hover:text-foreground">Dashboard</span>
                                </Link>
                            )}
                            {isAuthenticated ? (
                                <button onClick={handleLogout} className="text-left flex items-center space-x-4 p-4 border border-border hover:bg-surface-hover text-red-400">
                                    <LogOut /> <span>Logout</span>
                                </button>
                            ) : (
                                <Link to="/login" onClick={() => setIsOpen(false)} className="flex items-center space-x-4 p-4 border border-border hover:bg-surface-hover text-neon-blue">
                                    <Shield /> <span>System Login</span>
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}


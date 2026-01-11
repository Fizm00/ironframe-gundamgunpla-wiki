
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/auth';
import { Navbar } from '@/components/layout/Navbar';
import { Loader2, ShieldCheck, AlertTriangle } from 'lucide-react';

export function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await authService.login(email, password);
            navigate('/admin/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-cyber-black text-white font-exo flex flex-col">
            <Navbar />
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-cyber-dark/50 border border-white/10 rounded-lg p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <ShieldCheck className="w-32 h-32" />
                    </div>

                    <h1 className="text-3xl font-orbitron text-neon-blue mb-2 relative z-10">SYSTEM ACCESS</h1>
                    <p className="text-white/60 mb-8 font-mono text-xs tracking-widest relative z-10">RESTRICTED AREA. AUTHORIZED PERSONNEL ONLY.</p>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded mb-6 flex items-center text-sm">
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        <div>
                            <label className="block text-xs font-mono text-white/60 mb-1">IDENTIFIER</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black/40 border border-white/20 rounded p-3 focus:border-neon-blue outline-none transition-colors"
                                placeholder="commander@ironframe.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-mono text-white/60 mb-1">ACCESS CODE</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/40 border border-white/20 rounded p-3 focus:border-neon-blue outline-none transition-colors"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-neon-blue text-black font-bold font-orbitron py-3 rounded hover:bg-white transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'INITIATE SYNC'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-white/30 font-mono">
                            Use <span className="text-white/50">admin@example.com</span> / <span className="text-white/50">123456</span> for demo access.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

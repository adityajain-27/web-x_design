import React, { useState } from 'react';
import { login, register } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';

export default function Auth({ onLogin }) {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({ username: '', email: '', password: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let response;
            if (isLogin) {
                response = await login(formData.email, formData.password);
            } else {
                response = await register(formData.username, formData.email, formData.password);
                if (response.data.token) {
                    // Auto login or just use the token returned
                    response = await login(formData.email, formData.password);
                }
            }

            const { token, user } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            onLogin(user);
        } catch (err) {
            setError(err.response?.data?.error || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] animate-pulse" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="glass-panel p-8 rounded-3xl border-t border-white/20">
                    <div className="text-center mb-8">
                        <div className="w-12 h-12 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-purple-500/20">
                            <Sparkles className="text-white w-6 h-6" />
                        </div>
                        <h2 className="text-3xl font-bold text-white tracking-tight">
                            {isLogin ? 'Welcome Back' : 'Get Started'}
                        </h2>
                        <p className="text-slate-400 mt-2 text-sm">Your emotional intelligence companion</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <AnimatePresence mode='wait'>
                            {!isLogin && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="relative"
                                >
                                    <User className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
                                    <input
                                        type="text"
                                        placeholder="Username"
                                        className="input-modern pl-12"
                                        value={formData.username}
                                        onChange={e => setFormData({ ...formData, username: e.target.value })}
                                        required
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="relative">
                            <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="input-modern pl-12"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
                            <input
                                type="password"
                                placeholder="Password"
                                className="input-modern pl-12"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>

                        {error && (
                            <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg text-center border border-red-500/20">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full glass-button py-3 mt-4 flex justify-center items-center gap-2"
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                            {!loading && <ArrowRight className="w-4 h-4" />}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-slate-400 hover:text-white transition-colors text-sm hover:underline"
                        >
                            {isLogin ? "Need an account? Sign up" : 'Have an account? Sign in'}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

import React, { useState } from 'react';
import { login, register } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, ArrowRight, Sparkles, Star } from 'lucide-react';

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
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-cosmic-950">
            {/* Dynamic Background */}
            <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] bg-neon-purple/20 rounded-full blur-[120px] animate-spin-slow opacity-40 pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-neon-blue/20 rounded-full blur-[100px] animate-float opacity-40 pointer-events-none" />
            <div className="absolute top-[40%] left-[60%] w-[200px] h-[200px] bg-neon-pink/20 rounded-full blur-[80px] animate-pulse-glow pointer-events-none" />

            {/* Stars */}
            <div className="absolute inset-0 opacity-30 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-white rounded-full"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            width: Math.random() < 0.5 ? '2px' : '1px',
                            height: Math.random() < 0.5 ? '2px' : '1px',
                        }}
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
                    />
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="glass-card-premium p-8 rounded-3xl border-t border-white/10 relative overflow-hidden group hover:border-white/20 transition-all duration-500">

                    {/* Header */}
                    <div className="text-center mb-10">
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="w-16 h-16 bg-gradient-to-tr from-neon-purple to-neon-blue rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-[0_0_30px_rgba(176,38,255,0.3)] rotate-3 group-hover:rotate-6 transition-transform duration-500"
                        >
                            <Sparkles className="text-white w-8 h-8" />
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-4xl font-bold text-white tracking-tight mb-2"
                        >
                            {isLogin ? 'Welcome Back' : 'Join the Cosmos'}
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-slate-400 font-light"
                        >
                            Your emotional intelligence companion
                        </motion.p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <AnimatePresence mode='wait'>
                            {!isLogin && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="relative group/input"
                                >
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-slate-500 group-focus-within/input:text-neon-purple transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Username"
                                        className="input-glow pl-11"
                                        value={formData.username}
                                        onChange={e => setFormData({ ...formData, username: e.target.value })}
                                        required
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="relative group/input">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-slate-500 group-focus-within/input:text-neon-blue transition-colors" />
                            </div>
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="input-glow pl-11"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        <div className="relative group/input">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-slate-500 group-focus-within/input:text-neon-pink transition-colors" />
                            </div>
                            <input
                                type="password"
                                placeholder="Password"
                                className="input-glow pl-11"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-300 text-sm bg-red-500/20 p-3 rounded-xl text-center border border-red-500/30 backdrop-blur-sm"
                            >
                                {error}
                            </motion.div>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full btn-neon py-4 mt-6 flex justify-center items-center gap-2 bg-gradient-to-r from-white/10 to-white/5 hover:from-neon-purple/20 hover:to-neon-blue/20 border-white/10"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span className="font-semibold tracking-wide">{isLogin ? 'Sign In' : 'Create Account'}</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </motion.button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center bg-white/5 mx-[-2rem] mb-[-2rem] py-4 border-t border-white/5 hover:bg-white/10 transition-colors">
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-slate-400 hover:text-white transition-colors text-sm font-medium flex items-center justify-center gap-2 mx-auto"
                        >
                            {isLogin ? (
                                <>New here? <span className="text-neon-cyan">Create an account</span></>
                            ) : (
                                <>Already have an account? <span className="text-neon-purple">Sign in</span></>
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

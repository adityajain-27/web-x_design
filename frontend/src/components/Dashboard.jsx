import React, { useState, useEffect } from 'react';
import { getEntries, getTimeline, getStats } from '../services/api';
import EntryForm from './EntryForm';
import EmotionTimeline from './EmotionTimeline';
import { LogOut, Activity, Flame, Zap, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard({ user, onLogout }) {
    const [entries, setEntries] = useState([]);
    const [timeline, setTimeline] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [entriesRes, timelineRes, statsRes] = await Promise.all([
                getEntries(20, 0),
                getTimeline(30),
                getStats()
            ]);

            setEntries(entriesRes.data.entries || []);
            setTimeline(timelineRes.data.timeline || []);
            setStats(statsRes.data);
        } catch (err) {
            console.error("Failed to load dashboard data", err);
        } finally {
            setLoading(false);
        }
    };

    const handleNewEntry = (entry) => {
        setEntries(prev => [entry, ...prev]);
        // Optionally reload stats/timeline here for real-time updates
        // For now, we accept immediate entry update for responsiveness
    };

    return (
        <div className="min-h-screen pb-12">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 py-4 px-6 mb-8 backdrop-blur-md border-b border-white/5 bg-slate-950/80">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center">
                            <Activity className="text-white w-5 h-5" />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight text-white">MoodFlow</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <button onClick={onLogout} className="p-2 hover:bg-white/10 rounded-xl transition-colors text-slate-400 hover:text-white">
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 lg:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Left Column: Stats & Input (4 cols) */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Welcome Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            className="glass-panel p-6 rounded-3xl relative overflow-hidden"
                        >
                            <div className="relative z-10">
                                <h2 className="text-3xl font-bold text-white mb-1">Hello, {user?.username}</h2>
                                <p className="text-slate-400">Your emotional insights.</p>
                            </div>
                        </motion.div>

                        <EntryForm onEntryAdded={handleNewEntry} />

                        {/* Stats Grid */}
                        {stats && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                                    <Flame className="w-6 h-6 text-orange-400 mb-2" />
                                    <div className="text-2xl font-bold text-white">{stats.stats.total_entries}</div>
                                    <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Entries</div>
                                </div>
                                <div className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                                    <Award className="w-6 h-6 text-purple-400 mb-2" />
                                    <div className="text-xl font-bold text-white capitalize">{stats.dominant_emotion?.emotion || '-'}</div>
                                    <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Dominant</div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Chart & History (8 cols) */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Main Chart */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        >
                            <EmotionTimeline timelineData={timeline} />
                        </motion.div>

                        {/* Recent List */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                            className="glass-panel rounded-3xl p-6"
                        >
                            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                                <Zap className="w-4 h-4 text-yellow-400" /> Recent Activity
                            </h3>

                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {entries.map((entry, idx) => (
                                    <motion.div
                                        key={entry.id}
                                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                                        className="group p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-purple-500/30 transition-all cursor-default"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-3">
                                                <span className={`w-2 h-2 rounded-full 
                                            ${entry.emotion?.emotion === 'joy' ? 'bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]' :
                                                        entry.emotion?.emotion === 'sadness' ? 'bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)]' :
                                                            entry.emotion?.emotion === 'anger' ? 'bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.5)]' :
                                                                'bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.5)]'}`}
                                                />
                                                <span className="text-sm font-medium text-slate-200 capitalize">{entry.emotion?.emotion || 'Analyzed'}</span>
                                            </div>
                                            <span className="text-xs text-slate-500 font-mono">
                                                {new Date(entry.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-slate-400 text-sm leading-relaxed pl-5 border-l-2 border-white/5 group-hover:border-purple-500/30 transition-colors">
                                            {entry.content}
                                        </p>
                                    </motion.div>
                                ))}
                                {entries.length === 0 && !loading && (
                                    <div className="text-center py-12 text-slate-500">
                                        <p>No data recorded yet.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
}

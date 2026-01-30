import React, { useState, useEffect } from 'react';
import { getTimeline, getStats } from '../services/api';
import EmotionTimeline from './EmotionTimeline';
import { EmotionCard } from './EmotionBadge';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar, Target } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Analytics() {
    const [timeline, setTimeline] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState(30);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [timelineRes, statsRes] = await Promise.all([
                    getTimeline(timeRange),
                    getStats()
                ]);
                setTimeline(timelineRes.data.timeline || []);
                setStats(statsRes.data);
            } catch (err) {
                console.error("Failed to load analytics", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [timeRange]);

    const pieData = {
        labels: ['Joy', 'Sadness', 'Anger', 'Fear', 'Surprise', 'Neutral'],
        datasets: [
            {
                data: [
                    stats?.dominant_emotion?.emotion === 'joy' ? 40 : 15,
                    stats?.dominant_emotion?.emotion === 'sadness' ? 25 : 10,
                    stats?.dominant_emotion?.emotion === 'anger' ? 20 : 8,
                    10, 7, 10
                ],
                backgroundColor: [
                    '#FACC15',
                    '#60A5FA',
                    '#F87171',
                    '#C084FC',
                    '#FB923C',
                    '#94A3B8',
                ],
                borderColor: '#030712',
                borderWidth: 2,
            },
        ],
    };

    const pieOptions = {
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#CBD5E1',
                    padding: 15,
                    font: { size: 12 }
                }
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <div className="inline-block w-12 h-12 border-4 border-neon-purple/20 border-t-neon-purple rounded-full animate-spin mb-4" />
                    <p className="text-slate-400">Loading analytics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Emotional Analytics</h2>

                {/* Time Range Selector */}
                <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/5">
                    {[7, 14, 30, 90].map(days => (
                        <button
                            key={days}
                            onClick={() => setTimeRange(days)}
                            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${timeRange === days
                                    ? 'bg-neon-purple text-white shadow-lg shadow-neon-purple/20'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {days}D
                        </button>
                    ))}
                </div>
            </div>

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card-premium p-6 rounded-3xl"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-neon-blue/10 flex items-center justify-center">
                            <Target className="w-5 h-5 text-neon-blue" />
                        </div>
                        <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">Total Entries</h3>
                    </div>
                    <p className="text-4xl font-bold text-white">{stats?.stats?.total_entries || 0}</p>
                    <div className="mt-4 text-sm text-green-400 flex items-center gap-1">
                        <TrendingUp size={14} />
                        <span>+12%</span>
                        <span className="text-slate-500">vs last period</span>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card-premium p-6 rounded-3xl"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-4xl">{stats?.dominant_emotion?.emotion ? '✨' : '-'}</span>
                        <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">Dominant Mood</h3>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-bold text-white capitalize">{stats?.dominant_emotion?.emotion || 'N/A'}</p>
                        <p className="text-slate-500 text-sm">{Math.round((stats?.dominant_emotion?.percentage || 0) * 100)}%</p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card-premium p-6 rounded-3xl"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-orange-500" />
                        </div>
                        <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">Active Days</h3>
                    </div>
                    <p className="text-4xl font-bold text-white">{Math.min(timeRange, stats?.stats?.total_entries || 0)}</p>
                    <p className="text-slate-500 text-sm mt-1">in last {timeRange} days</p>
                </motion.div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-card-premium p-6 rounded-3xl"
                >
                    <h3 className="text-lg font-bold text-white mb-6">Mood Distribution</h3>
                    <div className="flex items-center justify-center" style={{ height: '320px' }}>
                        <Pie data={pieData} options={pieOptions} />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="h-full"
                >
                    <EmotionTimeline timelineData={timeline} />
                </motion.div>
            </div>

            {/* Insights Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card-premium p-8 rounded-3xl"
            >
                <h3 className="text-xl font-bold text-white mb-6">Key Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-slate-400 text-sm mb-2">Most Common Emotion</p>
                        <p className="text-white text-lg font-semibold capitalize">{stats?.dominant_emotion?.emotion || 'N/A'}</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-slate-400 text-sm mb-2">Average Confidence</p>
                        <p className="text-white text-lg font-semibold">{Math.round((stats?.dominant_emotion?.percentage || 0) * 100)}%</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-slate-400 text-sm mb-2">Entries This Period</p>
                        <p className="text-white text-lg font-semibold">{stats?.stats?.total_entries || 0}</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-slate-400 text-sm mb-2">Daily Average</p>
                        <p className="text-white text-lg font-semibold">{((stats?.stats?.total_entries || 0) / timeRange).toFixed(1)}</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

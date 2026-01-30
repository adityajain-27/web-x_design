import React, { useState, useEffect } from 'react';
import { getEntries, getTimeline, getStats } from '../services/api';
import EntryForm from './EntryForm';
import EmotionTimeline from './EmotionTimeline';
import History from './History';
import Analytics from './Analytics';
import Settings from './Settings';
import { EmotionBadge, EmotionCard } from './EmotionBadge';
import { LogOut, Activity, Flame, Zap, LayoutDashboard, Calendar, Settings as SettingsIcon, Menu, X, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard({ user, onLogout }) {
    const [entries, setEntries] = useState([]);
    const [timeline, setTimeline] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');

    const handleNavClick = (tabId) => {
        setActiveTab(tabId);
        setMobileMenuOpen(false); // Close mobile menu on nav
    };

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
        loadData();
    };

    const Greeting = () => {
        const hour = new Date().getHours();
        let greeting = 'Good Morning';
        if (hour >= 12 && hour < 17) greeting = 'Good Afternoon';
        if (hour >= 17) greeting = 'Good Evening';

        return (
            <div className="mb-2">
                <span className="text-neon-purple font-medium tracking-wider text-sm uppercase">{greeting}</span>
                <h1 className="text-4xl font-bold text-white mt-1">
                    {user?.username}
                </h1>
            </div>
        );
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'history':
                return (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <History />
                    </motion.div>
                );
            case 'analytics':
                return (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <Analytics />
                    </motion.div>
                );
            case 'settings':
                return (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <Settings user={user} onLogout={onLogout} />
                    </motion.div>
                );
            case 'dashboard':
            default:
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Left Column (Input & Quick Stats) */}
                        <div className="lg:col-span-4 space-y-8">
                            <EntryForm onEntryAdded={handleNewEntry} />

                            {stats && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-white px-2">Overview</h3>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="glass-card-premium p-5 rounded-2xl">
                                            <div className="text-slate-400 text-xs uppercase font-medium tracking-wider mb-2">Total Entries</div>
                                            <div className="text-3xl font-bold text-white">{stats.stats.total_entries}</div>
                                        </div>
                                        <div className="glass-card-premium p-5 rounded-2xl flex flex-col justify-between">
                                            <div className="text-slate-400 text-xs uppercase font-medium tracking-wider mb-2">Mood Score</div>
                                            <div className="text-3xl font-bold text-neon-cyan">8.4</div>
                                        </div>
                                    </div>

                                    {stats.dominant_emotion?.emotion && (
                                        <EmotionCard
                                            emotion={stats.dominant_emotion.emotion}
                                            confidence={stats.dominant_emotion.percentage}
                                        />
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Right Column (Timeline & Activity) */}
                        <div className="lg:col-span-8 space-y-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <EmotionTimeline timelineData={timeline} />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="glass-card-premium rounded-3xl p-8"
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        <Zap className="w-5 h-5 text-neon-yellow" style={{ color: '#FACC15' }} />
                                        Recent Activity
                                    </h3>
                                    <button
                                        onClick={() => handleNavClick('history')}
                                        className="text-sm text-neon-purple hover:text-neon-pink transition-colors"
                                    >
                                        View All
                                    </button>
                                </div>

                                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                    {entries.map((entry, idx) => (
                                        <div
                                            key={entry.id}
                                            className="group p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all cursor-default relative overflow-hidden"
                                        >
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-neon-purple to-neon-blue opacity-0 group-hover:opacity-100 transition-opacity" />

                                            <div className="flex justify-between items-start mb-3">
                                                <EmotionBadge
                                                    emotion={entry.emotion?.emotion || 'neutral'}
                                                    confidence={entry.emotion?.confidence}
                                                    size="sm"
                                                    showConfidence={true}
                                                />
                                                <span className="text-xs text-slate-500 font-mono">
                                                    {new Date(entry.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <p className="text-slate-300 text-sm leading-relaxed">
                                                {entry.content}
                                            </p>
                                        </div>
                                    ))}
                                    {entries.length === 0 && !loading && (
                                        <div className="text-center py-12 text-slate-500">
                                            <p>Start journaling to verify your emotional drift.</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen flex bg-cosmic-950">
            {/* Sidebar (Desktop) */}
            <aside className="hidden lg:flex w-72 flex-col fixed inset-y-0 left-0 border-r border-white/5 bg-cosmic-900/30 backdrop-blur-xl z-50">
                <div className="p-8 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-neon-purple to-neon-blue flex items-center justify-center shadow-lg shadow-neon-purple/20">
                            <Activity className="text-white w-6 h-6" />
                        </div>
                        <span className="text-xl font-bold text-white tracking-tight">MoodFlow</span>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2">
                    <NavItem
                        icon={LayoutDashboard}
                        label="Dashboard"
                        active={activeTab === 'dashboard'}
                        onClick={() => handleNavClick('dashboard')}
                    />
                    <NavItem
                        icon={Calendar}
                        label="History"
                        active={activeTab === 'history'}
                        onClick={() => handleNavClick('history')}
                    />
                    <NavItem
                        icon={Activity}
                        label="Analytics"
                        active={activeTab === 'analytics'}
                        onClick={() => handleNavClick('analytics')}
                    />
                    <NavItem
                        icon={SettingsIcon}
                        label="Settings"
                        active={activeTab === 'settings'}
                        onClick={() => handleNavClick('settings')}
                    />
                </nav>

                <div className="p-4 border-t border-white/5">
                    <div className="bg-white/5 rounded-2xl p-4 mb-4">
                        <div className="text-xs text-slate-400 mb-1">Current Streak</div>
                        <div className="flex items-center gap-2 text-white font-bold text-lg">
                            <Flame className="w-5 h-5 text-orange-500" />
                            <span>{Math.floor(Math.random() * 5) + 3} Days</span>
                        </div>
                    </div>
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-72 min-h-screen relative">
                {/* Mobile Header */}
                <header className="lg:hidden sticky top-0 z-40 bg-cosmic-950/80 backdrop-blur-md border-b border-white/5 px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Activity className="text-neon-purple w-6 h-6" />
                        <span className="text-lg font-bold text-white">MoodFlow</span>
                    </div>
                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-400">
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </header>

                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, x: -300 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -300 }}
                            transition={{ type: 'spring', damping: 25 }}
                            className="lg:hidden fixed inset-y-0 left-0 w-72 bg-cosmic-900/95 backdrop-blur-xl border-r border-white/10 z-50 flex flex-col"
                        >
                            <div className="p-8 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-neon-purple to-neon-blue flex items-center justify-center shadow-lg shadow-neon-purple/20">
                                        <Activity className="text-white w-6 h-6" />
                                    </div>
                                    <span className="text-xl font-bold text-white tracking-tight">MoodFlow</span>
                                </div>
                            </div>

                            <nav className="flex-1 px-4 py-6 space-y-2">
                                <NavItem
                                    icon={LayoutDashboard}
                                    label="Dashboard"
                                    active={activeTab === 'dashboard'}
                                    onClick={() => handleNavClick('dashboard')}
                                />
                                <NavItem
                                    icon={Calendar}
                                    label="History"
                                    active={activeTab === 'history'}
                                    onClick={() => handleNavClick('history')}
                                />
                                <NavItem
                                    icon={Activity}
                                    label="Analytics"
                                    active={activeTab === 'analytics'}
                                    onClick={() => handleNavClick('analytics')}
                                />
                                <NavItem
                                    icon={SettingsIcon}
                                    label="Settings"
                                    active={activeTab === 'settings'}
                                    onClick={() => handleNavClick('settings')}
                                />
                            </nav>

                            <div className="p-4 border-t border-white/5">
                                <button
                                    onClick={onLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                                >
                                    <LogOut size={20} />
                                    <span className="font-medium">Sign Out</span>
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="max-w-6xl mx-auto px-4 lg:px-10 py-8 lg:py-12">
                    {activeTab === 'dashboard' && (
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                            <Greeting />
                            <div className="flex items-center gap-4">
                                <button className="p-3 rounded-full bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors relative">
                                    <Bell size={20} />
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-neon-pink rounded-full border border-cosmic-950" />
                                </button>
                                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple p-[2px]">
                                    <div className="h-full w-full rounded-full bg-cosmic-950 flex items-center justify-center text-white font-bold">
                                        {user?.username?.[0]?.toUpperCase()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {renderContent()}
                </div>
            </main>
        </div>
    );
}

function NavItem({ icon: Icon, label, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${active ? 'bg-neon-purple/10 text-neon-purple' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
        >
            <Icon size={20} className={active ? 'text-neon-purple' : 'text-slate-500 group-hover:text-white transition-colors'} />
            <span className="font-medium">{label}</span>
            {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-neon-purple shadow-[0_0_8px_rgba(176,38,255,0.8)]" />}
        </button>
    );
}

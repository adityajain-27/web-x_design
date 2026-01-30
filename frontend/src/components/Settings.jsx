import React, { useState } from 'react';
import { User, Bell, Lock, Moon, Globe, LogOut, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Settings({ user, onLogout }) {
    const [darkMode, setDarkMode] = useState(true);
    const [reducedMotion, setReducedMotion] = useState(false);
    const [dailyReminders, setDailyReminders] = useState(true);
    const [weeklyDigest, setWeeklyDigest] = useState(true);
    const [showSaved, setShowSaved] = useState(false);

    const handleSave = () => {
        // In a real app, this would save to backend
        setShowSaved(true);
        setTimeout(() => setShowSaved(false), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Settings</h2>
                {showSaved && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 bg-green-500/20 border border-green-500/30 px-4 py-2 rounded-xl text-green-400 text-sm"
                    >
                        <Check size={16} />
                        Saved successfully
                    </motion.div>
                )}
            </div>

            {/* Profile Section */}
            <div className="glass-card-premium p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-neon-purple to-neon-blue p-[3px]">
                    <div className="w-full h-full rounded-full bg-cosmic-950 flex items-center justify-center text-3xl font-bold text-white">
                        {user?.username?.[0]?.toUpperCase()}
                    </div>
                </div>
                <div className="text-center md:text-left flex-1">
                    <h3 className="text-2xl font-bold text-white">{user?.username}</h3>
                    <p className="text-slate-400">{user?.email}</p>
                    <div className="flex gap-3 mt-4">
                        <button className="px-6 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors border border-white/5">
                            Edit Profile
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-6 py-2 rounded-xl bg-neon-purple/20 hover:bg-neon-purple/30 text-neon-purple border border-neon-purple/30 text-sm font-medium transition-colors"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>

            {/* Preferences */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card-premium p-6 rounded-3xl space-y-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Moon className="w-5 h-5 text-neon-blue" />
                        Appearance
                    </h3>

                    <div className="space-y-4">
                        <ToggleItem
                            label="Dark Mode"
                            description="Always enabled for Cosmic Glass theme"
                            enabled={darkMode}
                            onChange={setDarkMode}
                            disabled={true}
                        />
                        <ToggleItem
                            label="Reduced Motion"
                            description="Minimize animations"
                            enabled={reducedMotion}
                            onChange={setReducedMotion}
                        />
                    </div>
                </div>

                <div className="glass-card-premium p-6 rounded-3xl space-y-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Bell className="w-5 h-5 text-neon-pink" />
                        Notifications
                    </h3>

                    <div className="space-y-4">
                        <ToggleItem
                            label="Daily Reminders"
                            description="Get reminded to journal"
                            enabled={dailyReminders}
                            onChange={setDailyReminders}
                        />
                        <ToggleItem
                            label="Weekly Digest"
                            description="Receive weekly summaries"
                            enabled={weeklyDigest}
                            onChange={setWeeklyDigest}
                        />
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="glass-card-premium p-6 rounded-3xl">
                <h3 className="text-lg font-bold text-white mb-4">Account Stats</h3>
                <div className="grid grid-cols-3 gap-6">
                    <div className="text-center">
                        <p className="text-3xl font-bold text-neon-purple">24</p>
                        <p className="text-slate-400 text-sm mt-1">Total Entries</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-bold text-neon-blue">7</p>
                        <p className="text-slate-400 text-sm mt-1">Day Streak</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-bold text-neon-pink">12</p>
                        <p className="text-slate-400 text-sm mt-1">Days Active</p>
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="glass-card-premium p-6 rounded-3xl border-red-500/20">
                <h3 className="text-lg font-bold text-red-400 flex items-center gap-2 mb-4">
                    <Lock className="w-5 h-5" />
                    Account Security
                </h3>
                <div className="flex flex-col sm:flex-row gap-4">
                    <button className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors border border-white/5 flex-1">
                        Change Password
                    </button>
                    <button
                        onClick={onLogout}
                        className="px-6 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium transition-colors border border-red-500/20 flex-1 flex items-center justify-center gap-2"
                    >
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
}

function ToggleItem({ label, description, enabled, onChange, disabled = false }) {
    return (
        <div className={`flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors ${disabled ? 'opacity-50' : 'cursor-pointer'}`}>
            <div className="flex-1" onClick={() => !disabled && onChange(!enabled)}>
                <p className="text-slate-300 font-medium">{label}</p>
                {description && <p className="text-slate-500 text-xs mt-0.5">{description}</p>}
            </div>
            <button
                onClick={() => !disabled && onChange(!enabled)}
                disabled={disabled}
                className={`relative w-12 h-7 rounded-full transition-colors ${enabled ? 'bg-neon-purple' : 'bg-slate-700'
                    } ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
                <motion.div
                    animate={{ x: enabled ? 20 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm"
                />
            </button>
        </div>
    );
}

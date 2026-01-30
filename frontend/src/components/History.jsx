import React, { useState, useEffect } from 'react';
import { getEntries } from '../services/api';
import { EmotionBadge } from './EmotionBadge';
import { Search, Filter, Calendar, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function History() {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const entriesPerPage = 10;

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const { data } = await getEntries(100, 0);
                setEntries(data.entries || []);
            } catch (err) {
                console.error("Failed to load history", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    // Filter and search logic
    const filteredEntries = entries.filter(entry => {
        const matchesFilter = filter === 'all' || entry.emotion?.emotion?.toLowerCase() === filter;
        const matchesSearch = entry.content.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredEntries.length / entriesPerPage);
    const startIndex = (currentPage - 1) * entriesPerPage;
    const paginatedEntries = filteredEntries.slice(startIndex, startIndex + entriesPerPage);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filter, searchQuery]);

    const emotions = ['all', 'joy', 'sadness', 'anger', 'fear', 'surprise', 'neutral'];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white">Journal History</h2>
                    <p className="text-slate-400 text-sm">
                        {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'} found
                    </p>
                </div>

                {/* Search Bar */}
                <div className="w-full md:w-auto flex-1 md:max-w-md">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search entries..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-neon-purple/50 transition-colors"
                        />
                    </div>
                </div>
            </div>

            {/* Filter Pills */}
            <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/5 overflow-x-auto">
                {emotions.map(emo => (
                    <button
                        key={emo}
                        onClick={() => setFilter(emo)}
                        className={`px-4 py-2 rounded-lg text-xs font-medium capitalize transition-all whitespace-nowrap ${filter === emo
                                ? 'bg-neon-purple text-white shadow-lg shadow-neon-purple/20'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        {emo}
                    </button>
                ))}
            </div>

            {/* Entries Grid */}
            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-12 text-slate-500">
                        <div className="inline-block w-8 h-8 border-4 border-neon-purple/20 border-t-neon-purple rounded-full animate-spin" />
                        <p className="mt-4">Loading history...</p>
                    </div>
                ) : paginatedEntries.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 glass-card-premium rounded-3xl p-8">
                        <p className="text-lg">No entries found.</p>
                        <p className="text-sm mt-2">Try adjusting your filters or search query.</p>
                    </div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {paginatedEntries.map((entry, idx) => (
                            <motion.div
                                key={entry.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ delay: idx * 0.03 }}
                                layout
                                className="glass-card-premium p-6 rounded-2xl flex flex-col md:flex-row gap-6 md:items-center group hover:border-neon-purple/20"
                            >
                                {/* Date Badge */}
                                <div className="flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/5">
                                    <span className="text-sm font-bold text-slate-400">
                                        {new Date(entry.created_at).toLocaleString('default', { month: 'short' }).toUpperCase()}
                                    </span>
                                    <span className="text-2xl font-bold text-white">
                                        {new Date(entry.created_at).getDate()}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <EmotionBadge
                                            emotion={entry.emotion?.emotion}
                                            confidence={entry.emotion?.confidence}
                                            showConfidence={true}
                                        />
                                        <span className="text-xs text-slate-500 flex items-center gap-1">
                                            <Calendar size={12} />
                                            {new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p className="text-slate-200 leading-relaxed">
                                        {entry.content}
                                    </p>
                                </div>

                                {/* Actions */}
                                <button
                                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Delete entry"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <div className="flex gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-10 h-10 rounded-lg font-medium transition-all ${currentPage === page
                                        ? 'bg-neon-purple text-white shadow-lg shadow-neon-purple/20'
                                        : 'bg-white/5 hover:bg-white/10 text-slate-400'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}
        </div>
    );
}

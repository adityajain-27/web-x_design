import React, { useState } from 'react';
import { createEntry } from '../services/api';
import { Send, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EntryForm({ onEntryAdded }) {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        setLoading(true);
        try {
            const { data } = await createEntry(content);
            // Backend returns { message: "...", entry: { ... } }
            setContent('');
            if (onEntryAdded && data.entry) {
                onEntryAdded(data.entry);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-panel rounded-3xl p-6 mb-8 transition-all duration-300 ${isFocused ? 'ring-2 ring-purple-500/20 border-purple-500/30' : ''}`}
        >
            <h2 className="text-lg font-medium mb-4 text-slate-200">New Journal Entry</h2>
            <form onSubmit={handleSubmit} className="relative">
                <textarea
                    className="w-full bg-slate-950/30 border border-slate-700/50 rounded-2xl p-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:bg-slate-950/50 transition-colors min-h-[120px] resize-none"
                    placeholder="How are you feeling? Provide some context for better AI analysis..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    disabled={loading}
                />

                <div className="flex justify-between items-center mt-3">
                    <span className="text-xs text-slate-500 font-medium px-2">
                        {content.length} characters
                    </span>
                    <button
                        type="submit"
                        disabled={loading || !content.trim()}
                        className="glass-button px-6 py-2 flex items-center gap-2 disabled:opacity-50 text-sm"
                    >
                        {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <Send className="h-4 w-4" />}
                        <span>Analyze Mood</span>
                    </button>
                </div>
            </form>
        </motion.div>
    );
}

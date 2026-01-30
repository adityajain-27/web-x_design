import React, { useState } from 'react';
import { createEntry } from '../services/api';
import { Send, Loader2, Sparkles } from 'lucide-react';
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
            className={`glass-card-premium rounded-3xl p-1 mb-8 transition-all duration-500 ${isFocused ? 'shadow-[0_0_40px_rgba(77,77,255,0.15)] border-neon-blue/30 scale-[1.01]' : ''}`}
        >
            <div className="bg-cosmic-950/40 rounded-[22px] p-6 backdrop-blur-xl">
                <div className="flex items-center gap-2 mb-4 text-slate-400 text-sm font-medium uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-neon-purple" />
                    <span>Focus Mode</span>
                </div>

                <form onSubmit={handleSubmit} className="relative">
                    <textarea
                        className="w-full bg-transparent border-none text-lg text-white placeholder-slate-600 focus:ring-0 resize-none min-h-[120px] leading-relaxed custom-scrollbar p-0"
                        placeholder="How are you feeling right now? The stars differ from night to night..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        disabled={loading}
                    />

                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/5">
                        <div className="flex items-center gap-2">
                            <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border border-white/10 text-slate-400 bg-white/5"
                                style={{ color: content.length > 200 ? '#4D4DFF' : 'inherit' }}
                            >
                                {content.length}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !content.trim()}
                            className="bg-neon-blue/10 hover:bg-neon-blue/20 text-neon-blue border border-neon-blue/20 hover:border-neon-blue/50 px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium hover:shadow-[0_0_20px_rgba(77,77,255,0.2)]"
                        >
                            {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <Send className="h-4 w-4" />}
                            <span>Analyze</span>
                        </button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
}

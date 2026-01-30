import React from 'react';
import { Smile, Frown, Flame, AlertCircle, Sparkles, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

const emotionConfig = {
    joy: {
        icon: Smile,
        color: 'from-yellow-400 to-orange-500',
        bgGlow: 'bg-yellow-500/20',
        borderColor: 'border-yellow-500/50',
        textColor: 'text-yellow-400',
        shadowColor: 'shadow-yellow-500/50',
        label: 'Joy'
    },
    sadness: {
        icon: Frown,
        color: 'from-blue-400 to-indigo-500',
        bgGlow: 'bg-blue-500/20',
        borderColor: 'border-blue-500/50',
        textColor: 'text-blue-400',
        shadowColor: 'shadow-blue-500/50',
        label: 'Sadness'
    },
    anger: {
        icon: Flame,
        color: 'from-red-400 to-rose-600',
        bgGlow: 'bg-red-500/20',
        borderColor: 'border-red-500/50',
        textColor: 'text-red-400',
        shadowColor: 'shadow-red-500/50',
        label: 'Anger'
    },
    fear: {
        icon: AlertCircle,
        color: 'from-purple-400 to-violet-600',
        bgGlow: 'bg-purple-500/20',
        borderColor: 'border-purple-500/50',
        textColor: 'text-purple-400',
        shadowColor: 'shadow-purple-500/50',
        label: 'Fear'
    },
    surprise: {
        icon: Sparkles,
        color: 'from-pink-400 to-fuchsia-500',
        bgGlow: 'bg-pink-500/20',
        borderColor: 'border-pink-500/50',
        textColor: 'text-pink-400',
        shadowColor: 'shadow-pink-500/50',
        label: 'Surprise'
    },
    neutral: {
        icon: Minus,
        color: 'from-gray-400 to-slate-500',
        bgGlow: 'bg-gray-500/20',
        borderColor: 'border-gray-500/50',
        textColor: 'text-gray-400',
        shadowColor: 'shadow-gray-500/50',
        label: 'Neutral'
    }
};

/**
 * Enhanced emotion badge with icon and animation
 */
export function EmotionBadge({ emotion, confidence, size = 'md', showConfidence = false }) {
    const config = emotionConfig[emotion] || emotionConfig.neutral;
    const Icon = config.icon;

    const sizeClasses = {
        sm: 'px-3 py-1.5 text-xs gap-1.5',
        md: 'px-4 py-2 text-sm gap-2',
        lg: 'px-6 py-3 text-base gap-3'
    };

    const iconSizes = {
        sm: 14,
        md: 16,
        lg: 20
    };

    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`inline-flex items-center ${sizeClasses[size]} rounded-full 
                ${config.bgGlow} border ${config.borderColor} 
                backdrop-blur-sm font-medium ${config.textColor}
                shadow-lg ${config.shadowColor}`}
        >
            <Icon size={iconSizes[size]} className="animate-pulse" />
            <span className="capitalize">{config.label}</span>
            {showConfidence && confidence && (
                <span className="opacity-70 text-xs">
                    {Math.round(confidence * 100)}%
                </span>
            )}
        </motion.div>
    );
}

/**
 * Large emotion card with gradient background
 */
export function EmotionCard({ emotion, confidence, className = '' }) {
    const config = emotionConfig[emotion] || emotionConfig.neutral;
    const Icon = config.icon;

    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            className={`relative overflow-hidden rounded-3xl p-6 ${className}`}
        >
            {/* Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${config.color} opacity-10`} />

            {/* Glow Effect */}
            <div className={`absolute inset-0 ${config.bgGlow} blur-2xl`} />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center">
                <motion.div
                    animate={{
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                    className={`w-16 h-16 rounded-full ${config.bgGlow} border-2 ${config.borderColor} 
                        flex items-center justify-center mb-4 shadow-xl ${config.shadowColor}`}
                >
                    <Icon size={32} className={config.textColor} />
                </motion.div>

                <h3 className={`text-2xl font-bold ${config.textColor} mb-2 capitalize`}>
                    {config.label}
                </h3>

                {confidence && (
                    <div className="text-white/60 text-sm">
                        {Math.round(confidence * 100)}% confidence
                    </div>
                )}
            </div>
        </motion.div>
    );
}

/**
 * Emotion dot indicator (for lists)
 */
export function EmotionDot({ emotion, size = 'md' }) {
    const config = emotionConfig[emotion] || emotionConfig.neutral;

    const sizeClasses = {
        sm: 'w-2 h-2',
        md: 'w-3 h-3',
        lg: 'w-4 h-4'
    };

    return (
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`${sizeClasses[size]} rounded-full ${config.bgGlow} 
                border-2 ${config.borderColor} shadow-lg ${config.shadowColor}`}
        />
    );
}

export default EmotionBadge;

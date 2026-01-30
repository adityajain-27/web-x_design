import React, { useMemo } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function EmotionTimeline({ timelineData }) {
    const chartData = useMemo(() => {
        const labels = timelineData.map(t => new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }));

        const colors = {
            joy: '#FACC15',       // Yellow
            sadness: '#60A5FA',   // Blue
            anger: '#F87171',     // Red
            fear: '#C084FC',      // Purple
        };

        const createDataset = (label, color, key) => ({
            label,
            data: timelineData.map(t => t[key] || 0),
            borderColor: color,
            backgroundColor: (context) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                gradient.addColorStop(0, color + '40'); // 25% opacity
                gradient.addColorStop(1, color + '00'); // 0% opacity
                return gradient;
            },
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointBackgroundColor: color,
            pointBorderColor: '#030712',
            pointBorderWidth: 2,
        });

        return {
            labels,
            datasets: [
                createDataset('Joy', colors.joy, 'avg_joy'),
                createDataset('Sadness', colors.sadness, 'avg_sadness'),
                createDataset('Anger', colors.anger, 'avg_anger'),
                createDataset('Fear', colors.fear, 'avg_fear'),
            ]
        };
    }, [timelineData]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                align: 'end',
                labels: {
                    color: '#94a3b8',
                    usePointStyle: true,
                    boxWidth: 6,
                    font: { family: "'Outfit', sans-serif", size: 12 }
                },
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(3, 7, 18, 0.9)',
                titleColor: '#f8fafc',
                bodyColor: '#cbd5e1',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 12,
                titleFont: { family: "'Outfit', sans-serif", size: 14 },
                bodyFont: { family: "'Outfit', sans-serif", size: 13 },
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 1.0,
                grid: { color: 'rgba(255, 255, 255, 0.03)', tickLength: 0 },
                ticks: { color: '#64748b', font: { family: "'Outfit', sans-serif", size: 10 }, padding: 10 },
                border: { display: false }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#64748b', font: { family: "'Outfit', sans-serif", size: 10 }, maxRotation: 0 },
                border: { display: false }
            }
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        }
    };

    return (
        <div className="glass-card-premium p-8 rounded-3xl h-[400px] relative">
            <h3 className="text-lg font-bold text-white mb-6 tracking-wide">Emotional Drift</h3>
            <div className="h-[300px] w-full">
                {timelineData.length > 0 ? (
                    <Line data={chartData} options={options} />
                ) : (
                    <div className="flex h-full items-center justify-center text-slate-500 font-medium">
                        No timeline data available yet.
                    </div>
                )}
            </div>
        </div>
    );
}

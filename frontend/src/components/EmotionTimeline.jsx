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
    // timelineData is array of { date, avg_joy, avg_sadness, ... }

    const chartData = useMemo(() => {
        // Backend returns data sorted by date ASC
        const labels = timelineData.map(t => new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }));

        const colors = {
            joy: '#FACC15',
            sadness: '#60A5FA',
            anger: '#F87171',
        };

        const createDataset = (label, color, key) => ({
            label,
            data: timelineData.map(t => t[key] || 0),
            borderColor: color,
            backgroundColor: (context) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                gradient.addColorStop(0, color + '40');
                gradient.addColorStop(1, color + '00');
                return gradient;
            },
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            pointRadius: 0,
            pointHoverRadius: 6,
        });

        return {
            labels,
            datasets: [
                createDataset('Joy', colors.joy, 'avg_joy'),
                createDataset('Sadness', colors.sadness, 'avg_sadness'),
                createDataset('Anger', colors.anger, 'avg_anger'),
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
                labels: { color: '#94a3b8', usePointStyle: true, boxWidth: 6, font: { family: "'Inter', sans-serif", size: 11 } },
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                titleColor: '#f8fafc',
                bodyColor: '#cbd5e1',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 1.0,
                grid: { color: 'rgba(255, 255, 255, 0.05)', tickLength: 0 },
                ticks: { color: '#64748b', font: { size: 10 }, padding: 10 },
                border: { display: false }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#64748b', font: { size: 10 }, maxRotation: 0 },
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
        <div className="glass-panel p-6 rounded-3xl h-[400px] relative">
            <h3 className="text-lg font-semibold text-white mb-6">30-Day Emotion Trend</h3>
            <div className="h-[300px] w-full">
                {timelineData.length > 0 ? (
                    <Line data={chartData} options={options} />
                ) : (
                    <div className="flex h-full items-center justify-center text-slate-500">
                        No timeline data available yet.
                    </div>
                )}
            </div>
        </div>
    );
}

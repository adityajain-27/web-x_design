/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                cosmic: {
                    950: '#030712', // Deep space
                    900: '#0B0F19', // Slightly lighter space
                    800: '#161B2E', // UI elements
                },
                neon: {
                    purple: '#B026FF',
                    blue: '#4D4DFF',
                    pink: '#FF26B9',
                    cyan: '#00F0FF'
                }
            },
            animation: {
                'spin-slow': 'spin 12s linear infinite',
                'float': 'float 6s ease-in-out infinite',
                'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                'pulse-glow': {
                    '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
                    '50%': { opacity: '1', transform: 'scale(1.05)' },
                }
            }
        },
    },
    plugins: [],
}

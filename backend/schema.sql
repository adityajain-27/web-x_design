-- Emotional Drift Monitoring Database Schema

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Text entries submitted by users
CREATE TABLE IF NOT EXISTS text_entries (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Emotion analysis results from AI
CREATE TABLE IF NOT EXISTS emotion_analysis (
    id SERIAL PRIMARY KEY,
    entry_id INTEGER REFERENCES text_entries(id) ON DELETE CASCADE,
    emotion VARCHAR(20) NOT NULL,
    confidence DECIMAL(5,4),
    joy_score DECIMAL(5,4) DEFAULT 0,
    sadness_score DECIMAL(5,4) DEFAULT 0,
    anger_score DECIMAL(5,4) DEFAULT 0,
    fear_score DECIMAL(5,4) DEFAULT 0,
    surprise_score DECIMAL(5,4) DEFAULT 0,
    neutral_score DECIMAL(5,4) DEFAULT 0,
    analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_text_entries_user_id ON text_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_text_entries_timestamp ON text_entries(timestamp);
CREATE INDEX IF NOT EXISTS idx_emotion_analysis_entry_id ON emotion_analysis(entry_id);

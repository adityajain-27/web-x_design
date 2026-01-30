import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create SQLite database
const db = new Database(join(__dirname, 'emotional_drift.db'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Text entries submitted by users
CREATE TABLE IF NOT EXISTS text_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Emotion analysis results from AI
CREATE TABLE IF NOT EXISTS emotion_analysis (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    entry_id INTEGER NOT NULL,
    emotion TEXT NOT NULL,
    confidence REAL,
    joy_score REAL DEFAULT 0,
    sadness_score REAL DEFAULT 0,
    anger_score REAL DEFAULT 0,
    fear_score REAL DEFAULT 0,
    surprise_score REAL DEFAULT 0,
    neutral_score REAL DEFAULT 0,
    analyzed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (entry_id) REFERENCES text_entries(id) ON DELETE CASCADE
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_text_entries_user_id ON text_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_text_entries_timestamp ON text_entries(timestamp);
CREATE INDEX IF NOT EXISTS idx_emotion_analysis_entry_id ON emotion_analysis(entry_id);
`);

console.log('✅ SQLite database initialized');

export default db;

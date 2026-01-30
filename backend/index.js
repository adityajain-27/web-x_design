import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import pool from "./db.js";
import { authenticateToken, generateToken } from "./authMiddleware.js";
import { analyzeEmotion } from "./emotionService.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
    res.json({ message: "Emotional Drift Monitoring API", status: "running" });
});


// ==================== AUTH ROUTES ====================

// Register new user
app.post("/api/auth/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters" });
        }

        // Check if user already exists
        const existingUser = await pool.query(
            "SELECT * FROM users WHERE email = $1 OR username = $2",
            [email, username]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create user
        const result = await pool.query(
            "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, created_at",
            [username, email, passwordHash]
        );

        const user = result.rows[0];
        const token = generateToken(user.id, user.username);

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Server error during registration" });
    }
});

// Login user
app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        // Find user
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const user = result.rows[0];

        // Verify password
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = generateToken(user.id, user.username);

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Server error during login" });
    }
});

// ==================== TEXT ENTRY ROUTES ====================

// Submit new text entry with emotion analysis
app.post("/api/entries", authenticateToken, async (req, res) => {
    try {
        const { content } = req.body;
        const userId = req.user.userId;

        if (!content || content.trim().length === 0) {
            return res.status(400).json({ error: "Content cannot be empty" });
        }

        // Create text entry
        const entryResult = await pool.query(
            "INSERT INTO text_entries (user_id, content) VALUES ($1, $2) RETURNING *",
            [userId, content]
        );

        const entry = entryResult.rows[0];

        // Analyze emotion using AI
        const emotionData = await analyzeEmotion(content);

        // Store emotion analysis
        const analysisResult = await pool.query(
            `INSERT INTO emotion_analysis 
            (entry_id, emotion, confidence, joy_score, sadness_score, anger_score, fear_score, surprise_score, neutral_score) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
            RETURNING *`,
            [
                entry.id,
                emotionData.emotion,
                emotionData.confidence,
                emotionData.joy_score,
                emotionData.sadness_score,
                emotionData.anger_score,
                emotionData.fear_score,
                emotionData.surprise_score,
                emotionData.neutral_score
            ]
        );

        res.status(201).json({
            message: "Entry created successfully",
            entry: {
                ...entry,
                emotion: analysisResult.rows[0]
            }
        });
    } catch (error) {
        console.error("Entry creation error:", error);
        res.status(500).json({ error: "Server error creating entry" });
    }
});

// Get all entries for current user
app.get("/api/entries", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const limit = parseInt(req.query.limit) || 50;
        const offset = parseInt(req.query.offset) || 0;

        const result = await pool.query(
            `SELECT 
                te.id, te.content, te.timestamp, te.created_at,
                ea.emotion, ea.confidence,
                ea.joy_score, ea.sadness_score, ea.anger_score, 
                ea.fear_score, ea.surprise_score, ea.neutral_score
            FROM text_entries te
            LEFT JOIN emotion_analysis ea ON te.id = ea.entry_id
            WHERE te.user_id = $1
            ORDER BY te.timestamp DESC
            LIMIT $2 OFFSET $3`,
            [userId, limit, offset]
        );

        res.json({
            entries: result.rows,
            count: result.rows.length
        });
    } catch (error) {
        console.error("Error fetching entries:", error);
        res.status(500).json({ error: "Server error fetching entries" });
    }
});

// Get single entry by ID
app.get("/api/entries/:id", authenticateToken, async (req, res) => {
    try {
        const entryId = req.params.id;
        const userId = req.user.userId;

        const result = await pool.query(
            `SELECT 
                te.id, te.content, te.timestamp, te.created_at,
                ea.emotion, ea.confidence,
                ea.joy_score, ea.sadness_score, ea.anger_score, 
                ea.fear_score, ea.surprise_score, ea.neutral_score
            FROM text_entries te
            LEFT JOIN emotion_analysis ea ON te.id = ea.entry_id
            WHERE te.id = $1 AND te.user_id = $2`,
            [entryId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Entry not found" });
        }

        res.json({ entry: result.rows[0] });
    } catch (error) {
        console.error("Error fetching entry:", error);
        res.status(500).json({ error: "Server error fetching entry" });
    }
});

// ==================== ANALYTICS ROUTES ====================

// Get emotion timeline data
app.get("/api/analytics/timeline", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const days = parseInt(req.query.days) || 30;

        const result = await pool.query(
            `SELECT 
                DATE(te.timestamp) as date,
                AVG(ea.joy_score) as avg_joy,
                AVG(ea.sadness_score) as avg_sadness,
                AVG(ea.anger_score) as avg_anger,
                AVG(ea.fear_score) as avg_fear,
                AVG(ea.surprise_score) as avg_surprise,
                AVG(ea.neutral_score) as avg_neutral,
                COUNT(*) as entry_count
            FROM text_entries te
            JOIN emotion_analysis ea ON te.id = ea.entry_id
            WHERE te.user_id = $1 
            AND te.timestamp >= NOW() - INTERVAL '${days} days'
            GROUP BY DATE(te.timestamp)
            ORDER BY date ASC`,
            [userId]
        );

        res.json({ timeline: result.rows });
    } catch (error) {
        console.error("Error fetching timeline:", error);
        res.status(500).json({ error: "Server error fetching timeline" });
    }
});

// Get emotion statistics
app.get("/api/analytics/stats", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        // Get overall stats
        const statsResult = await pool.query(
            `SELECT 
                COUNT(*) as total_entries,
                AVG(ea.joy_score) as avg_joy,
                AVG(ea.sadness_score) as avg_sadness,
                AVG(ea.anger_score) as avg_anger,
                AVG(ea.fear_score) as avg_fear,
                AVG(ea.surprise_score) as avg_surprise,
                AVG(ea.neutral_score) as avg_neutral
            FROM text_entries te
            JOIN emotion_analysis ea ON te.id = ea.entry_id
            WHERE te.user_id = $1`,
            [userId]
        );

        // Get dominant emotion
        const dominantResult = await pool.query(
            `SELECT emotion, COUNT(*) as count
            FROM text_entries te
            JOIN emotion_analysis ea ON te.id = ea.entry_id
            WHERE te.user_id = $1
            GROUP BY emotion
            ORDER BY count DESC
            LIMIT 1`,
            [userId]
        );

        // Get emotion distribution
        const distributionResult = await pool.query(
            `SELECT emotion, COUNT(*) as count
            FROM text_entries te
            JOIN emotion_analysis ea ON te.id = ea.entry_id
            WHERE te.user_id = $1
            GROUP BY emotion
            ORDER BY count DESC`,
            [userId]
        );

        res.json({
            stats: statsResult.rows[0],
            dominant_emotion: dominantResult.rows[0] || null,
            distribution: distributionResult.rows
        });
    } catch (error) {
        console.error("Error fetching stats:", error);
        res.status(500).json({ error: "Server error fetching statistics" });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
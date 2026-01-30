# Emotional Drift Monitoring - Backend

Backend API for the Emotional Drift Monitoring web application. Tracks user emotions over time using AI-powered text analysis.

## Features

- 🔐 User authentication (JWT-based)
- 📝 Text entry submission
- 🧠 AI emotion detection (Hugging Face)
- 📊 Emotion analytics and timeline
- 💾 PostgreSQL database

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Database

Create a free PostgreSQL database on [Neon](https://neon.tech):

1. Sign up at https://neon.tech
2. Create a new project
3. Copy the connection string
4. Run the schema:
   ```bash
   # Connect to your database and run schema.sql
   psql <your_connection_string> -f schema.sql
   ```

### 3. Get Hugging Face API Key

1. Sign up at https://huggingface.co
2. Go to Settings → Access Tokens
3. Create a new token (read access is sufficient)
4. Copy the token

### 4. Configure Environment Variables

Edit `.env` file:

```env
DATABASE_URL=your_neon_postgresql_connection_string
JWT_SECRET=your-random-secret-key
HUGGINGFACE_API_KEY=your_huggingface_token
PORT=3000
NODE_ENV=development
```

### 5. Run Development Server

```bash
npm run dev
```

Server will start on http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Text Entries
- `POST /api/entries` - Submit new text entry (protected)
- `GET /api/entries` - Get all user entries (protected)
- `GET /api/entries/:id` - Get single entry (protected)

### Analytics
- `GET /api/analytics/timeline` - Get emotion timeline data (protected)
- `GET /api/analytics/stats` - Get emotion statistics (protected)

## Emotion Categories

The AI detects 6 emotions:
- 😊 Joy
- 😢 Sadness
- 😠 Anger
- 😨 Fear
- 😲 Surprise
- 😐 Neutral

## Tech Stack

- Express.js - Web framework
- PostgreSQL - Database
- Hugging Face - AI emotion detection
- JWT - Authentication
- bcrypt - Password hashing

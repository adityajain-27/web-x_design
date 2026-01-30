import dotenv from 'dotenv';
dotenv.config();

const HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/j-hartmann/emotion-english-distilroberta-base";
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

/**
 * Analyze emotion from text using Hugging Face API
 * @param {string} text - The text to analyze
 * @returns {Promise<Object>} - Emotion analysis results
 */
export async function analyzeEmotion(text) {
    try {
        if (!text || text.trim().length === 0) {
            throw new Error('Text cannot be empty');
        }

        // Call Hugging Face API
        const response = await fetch(HUGGINGFACE_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ inputs: text })
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('Hugging Face API error:', error);

            // If model is loading, return neutral emotion
            if (response.status === 503) {
                console.log('Model is loading, returning neutral emotion');
                return createNeutralResponse();
            }

            throw new Error(`API request failed: ${response.status}`);
        }

        const result = await response.json();

        // Parse the response - Hugging Face returns array of label-score pairs
        const emotions = Array.isArray(result[0]) ? result[0] : result;

        // Initialize emotion scores
        const emotionScores = {
            joy: 0,
            sadness: 0,
            anger: 0,
            fear: 0,
            surprise: 0,
            neutral: 0
        };

        // Map API labels to our emotion categories
        emotions.forEach(item => {
            const label = item.label.toLowerCase();
            const score = item.score;

            if (label.includes('joy') || label.includes('happy')) {
                emotionScores.joy = score;
            } else if (label.includes('sad')) {
                emotionScores.sadness = score;
            } else if (label.includes('anger') || label.includes('angry')) {
                emotionScores.anger = score;
            } else if (label.includes('fear')) {
                emotionScores.fear = score;
            } else if (label.includes('surprise')) {
                emotionScores.surprise = score;
            } else if (label.includes('neutral')) {
                emotionScores.neutral = score;
            }
        });

        // Find dominant emotion
        const dominantEmotion = Object.entries(emotionScores).reduce((max, [emotion, score]) =>
            score > max.score ? { emotion, score } : max
            , { emotion: 'neutral', score: 0 });

        return {
            emotion: dominantEmotion.emotion,
            confidence: dominantEmotion.score,
            joy_score: emotionScores.joy,
            sadness_score: emotionScores.sadness,
            anger_score: emotionScores.anger,
            fear_score: emotionScores.fear,
            surprise_score: emotionScores.surprise,
            neutral_score: emotionScores.neutral
        };

    } catch (error) {
        console.error('Error analyzing emotion:', error);
        // Return neutral emotion as fallback
        return createNeutralResponse();
    }
}

/**
 * Create a neutral emotion response (fallback)
 */
function createNeutralResponse() {
    return {
        emotion: 'neutral',
        confidence: 1.0,
        joy_score: 0,
        sadness_score: 0,
        anger_score: 0,
        fear_score: 0,
        surprise_score: 0,
        neutral_score: 1.0
    };
}

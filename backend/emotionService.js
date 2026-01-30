import dotenv from 'dotenv';
dotenv.config();

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

/**
 * Analyze emotion from text using Hugging Face Inference API
 * Uses the new @huggingface/inference library
 */
export async function analyzeEmotion(text) {
    try {
        if (!text || text.trim().length === 0) {
            throw new Error('Text cannot be empty');
        }

        console.log('🔍 Analyzing emotion for text:', text.substring(0, 50) + '...');

        // Use Hugging Face Inference API (new endpoint)
        const response = await fetch(
            "https://router.huggingface.co/hf-inference/models/SamLowe/roberta-base-go_emotions",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${HUGGINGFACE_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    inputs: text,
                    options: { wait_for_model: true }
                }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Hugging Face API error:', response.status, errorText);

            // Fallback to keyword-based detection
            console.log('⚠️  Falling back to keyword-based detection');
            return await keywordBasedEmotion(text);
        }

        const result = await response.json();
        console.log('� API Response:', JSON.stringify(result, null, 2));

        // Map the emotions from the model to our 6 categories
        const emotionScores = {
            joy: 0,
            sadness: 0,
            anger: 0,
            fear: 0,
            surprise: 0,
            neutral: 0
        };

        // The model returns multiple emotions, we need to map them
        const emotions = result[0] || result;

        for (const item of emotions) {
            const label = item.label.toLowerCase();
            const score = item.score;

            // Map model emotions to our categories
            if (label.includes('joy') || label.includes('admiration') || label.includes('amusement') || label.includes('approval') || label.includes('excitement') || label.includes('gratitude') || label.includes('love') || label.includes('optimism') || label.includes('pride') || label.includes('relief')) {
                emotionScores.joy += score;
            } else if (label.includes('sadness') || label.includes('disappointment') || label.includes('grief') || label.includes('remorse')) {
                emotionScores.sadness += score;
            } else if (label.includes('anger') || label.includes('annoyance') || label.includes('disapproval')) {
                emotionScores.anger += score;
            } else if (label.includes('fear') || label.includes('nervousness')) {
                emotionScores.fear += score;
            } else if (label.includes('surprise') || label.includes('realization') || label.includes('confusion') || label.includes('curiosity')) {
                emotionScores.surprise += score;
            } else if (label.includes('neutral') || label.includes('desire') || label.includes('caring')) {
                emotionScores.neutral += score;
            }
        }

        // Normalize scores
        const total = Object.values(emotionScores).reduce((sum, val) => sum + val, 0);
        if (total > 0) {
            for (const key in emotionScores) {
                emotionScores[key] = emotionScores[key] / total;
            }
        }

        // Find dominant emotion
        const dominantEmotion = Object.entries(emotionScores).reduce((max, [emotion, score]) =>
            score > max.score ? { emotion, score } : max
            , { emotion: 'neutral', score: 0 });

        console.log(`✅ Detected emotion: ${dominantEmotion.emotion} (${(dominantEmotion.score * 100).toFixed(1)}%)`);

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
        console.error('❌ Error analyzing emotion:', error);
        // Fallback to keyword-based
        return await keywordBasedEmotion(text);
    }
}

/**
 * Fallback keyword-based emotion detection
 */
async function keywordBasedEmotion(text) {
    const lowerText = text.toLowerCase();
    const emotionScores = {
        joy: 0,
        sadness: 0,
        anger: 0,
        fear: 0,
        surprise: 0,
        neutral: 0
    };

    const keywords = {
        joy: ['happy', 'joy', 'excited', 'great', 'wonderful', 'amazing', 'love', 'excellent', 'good'],
        sadness: ['sad', 'unhappy', 'depressed', 'down', 'lonely', 'disappointed'],
        anger: ['angry', 'mad', 'furious', 'annoyed', 'frustrated', 'hate'],
        fear: ['afraid', 'scared', 'fear', 'worried', 'anxious', 'nervous'],
        surprise: ['surprised', 'shocked', 'amazed', 'wow', 'unexpected'],
        neutral: ['okay', 'fine', 'alright', 'normal']
    };

    for (const [emotion, words] of Object.entries(keywords)) {
        for (const word of words) {
            if (lowerText.includes(word)) {
                emotionScores[emotion] += 1;
            }
        }
    }

    const total = Object.values(emotionScores).reduce((sum, val) => sum + val, 0);
    if (total === 0) {
        emotionScores.neutral = 1.0;
    } else {
        for (const key in emotionScores) {
            emotionScores[key] = emotionScores[key] / total;
        }
    }

    const dominantEmotion = Object.entries(emotionScores).reduce((max, [emotion, score]) =>
        score > max.score ? { emotion, score } : max
        , { emotion: 'neutral', score: 0 });

    console.log(`✅ [Keyword] Detected emotion: ${dominantEmotion.emotion} (${(dominantEmotion.score * 100).toFixed(1)}%)`);

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
}

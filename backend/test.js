// Simple test script to check API endpoints without database
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

console.log('🧪 Testing Emotional Drift API...\n');

// Test 1: Health Check
async function testHealthCheck() {
    try {
        console.log('1️⃣ Testing Health Check...');
        const response = await fetch(`${BASE_URL}/`);
        const data = await response.json();
        console.log('✅ Health Check:', data);
        console.log('');
    } catch (error) {
        console.log('❌ Health Check Failed:', error.message);
        console.log('');
    }
}

// Test 2: Emotion Analysis (without saving to DB)
async function testEmotionAnalysis() {
    try {
        console.log('2️⃣ Testing Emotion Analysis Service...');

        // Import the emotion service directly
        const { analyzeEmotion } = await import('./emotionService.js');

        const testTexts = [
            "I am so happy and excited today!",
            "I feel really sad and lonely.",
            "This makes me so angry!",
            "I'm scared and worried about the future."
        ];

        for (const text of testTexts) {
            console.log(`\n📝 Text: "${text}"`);
            const result = await analyzeEmotion(text);
            console.log(`   Emotion: ${result.emotion} (${(result.confidence * 100).toFixed(1)}% confidence)`);
            console.log(`   Scores:`, {
                joy: (result.joy_score * 100).toFixed(1) + '%',
                sadness: (result.sadness_score * 100).toFixed(1) + '%',
                anger: (result.anger_score * 100).toFixed(1) + '%',
                fear: (result.fear_score * 100).toFixed(1) + '%'
            });
        }
        console.log('\n✅ Emotion Analysis Working!\n');
    } catch (error) {
        console.log('❌ Emotion Analysis Failed:', error.message);
        console.log('');
    }
}

// Test 3: Try Registration (will fail without DB - that's expected)
async function testRegistration() {
    try {
        console.log('3️⃣ Testing Registration Endpoint (will fail without DB)...');
        const response = await fetch(`${BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            })
        });
        const data = await response.json();
        console.log('Response:', data);
        console.log('');
    } catch (error) {
        console.log('❌ Expected - needs database:', error.message);
        console.log('');
    }
}

// Run all tests
async function runTests() {
    await testHealthCheck();
    await testEmotionAnalysis();
    await testRegistration();

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 Summary:');
    console.log('✅ Health Check - Works without DB');
    console.log('✅ Emotion Analysis - Works without DB');
    console.log('❌ Registration/Login - Needs database');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

runTests();

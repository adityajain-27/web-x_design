// Quick test for Hugging Face API
import dotenv from 'dotenv';
dotenv.config();

const API_URL = "https://api-inference.huggingface.co/models/j-hartmann/emotion-english-distilroberta-base";
const API_KEY = process.env.HUGGINGFACE_API_KEY;

console.log('Testing Hugging Face API...');
console.log('API Key:', API_KEY ? `${API_KEY.substring(0, 10)}...` : 'MISSING');

async function testAPI() {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ inputs: "I am so happy today!" })
        });

        console.log('Status:', response.status);
        const text = await response.text();
        console.log('Response:', text);

        if (response.ok) {
            const data = JSON.parse(text);
            console.log('✅ API Working!', data);
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testAPI();

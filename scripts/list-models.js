
import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config';

const apiKey = process.env.VITE_GEMINI_API_KEY;

async function list() {
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        // The SDK doesn't have a direct listModels, but we can use fetch
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (e) {
        console.error(e);
    }
}

list();

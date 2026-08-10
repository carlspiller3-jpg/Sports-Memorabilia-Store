
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

async function testConnection() {
    const apiKey = process.env.VITE_GEMINI_API_KEY;

    console.log("\n--- Testing Gemini Connection locally ---");

    if (!apiKey) {
        console.error("❌ ERROR: VITE_GEMINI_API_KEY is not found in .env file.");
        console.log("-> Please verify you created a .env file with the key.");
        return;
    }

    console.log(`✅ Key found (Length: ${apiKey.length} chars)`);

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        console.log("-> Sending test prompt to Google...");
        const result = await model.generateContent("Say 'Hello from Google' if you can hear me.");
        const response = await result.response;
        const text = response.text();

        console.log(`\n🎉 SUCCESS! Response received:`);
        console.log(`"${text}"`);
        console.log("\n-> Your API Key is VALID. If Vercel fails, the issue is Vercel configuration.");

    } catch (error) {
        console.error("\n❌ CONNECTION FAILED:");
        console.error(error.message || error);

        if (error.message?.includes("API_KEY_INVALID")) {
            console.log("\n-> This means the key you pasted is wrong or revoked.");
        }
    }
}

testConnection();

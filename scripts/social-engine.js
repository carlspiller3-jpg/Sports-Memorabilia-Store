import { GoogleGenerativeAI } from "@google/generative-ai";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

const apiKey = process.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
    console.error("❌ ERROR: VITE_GEMINI_API_KEY is missing from environment variables.");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
// Use the stable model identifier to prevent 404s
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

async function generateSocialContent() {
    console.log("🚀 Starting Omnichannel Social Engine...");
    
    // Generate an array of the next 7 days (e.g., "April 28")
    const today = new Date();
    const dates = [];
    for(let i=0; i<7; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() + i);
        dates.push(d.toLocaleDateString('en-GB', { month: 'long', day: 'numeric' }));
    }

    const promptText = `As the lead social media strategist for a premium UK sports memorabilia archive, generate an omnichannel content calendar for the upcoming week (${dates[0]} to ${dates[6]}).

Focus: Premier League Football, Boxing, Formula 1, and global major sporting events.

For EACH of the 7 days, generate exactly TWO posts:
1. An "On This Day" or historical post related to a famous sporting event that happened on that exact date.
2. A "Debate Starter" post designed to drive massive comments and engagement (e.g., "Who was the hardest hitter?", "Greatest midfield trio?").

STRICT WRITING RULES:
- NO ROBOT SPEAK: Do not use words like "specimen", "perpetuity", "testament", "journey", "unparalleled", "iconic", "legendary".
- TONE: Punchy, authoritative, and direct. Like a seasoned sports journalist.
- ACTION: Every text post must end with a natural question to force engagement in the comments.
- INVENTORY RULE (CRITICAL): You are a new brand with a tiny inventory. DO NOT pretend or claim that you have items in stock that relate to the post (e.g. DO NOT say "We just added a signed glove to our archive"). Talk ONLY about the history of the event. 
- HASHTAGS: Include 3-5 highly targeted SEO hashtags at the very end of the text.
- REEL/STORY HOOK: Provide a 1-sentence "Video Hook" for a TikTok/Reel. STRICT COPYRIGHT RULE: The user CANNOT use official match footage (Premier League, Sky Sports, etc. will ban their account). The video hook MUST suggest "Copyright-Safe" B-roll (e.g., "Royalty-free dark stadium background with text-on-screen", "A zoomed-in newspaper clipping from the day", or "You talking directly to camera").

Output the content in clean Markdown format, organized by Day/Date.`;


    try {
        console.log("🧠 Analyzing historical sports data & writing posts...");
        const result = await model.generateContent(promptText);
        const responseText = await result.response.text();

        // Ensure output directory exists
        const outDir = join(process.cwd(), 'business_docs', 'social_content');
        if (!existsSync(outDir)) {
            mkdirSync(outDir, { recursive: true });
        }

        // Save file with today's date
        const fileName = `social_calendar_${today.toISOString().split('T')[0]}.md`;
        const filePath = join(outDir, fileName);
        
        writeFileSync(filePath, responseText, 'utf8');
        
        console.log(`✅ Success! Generated 14 social posts for the week.`);
        console.log(`📄 Saved to: business_docs/social_content/${fileName}`);

    } catch (error) {
        console.error("❌ Failed to generate social content:", error.message);
        process.exit(1);
    }
}

generateSocialContent();

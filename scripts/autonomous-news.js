import { GoogleGenerativeAI } from "@google/generative-ai";
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import dotenv from 'dotenv';
dotenv.config();

// This script is designed to run in a GitHub Action environment
// It scouts for breaking news and generates an autonomous blog post.

async function runPulse() {
    console.log("🚀 Starting Tactical News Pulse...");

    // 0. Pre-Flight Check
    const apiKey = process.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
        console.error("❌ ERROR: VITE_GEMINI_API_KEY is missing from environment variables.");
        process.exit(1);
    } else {
        console.log("✅ Secret Detected (Internal Validation Passed)");
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    // 1. Scout for "Bosh" Moments
    const scoutPrompt = `
        Today is ${new Date().toLocaleDateString()}. 
        Identify the single biggest 'breaking' sports story from the last 24 hours that would interest a high-end memorabilia collector.
        Think: Records broken, sudden retirements, or massive transfers. 
        If nothing 'historic' happened, return 'SKIP'.
        Otherwise, return a 2-sentence summary of the news.
    `;

    try {
        const scoutResult = await model.generateContent(scoutPrompt);
        const newsSummary = scoutResult.response.text().trim();

        if (newsSummary.includes('SKIP')) {
            console.log("📭 No 'Bosh' moments detected today. Standing down.");
            return;
        }

        console.log("🔥 BOSH! News detected:", newsSummary);

        // 2. Generate the Elite Article
        const articlePrompt = `
            Write a professional blog post for a luxury sports memorabilia brand called 'Sports Memorabilia Store' about this news: "${newsSummary}"
            
            STRICT RULES:
            1. LANGUAGE: British English only (colour, realised, centre, football not soccer).
            2. TONE: 'Smart Pub Talk'. Authoritative, direct, expert. No corporate fluff. No 'M+S style' drama.
            3. NO HYPHENS: Do not use hyphenated adjectives (e.g., no 'record-breaking', no 'top-tier'). Use real, flowing sentences.
            4. STRUCTURE: Use <h2> and <h3>. One blunt <strong>Verdict</strong> at the end.
            5. SEO: Provide a meta title (max 60 chars) and meta description (max 160 chars).
            6. BRANDING: Use 'Sports Memorabilia Store' whenever referring to the company.
            
            Return the result in JSON format:
            {
                "title": "...",
                "excerpt": "...",
                "content": "...",
                "seo_title": "...",
                "seo_description": "...",
                "sport": "football" | "basketball" | "golf" | "f1" | "boxing" | "general"
            }
        `;

        const articleResult = await model.generateContent(articlePrompt);
        const text = articleResult.response.text().replace(/```json|```/g, '').trim();
        const articleData = JSON.parse(text);

        // 3. Append to articles.ts
        const filePath = join(process.cwd(), 'src/data/articles.ts');
        let content = readFileSync(filePath, 'utf8');

        // Find the last ID
        const lines = content.split('\n');
        let lastId = 15;
        for (const line of lines) {
            const match = line.match(/id: "(\d+)"/);
            if (match) lastId = Math.max(lastId, parseInt(match[1]));
        }
        const newId = lastId + 1;

        // Map sport to premium Unsplash image
        const sportImages = {
            football: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80",
            basketball: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80",
            golf: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80",
            f1: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80",
            boxing: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80",
            general: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80"
        };
        const detectedSport = (articleData.sport || "general").toLowerCase();
        const imageUrl = sportImages[detectedSport] || sportImages.general;

        const newArticleBlock = `  {
    id: "${newId}",
    title: "${articleData.title}",
    slug: "${articleData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '')}",
    date: "${new Date().toISOString().split('T')[0]}",
    author: "Tactical Engine",
    category: "News",
    excerpt: "${articleData.excerpt}",
    imageUrl: "${imageUrl}",
    seo_title: "${articleData.seo_title}",
    seo_description: "${articleData.seo_description}",
    seo_keywords: ["breaking news", "sports memorabilia", "investment"],
    content: \`${articleData.content}\`
  },`;

        content = content.replace('export const articles: BlogPost[] = [', `export const articles: BlogPost[] = [\n${newArticleBlock}`);
        writeFileSync(filePath, content);

        console.log(`✅ Tactical Article #${newId} Posted: ${articleData.title}`);

    } catch (error) {
        console.error("❌ THE TACTICAL ENGINE CRASHED: Connection failed or parsing error (Sanitized)");
        process.exit(1);
    }
}

runPulse();

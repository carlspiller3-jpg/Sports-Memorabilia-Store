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
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 1. Scout for Moments
    const scoutPrompt = `
        Today is ${new Date().toLocaleDateString()}. 
        Identify the single biggest real world sports story or major historical anniversary from international sports (football, motorsport, boxing, rugby, tennis, golf) that would interest a high end sports memorabilia collector.
        Focus on real sports history, major achievements, records, or cup final milestones. 
        Do not output meta commentary about AI knowledge limits, databases, or cutoff dates.
        If nothing notable is found, return 'SKIP'.
        Otherwise, return a 2 sentence summary of the news or historical milestone.
    `;

    try {
        const scoutResult = await model.generateContent(scoutPrompt);
        const newsSummary = scoutResult.response.text().trim();

        if (newsSummary.includes('SKIP')) {
            console.log("📭 No major moments detected today. Standing down.");
            return;
        }

        console.log("🔥 News / Milestone detected:", newsSummary);

        // 2. Generate the Elite Article
        const articlePrompt = `
            Write a professional blog post for a luxury sports memorabilia brand called 'Sports Memorabilia Store' about this topic: "${newsSummary}"
            
            MANDATORY SYSTEM DIRECTIVES (MUST FOLLOW EXACTLY):
            1. NO AMPERSANDS ('&'): Never use '&' anywhere. Always write 'and' in full.
            2. ZERO HYPHENS IN PROSE AND HEADINGS: Do not use hyphens anywhere in text, titles, headings, excerpts, or meta strings. Write out words separately (e.g. 'match worn', 'player spec', 'high end', 'top tier', 'record breaking', 'long term', 'first class').
            3. ZERO M&S STYLE DRAMATIC CONTRAST: Do not use dramatic contrast copy like "It's not X, IT'S Y!". Write direct UK executive English.
            4. ZERO AI BUZZWORDS: Banned terms: unlocks, seamlessly, vault, engine, delve, game changer, testament to, leverage, robust, tapestry, beacon, cutting edge, synergy, paradigm shift, revolutionize, unleash, elevate, harness, realm, pivotal, furthermore, moreover.
            5. NO AI META COMMENTS: Never mention AI limits, data cutoffs, computers, databases, or cutoff years.
            6. CURRENCY: Use British Pound Sterling (£) for all monetary values.
            7. LANGUAGE & TONE: British English only (colour, realised, centre, football not soccer). Smart pub talk, commercial UK executive voice.
            8. STRUCTURE: Use <h2> and <h3> tags. End with one strong <strong>Verdict:</strong> statement.
            9. SEO: Provide meta title (max 60 chars) and meta description (max 160 chars) with zero hyphens and zero ampersands.
            
            Return the result as a strict JSON object:
            {
                "title": "...",
                "excerpt": "...",
                "content": "...",
                "seo_title": "...",
                "seo_description": "...",
                "sport": "football" | "basketball" | "golf" | "f1" | "boxing" | "rugby" | "tennis" | "general"
            }
        `;

        const articleResult = await model.generateContent(articlePrompt);
        const text = articleResult.response.text().replace(/```json|```/g, '').trim();
        const articleData = JSON.parse(text);

        // Sanitize strings for strict rules
        articleData.title = (articleData.title || "").replace(/&/g, 'and').replace(/-/g, ' ');
        articleData.excerpt = (articleData.excerpt || "").replace(/&/g, 'and').replace(/-/g, ' ');
        articleData.seo_title = (articleData.seo_title || "").replace(/&/g, 'and').replace(/-/g, ' ');
        articleData.seo_description = (articleData.seo_description || "").replace(/&/g, 'and').replace(/-/g, ' ');
        articleData.content = (articleData.content || "").replace(/&/g, 'and');

        // 3. Append to articles.ts
        const filePath = join(process.cwd(), 'src/data/articles.ts');
        let content = readFileSync(filePath, 'utf8');

        // Find the highest ID
        const lines = content.split('\n');
        let lastId = 0;
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
            rugby: "https://images.unsplash.com/photo-1543165796-5426273eaab3?q=80",
            tennis: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80",
            general: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80"
        };
        const detectedSport = (articleData.sport || "general").toLowerCase();
        const imageUrl = sportImages[detectedSport] || sportImages.general;

        const slug = articleData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');

        const newArticleBlock = `  {
    id: "${newId}",
    title: "${articleData.title}",
    slug: "${slug}",
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
        console.error("❌ THE TACTICAL ENGINE ERROR:", error.message || error);
        process.exit(1);
    }
}

runPulse();

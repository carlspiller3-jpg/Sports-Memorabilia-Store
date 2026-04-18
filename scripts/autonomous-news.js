
import { GoogleGenerativeAI } from "@google/generative-ai";
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// This script is designed to run in a GitHub Action environment
// It scouts for breaking news and generates an autonomous blog post.

async function runPulse() {
    const apiKey = process.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
        console.error("No API Key found. Skipping pulse.");
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    console.log("🚀 Starting Tactical News Pulse...");

    // 1. Scout for "Bosh" Moments (Simulated News Search via Prompting for now, 
    // in a full env we would use a Search API here)
    const scoutPrompt = `
        Today is ${new Date().toLocaleDateString()}. 
        Identify the single biggest 'breaking' sports story from the last 24 hours that would interest a high-end memorabilia collector.
        Think: Records broken, sudden retirements, or massive transfers. 
        If nothing 'historic' happened, return 'SKIP'.
        Otherwise, return a 2-sentence summary of the news.
    `;

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
            "seo_description": "..."
        }
    `;

    const articleResult = await model.generateContent(articlePrompt);
    let articleData;
    try {
        const text = articleResult.response.text().replace(/```json|```/g, '').trim();
        articleData = JSON.parse(text);
    } catch (e) {
        console.error("Failed to parse AI response. Stand down.");
        return;
    }

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

    const newArticleBlock = `  {
    id: "${newId}",
    title: "${articleData.title}",
    slug: "${articleData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '')}",
    date: "${new Date().toISOString().split('T')[0]}",
    author: "Tactical Engine",
    category: "News",
    excerpt: "${articleData.excerpt}",
    imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80",
    seo_title: "${articleData.seo_title}",
    seo_description: "${articleData.seo_description}",
    seo_keywords: ["breaking news", "sports memorabilia", "investment"],
    content: \`${articleData.content}\`
  },
];`;

    content = content.replace('];', newArticleBlock);
    writeFileSync(filePath, content);

    console.log(`✅ Tactical Article #${newId} Posted: ${articleData.title}`);
}

runPulse();

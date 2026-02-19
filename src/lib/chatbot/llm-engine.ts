
import { GoogleGenerativeAI } from "@google/generative-ai";
import { fetchAllProducts } from "@/lib/shopify";
import { PLACEHOLDER_PRODUCTS } from "@/lib/placeholder-data";
import type { Product } from "@/types/schema";

// Initialize Gemini
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Helper to format product list for the LLM
function formatProductsForContext(products: Product[]): string {
    return products.map(p => {
        const price = p.variants?.[0]?.price || 0;
        return `- ${p.title} (Type: ${p.product_type}, Price: £${price}, Tags: ${p.tags?.join(", ")})`;
    }).join("\n");
}

export class LLMEngine {
    private history: { role: "user" | "model", parts: string }[] = [];

    async generateResponse(userMessage: string): Promise<{ message: string, quickReplies?: string[] } | null> {
        if (!API_KEY) {
            console.warn("Gemini API Key missing");
            return { message: "I'm having trouble connecting to my brain. Please try again later." };
        }

        try {
            // Get current inventory (Live or Placeholder)
            let products: Product[] = [];
            if (import.meta.env.VITE_USE_LIVE_SHOPIFY === 'true') {
                products = await fetchAllProducts();
            } else {
                products = PLACEHOLDER_PRODUCTS;
            }

            const inventoryContext = formatProductsForContext(products);

            // System Prompt with Inventory
            const systemPrompt = `
You are the AI Sales Assistant for 'Sports Memorabilia Store', a premium UK-based retailer of authentic signed sports collectibles.
Your tone is professional, helpful, and British. You use British spelling (colour, honour).

**Your Goal:** Help customers find items, explain authenticity (we use NFC technology for lifetime guarantee), and close sales.

**Current Inventory:**
${inventoryContext}

**Rules:**
1. ONLY recommend items from the 'Current Inventory' list above. Do not invent products.
2. If the user asks for something not in stock, apologize and ask if they'd like to join the waitlist.
3. Keep responses concise (under 3 sentences where possible).
4. If a user asks about price, quote the exact price from the list.
5. If a user asks "Who is..." about a player, give a very brief 1-sentence context (e.g., "Legendary Liverpool Captain").
6. If the user seems ready to buy, encourage them to "add to cart".

**User Query:** ${userMessage}
`;

            const result = await model.generateContent(systemPrompt);
            const response = result.response;
            const text = response.text();

            return {
                message: text,
                // Simple heuristic for quick replies based on text
                quickReplies: text.includes('waitlist') ? ['Join Waitlist', 'Browse All'] : ['View Collection', 'Search Item']
            };

        } catch (error) {
            console.error("LLM Error:", error);
            return null;
        }
    }
}

export const llmEngine = new LLMEngine();

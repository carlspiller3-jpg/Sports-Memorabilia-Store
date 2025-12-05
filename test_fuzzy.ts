
import { extractEntities, fuzzyMatch } from './src/lib/chatbot/utils';
import { ATHLETE_DB } from './src/lib/chatbot/knowledge';

// Mock dependencies if needed, but here we just import directly
// We need to make sure ts-node can run this. 
// Since we have imports from './knowledge' which might have other imports, it might be tricky.
// But knowledge.ts seems self-contained.

const input = "Do you have Mesi?";
console.log(`Input: "${input}"`);

const entities = extractEntities(input);
console.log("Extracted entities:", entities.athletes.map(a => a.name));

const word = "mesi?";
const target = "messi";
const match = fuzzyMatch(word, target);
console.log(`Fuzzy match '${word}' vs '${target}': ${match}`);

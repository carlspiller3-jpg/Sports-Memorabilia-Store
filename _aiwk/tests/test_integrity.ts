
import { PLACEHOLDER_PRODUCTS } from '../../src/lib/placeholder-data';
import { ATHLETE_DB } from '../../src/lib/chatbot/knowledge';

interface IntegrityReport {
    totalProducts: number;
    matchedAthletes: number;
    missingTags: number;
    eraTagsFound: number;
    errors: string[];
}

async function verifyIntegrity() {
    console.log("🔍 Verifying Data Integrity for Shopify Integration...");
    
    const report: IntegrityReport = {
        totalProducts: PLACEHOLDER_PRODUCTS.length,
        matchedAthletes: 0,
        missingTags: 0,
        eraTagsFound: 0,
        errors: []
    };

    const athletes = Object.values(ATHLETE_DB);
    const eraKeywords = ['Legend', 'Modern', '90s', '2000s', '2010s', '2020s'];

    for (const product of PLACEHOLDER_PRODUCTS) {
        const title = product.title;
        const tags = product.tags || [];

        // 1. Check for Athlete Match
        let matchFound = false;
        for (const athlete of athletes) {
            // Check if athlete name is in tags
            if (tags.some(t => t.toLowerCase() === athlete.name.toLowerCase() || athlete.aliases.some(a => t.toLowerCase() === a.toLowerCase()))) {
                matchFound = true;
                break;
            }
            // Check title as fallback (though tags are preferred)
            if (title.toLowerCase().includes(athlete.name.toLowerCase())) {
                matchFound = true;
                break;
            }
        }

        if (matchFound) {
            report.matchedAthletes++;
        } else {
            // Some items might be generic? No, all are signed.
            report.errors.push(`❌ Athlete unmatched: "${title}" (Tags: ${tags.join(', ')})`);
        }

        // 2. Check for Era Tags (New Schema)
        const hasEra = tags.some(t => eraKeywords.includes(t));
        if (hasEra) {
            report.eraTagsFound++;
        }
    }

    console.log("\n📊 Verification Results:");
    console.log(`Total Products: ${report.totalProducts}`);
    console.log(`Matched Athletes: ${report.matchedAthletes}`);
    console.log(`Products with Era Tags: ${report.eraTagsFound}`);
    
    if (report.errors.length > 0) {
        console.log("\n⚠️ Issues Found:");
        report.errors.slice(0, 5).forEach(e => console.log(e));
        if (report.errors.length > 5) console.log(`...and ${report.errors.length - 5} more.`);
    }

    if (report.matchedAthletes === report.totalProducts) {
        console.log("\n✅ SUCCESS: All products map to known athletes.");
    } else {
        console.log("\n❌ FAILURE: Coverage gap detected.");
    }
}

verifyIntegrity();

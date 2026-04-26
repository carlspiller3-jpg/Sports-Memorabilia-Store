
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// Config
const DOMAIN = 'https://thesportsmemorabiliastore.com';
const ARTICLES_PATH = join(process.cwd(), 'src/data/articles.ts');
const SITEMAP_PATH = join(process.cwd(), 'public/sitemap.xml');

async function generateSitemap() {
    console.log("🛠️ Generating Sitemap...");

    // 1. Read Articles
    const articlesContent = readFileSync(ARTICLES_PATH, 'utf8');
    const slugs = [];
    
    // Simple regex to extract slugs from the articles file
    const slugRegex = /slug: "([^"]+)"/g;
    let match;
    while ((match = slugRegex.exec(articlesContent)) !== null) {
        slugs.push(match[1]);
    }

    console.log(`📦 Found ${slugs.length} articles`);

    // 2. Build XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Core Pages -->
  <url><loc>${DOMAIN}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>${DOMAIN}/shop</loc><changefreq>daily</changefreq><priority>0.9</priority></url>
  <url><loc>${DOMAIN}/verify</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>${DOMAIN}/about</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>${DOMAIN}/blog</loc><changefreq>daily</changefreq><priority>0.8</priority></url>
  <url><loc>${DOMAIN}/collections</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>

  <!-- Dynamic Blog Articles -->
`;

    slugs.forEach(slug => {
        xml += `  <url><loc>${DOMAIN}/blog/${slug}</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>\n`;
    });

    xml += `</urlset>`;

    // 3. Write File
    writeFileSync(SITEMAP_PATH, xml);
    console.log("✅ Sitemap.xml generated successfully at /public/sitemap.xml");
}

generateSitemap().catch(err => {
    console.error("❌ Sitemap Generation Failed:", err);
    process.exit(1);
});

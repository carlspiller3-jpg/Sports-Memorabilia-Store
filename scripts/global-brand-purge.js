
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

function walk(dir) {
    let results = [];
    const list = readdirSync(dir);
    list.forEach(file => {
        file = join(dir, file);
        const stat = statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('./src');
console.log(`Checking ${files.length} files...`);

files.forEach(file => {
    let content = readFileSync(file, 'utf8');
    // Regex: Match 'SportsSigned' but NOT if preceded by 'http', 'https', or '@'
    const newContent = content.replace(/(?<!https?:\/\/|@)SportsSigned/g, 'Sports Memorabilia Store');
    if (content !== newContent) {
        writeFileSync(file, newContent);
        console.log(`✅ Updated: ${file}`);
    }
});

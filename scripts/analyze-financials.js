
import XLSX from 'xlsx';
import { join } from 'path';

const desktopPath = 'C:/Users/carls/OneDrive/Desktop/';
const fileName = 'Sports Memorabilia Store Financials.xlsx';
const filePath = join(desktopPath, fileName);

function analyze() {
    console.log("🔍 Auditing spreadsheet structure...");
    const wb = XLSX.readFile(filePath);
    wb.SheetNames.forEach(name => {
        console.log(`--- SHEET: ${name} ---`);
        const ws = wb.Sheets[name];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
        console.log(JSON.stringify(data.slice(0, 10), null, 2)); // Preview first 10 rows
    });
}

analyze();

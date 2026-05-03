import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generatePDF() {
    console.log("Launching browser...");
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    const fileUrl = 'file:///' + path.join(__dirname, 'public', 'products', 'catalogue-pdf.html').replace(/\\/g, '/');
    console.log("Navigating to: " + fileUrl);
    
    await page.goto(fileUrl, { waitUntil: 'networkidle0' });
    
    // Create the PDF in public/products/ Product_Guide.pdf
    const pdfPath = path.join(__dirname, 'public', 'products', 'Product_Guide.pdf');
    console.log("Saving PDF to: " + pdfPath);
    
    await page.pdf({
        path: pdfPath,
        format: 'A4',
        printBackground: true,
        margin: { top: '0', right: '0', bottom: '0', left: '0' }
    });
    
    await browser.close();
    console.log("PDF generation complete!");
}

generatePDF().catch(err => {
    console.error(err);
    process.exit(1);
});

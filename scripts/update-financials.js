
import XLSX from 'xlsx';
import { join } from 'path';

const desktopPath = 'C:/Users/carls/OneDrive/Desktop/';
const fileName = 'Sports Memorabilia Store Financials.xlsx';
const filePath = join(desktopPath, fileName);

function updateAllTabs() {
    console.log("🔄 Starting Global Spreadsheet Realignment...");
    const wb = XLSX.readFile(filePath);

    // 1. Update Start-up Costs
    const startUpRows = [
        ["Category", "Item", "Cost (£)", "Notes"],
        ["Capital Expenditure", "Rangers Partnership Rights (Upfront)", 60000, "Initial payment for license"],
        ["Capital Expenditure", "Rangers Initial Stock Procurement", 73300, "First batch of Rangers exclusive inventory"],
        ["Capital Expenditure", "Office/Storage Fit-out", 10000, "High-end storage and working area kitting out"],
        ["Liability", "Bad Debt Repayment (Portion 1)", 52302, "Initial settlement of previous business debt"],
        ["Personal", "Initial Director Draw", 20000, "Immediate personal liquidity draw"],
        ["Pre-Start-up", "Legal & Brand Assets", 2000, "Logo, contracts, and trademarking"],
        ["TOTAL", "Total Day 1 Outflow", 217602]
    ];
    wb.Sheets["Start-up Costs"] = XLSX.utils.aoa_to_sheet(startUpRows);

    // 2. Update Operating Expenditure
    const opExRows = [
        ["Expense Item", "Monthly Cost (£)", "Annual Cost (£)", "Notes"],
        ["Marketing (Agency Fees)", 5000, 60000, "Full service agency management"],
        ["Marketing (Paid Ad Spend)", 7000, 84000, "Required visibility for £1.1M turnover"],
        ["Salaries (Family Total)", 5000, 60000, "User + Wife baseline draw (Salary + Divs)"],
        ["Warehouse / Storage Rent", 750, 9000, "Operating facility and secure storage"],
        ["Software & Tech Subscriptions", 500, 6000, "Shopify Plus, CRM, authenticity portal"],
        ["Insurance & Legal", 300, 3600, "Memorabilia specialist cover"],
        ["TOTAL", 18550, 222600]
    ];
    wb.Sheets["Operating Expenditure"] = XLSX.utils.aoa_to_sheet(opExRows);

    // 3. Update COGS (Cost of Goods Sold)
    const cogsRows = [
        ["Item Type", "Unit Purchase (£)", "Framing/Pkg (£)", "Total COGS (£)", "Avg RRP (£)", "Margin (%)"],
        ["Rangers Framed Shirt", 120, 45, 165, 349, 0.52],
        ["Rangers Signed Photo", 20, 25, 45, 129, 0.65],
        ["Standard Shop Framed Shirt", 80, 40, 120, 299, 0.60],
        ["High End Memorabilia (Blue Chip)", 2000, 100, 2100, 3999, 0.47],
        ["SUMMARY", "Year 1 COGS Target (£)", 660000, "Based on 40% target gross margin on £1.1M"]
    ];
    wb.Sheets["Cost of Goods Sold"] = XLSX.utils.aoa_to_sheet(cogsRows);

    // 4. Update Year 1 Monthly (Scalability)
    // Build the Forecast rows
    const months = ['Metric', 'Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6', 'Month 7', 'Month 8', 'Month 9', 'Month 10', 'Month 11', 'Month 12', 'YEAR 1 TOTAL'];
    const rangersRevenue = [50000, 100000, 120000, 100000, 100000, 80000, 25000, 25000, 0, 0, 0, 0];
    const shopRevenue = [10000, 20000, 30000, 40000, 45000, 50000, 55000, 60000, 60000, 60000, 70000, 0];
    const forecastRows = [months];
    
    let cashBalance = 175000;
    let savingsBalance = 0;
    const cashInRow = ['CASH IN: Gross Revenue'];
    const taxRow = ['TAX RESERVE (1/3)'];
    const rightsRow = ['OUT: Rangers Rights'];
    const rStockRow = ['OUT: Rangers Stock'];
    const gStockRow = ['OUT: Gen Stock (1/3 Bal)'];
    const salaryRow = ['OUT: Salaries/Divs'];
    const debtRow = ['OUT: Debt Repayment'];
    const closingRow = ['CLOSING BANK BALANCE'];

    let totRev = 0, totRights = 0, totStock = 0, totSal = 0, totDebt = 0;
    let lastBal = cashBalance;

    for (let i = 0; i < 12; i++) {
        const rev = (rangersRevenue[i] || 0) + (shopRevenue[i] || 0);
        totRev += rev;
        cashInRow.push(rev);
        
        const mTax = rev / 3;
        taxRow.push(Math.round(mTax));
        
        let mOut = 0;
        let mRights = (i===0?60000 : (i===2?30000 : (i===5?30000 : 0)));
        rightsRow.push(mRights); mOut += mRights; totRights += mRights;
        
        let mRStock = (i<3?24433 : 0);
        rStockRow.push(mRStock); mOut += mRStock; totStock += mRStock;

        let mGStock = (i>0?Math.round(lastBal/3) : 0);
        gStockRow.push(mGStock); mOut += mGStock; totStock += mGStock;

        let mSal = (i===0?25000 : 5000);
        salaryRow.push(mSal); mOut += mSal; totSal += mSal;

        let mDebt = (i===0?52302 : (i===6?62999 : 0));
        debtRow.push(mDebt); mOut += mDebt; totDebt += mDebt;

        mOut += 18550; // Total Ops from OpEx sheet

        cashBalance = (i===0?175000 : lastBal) + (rev - mTax) - mOut;
        closingRow.push(Math.round(cashBalance));
        lastBal = cashBalance;
    }
    // Totals
    cashInRow.push(totRev); taxRow.push(Math.round(totRev/3)); rightsRow.push(totRights); rStockRow.push(Math.round(totStock)); gStockRow.push("-"); salaryRow.push(totSal); debtRow.push(totDebt); closingRow.push(Math.round(lastBal));

    forecastRows.push(cashInRow, taxRow, rightsRow, rStockRow, gStockRow, salaryRow, debtRow, closingRow);
    wb.Sheets["Year 1 Monthly (Scalability)"] = XLSX.utils.aoa_to_sheet(forecastRows);

    // 5. Update Projections (5 Years)
    const projRows = [
        ["Metric", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5"],
        ["Gross Turnover", 1100000, 1500000, 2200000, 3000000, 4200000],
        ["Cost of Sales (40%)", 660000, 900000, 1320000, 1800000, 2520000],
        ["Operating Profit", 217400, 350000, 580000, 850000, 1200000],
        ["Net Profit (After Tax)", 144933, 233333, 386667, 566667, 800000]
    ];
    wb.Sheets["Projections (5 Years)"] = XLSX.utils.aoa_to_sheet(projRows);

    // Write back
    XLSX.writeFile(wb, filePath);
    console.log("✅ GLOBAL REALIGNMENT COMPLETE. Every tab is now synchronized.");
}

updateAllTabs();

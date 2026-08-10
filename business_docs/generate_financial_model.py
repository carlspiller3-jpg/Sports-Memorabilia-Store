
import pandas as pd
import os

# Define the file path
file_path = "The_Sports_Memorabilia_Store_Financial_Model.xlsx"

# 1. Start-up Costs Data
startup_data = {
    'Category': ['Capital Expenditure (CapEx)', 'Capital Expenditure (CapEx)', 'Capital Expenditure (CapEx)', 
                 'Pre-Start-up Expenses', 'Pre-Start-up Expenses', 'Pre-Start-up Expenses', 'Pre-Start-up Expenses'],
    'Item': ['Initial Inventory (Hero Items)', 'Office/Warehouse Equipment', 'Packaging Tooling/Molds',
             'Web Platform Development (MVP)', 'Brand Identity & Design', 'Legal & Incorporation Fees', 'Initial Marketing (Launch Campaign)'],
    'Cost (£)': [10000, 1500, 500, 3000, 2000, 500, 2500],
    'Notes': ['Stock purchase for launch', 'shelving, packing tables, cameras', 'Custom box dyes', 
              'Custom React/Supabase build', 'Logo, assets, guidelines', 'Companies House, Contracts', 'Social ads & influencer seeding']
}
df_startup = pd.DataFrame(startup_data)
# Add a total row
total_startup = df_startup['Cost (£)'].sum()
df_startup.loc[len(df_startup)] = ['TOTAL', 'Total Start-up Costs', total_startup, '']


# 2. Operating Expenditure (OpEx) Data
opex_data = {
    'Expense Item': ['Marketing (Social Ads)', 'Marketing (Influencer/Content)', 'Software Subscriptions (Hosting, Email, CRM)', 
                     'Insurance (Business & Stock)', 'Accountancy & Legal Retainer', 'Warehouse/Storage Rent', 
                     'Utilities (Internet/Power)', 'Salaries (Founders/Staff)'],
    'Monthly Cost (£)': [2000, 500, 150, 50, 200, 400, 100, 2000],
    'Annual Cost (£)': [24000, 6000, 1800, 600, 2400, 4800, 1200, 24000],
    'Notes': ['Scaled with revenue', 'Content creation budget', 'Supabase, Vercel, Klaviyo', 'Specialist memorabilia cover', 'Year-end accounts', 'Secure storage unit', '', 'Minimal initial draw']
}
df_opex = pd.DataFrame(opex_data)
# Add Depreciation
df_opex.loc[len(df_opex)] = ['Depreciation & Amortization', 83, 1000, 'Estimated annual depreciation']


# 3. Cost of Goods Sold (COGS) Data
# Based on the pitching deck unit economics
cogs_data = {
    'Item Type': ['Framed Shirt', 'Framed Photo', 'Framed Boot'],
    'Raw Item Cost (£)': [40, 10, 50],
    'Frame & Mount (£)': [25, 15, 30],
    'Glass (£)': [5, 3, 5],
    'Packaging (Box, Wrap, Tape) (£)': [12, 8, 15],
    'Signing Fee / Acquisition (£)': [5, 5, 20],
    'Shipping Label (£)': [5, 5, 8],
    'TOTAL COGS (£)': [92, 46, 128],
    'RRP (£)': [299, 129, 349],
    'Margin (%)': ['69%', '64%', '63%']
}
df_cogs = pd.DataFrame(cogs_data)


# 4. Non-Operating Expenditure Data
non_opex_data = {
    'Item': ['Loan Repayments', 'One-off Legal Settlements', 'Investment Rounds Costs'],
    'Annual Cost (£)': [0, 0, 0],
    'Notes': ['If applicable', 'Contingency', 'Fees for raising capital']
}
df_non_opex = pd.DataFrame(non_opex_data)


# 5. Projections (5 Years)
# Using conservative "worst case" figures as requested
projections_data = {
    'Metric': ['Total Orders', 'Average Order Value (AOV)', 'Gross Revenue', 
               'Total COGS (approx 30%)', 'Gross Profit', 
               'Total Operating Expenses (OpEx)', 'Non-Operating Expenses', 
               'EBITDA', 'Net Profit (Before Tax)'],
    'Year 1': [1000, 250, 250000, 75000, 175000, 64800, 0, 110200, 110200],
    'Year 2': [2500, 260, 650000, 195000, 455000, 150000, 0, 305000, 305000],
    'Year 3': [6500, 275, 1787500, 536250, 1251250, 400000, 0, 851250, 851250],
    'Year 4': [10000, 280, 2800000, 840000, 1960000, 600000, 0, 1360000, 1360000],
    'Year 5': [15000, 290, 4350000, 1305000, 3045000, 900000, 0, 2145000, 2145000]
}
df_projections = pd.DataFrame(projections_data)


# Create the Excel Writer using openpyxl
with pd.ExcelWriter(file_path, engine='openpyxl') as writer:
    df_startup.to_excel(writer, sheet_name='Start-up Costs', index=False)
    df_opex.to_excel(writer, sheet_name='Operating Expenditure', index=False)
    df_cogs.to_excel(writer, sheet_name='Cost of Goods Sold', index=False)
    df_non_opex.to_excel(writer, sheet_name='Non-Operating Expenditure', index=False)
    df_projections.to_excel(writer, sheet_name='Projections (5 Years)', index=False)
    
    # Access the workbook to do some basic formatting
    workbook = writer.book
    
    # Format 'Start-up Costs' column widths
    worksheet = writer.sheets['Start-up Costs']
    worksheet.column_dimensions['A'].width = 30
    worksheet.column_dimensions['B'].width = 40
    worksheet.column_dimensions['C'].width = 15
    worksheet.column_dimensions['D'].width = 40

    # Format 'Operating Expenditure' column widths
    worksheet = writer.sheets['Operating Expenditure']
    worksheet.column_dimensions['A'].width = 40
    worksheet.column_dimensions['B'].width = 20
    worksheet.column_dimensions['C'].width = 20
    worksheet.column_dimensions['D'].width = 40

    # Format 'Cost of Goods Sold' column widths
    worksheet = writer.sheets['Cost of Goods Sold']
    worksheet.column_dimensions['A'].width = 25
    worksheet.column_dimensions['B'].width = 20
    worksheet.column_dimensions['C'].width = 20
    # ... set others relatively wide

    # Format 'Projections' column widths
    worksheet = writer.sheets['Projections (5 Years)']
    worksheet.column_dimensions['A'].width = 35
    worksheet.column_dimensions['B'].width = 15
    worksheet.column_dimensions['C'].width = 15
    worksheet.column_dimensions['D'].width = 15
    worksheet.column_dimensions['E'].width = 15
    worksheet.column_dimensions['F'].width = 15

print(f"Financial Model generated successfully at: {os.path.abspath(file_path)}")

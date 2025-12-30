import pandas as pd
import numpy as np
import datetime

# ==========================================
# INPUT ASSUMPTIONS - EDIT THESE VALUES
# ==========================================

# 1. STARTUP COSTS
# ----------------
CAPEX = {
    'Office Equipment': {
        'Laptop / PC': 1200,
        'Monitor & Peripherals': 300,
        'Printer (High Quality for Invoices/Labels)': 250,
        'Desk & Chair': 400,
        'Safe / Secure Storage (Fireproof)': 500,
    },
    'Production Equipment': {
        'Camera & Lighting Rig (Product Photos)': 800,
        'Framing Tools (if doing basic framing)': 200,
    },
    'Intangible Assets': {
        'Website Design & Development': 1500,
        'Trademark Registration': 200,
    }
}

PRE_STARTUP_EXPENSES = {
    'Initial Stock Purchase': 5000,
    'Branding (Logo, Business Cards)': 300,
    'Packaging Supplies (Bulk Buy)': 500,  # Boxes, Bubble wrap, Tape
    'Legal & Accounting Setup': 250,
    'Insurance (Upfront Deposit)': 100,
    'Marketing Launch Budget': 1000,
}

# 2. OPERATING ASSUMPTIONS (PRODUCT MIX & UNIT ECONOMICS)
# -------------------------------------------------------
PRODUCT_CATEGORIES = {
    'Signed Jerseys': {
        'Description': 'Core Product - Framed & Unframed',
        'Sales_Mix_Pct': 0.35, 
        'Avg_Sale_Price': 250.00,
        'COGS_Item_Cost': 100.00,
        'Packaging_Cost': 12.00,
        'Postage_Cost': 15.00,
        'Framing_Cost': 50.00, # Weighted average (some sold unframed)
        'Authentication_Fee': 5.00, 
    },
    'Signed Equipment': {
        'Description': 'Balls, Boots, Gloves',
        'Sales_Mix_Pct': 0.15, 
        'Avg_Sale_Price': 180.00,
        'COGS_Item_Cost': 80.00,
        'Packaging_Cost': 8.00,
        'Postage_Cost': 10.00,
        'Framing_Cost': 25.00, # Display case
        'Authentication_Fee': 5.00,
    },
    'Signed Photos/Prints': {
        'Description': 'Entry Level Gift',
        'Sales_Mix_Pct': 0.10, 
        'Avg_Sale_Price': 45.00,
        'COGS_Item_Cost': 15.00,
        'Packaging_Cost': 2.00,
        'Postage_Cost': 3.50,
        'Framing_Cost': 0.00,
        'Authentication_Fee': 2.00,
    },
    'Authentication Services': {
        'Description': 'Validating 3rd party items',
        'Sales_Mix_Pct': 0.05, 
        'Avg_Sale_Price': 50.00,
        'COGS_Item_Cost': 0.00, # Service
        'Packaging_Cost': 1.00, # Certificate
        'Postage_Cost': 3.50,   # Return post
        'Framing_Cost': 0.00,
        'Authentication_Fee': 0.00,
    },
    'Subscription Membership': {
        'Description': 'VIP Club / Monthly Box',
        'Sales_Mix_Pct': 0.15,
        'Avg_Sale_Price': 50.00, # Monthly fee avg
        'COGS_Item_Cost': 20.00, # Value of items sent
        'Packaging_Cost': 5.00,
        'Postage_Cost': 5.00,
        'Framing_Cost': 0.00,
        'Authentication_Fee': 0.00,
    },
    'Appraisal Services': {
        'Description': 'Valuation of collections',
        'Sales_Mix_Pct': 0.05,
        'Avg_Sale_Price': 100.00,
        'COGS_Item_Cost': 0.00,
        'Packaging_Cost': 0.00,
        'Postage_Cost': 0.00,
        'Framing_Cost': 0.00,
        'Authentication_Fee': 0.00,
    },
    'Custom Framing': {
        'Description': 'Service for customer items',
        'Sales_Mix_Pct': 0.05,
        'Avg_Sale_Price': 150.00,
        'COGS_Item_Cost': 0.00,
        'Packaging_Cost': 10.00,
        'Postage_Cost': 15.00,
        'Framing_Cost': 60.00, # Materials cost
        'Authentication_Fee': 0.00,
    },
    'Corporate Gifting': {
        'Description': 'B2B Bulk Orders',
        'Sales_Mix_Pct': 0.10,
        'Avg_Sale_Price': 1000.00,
        'COGS_Item_Cost': 600.00,
        'Packaging_Cost': 50.00,
        'Postage_Cost': 50.00,
        'Framing_Cost': 100.00,
        'Authentication_Fee': 20.00,
    }
}

# 3. OVERHEADS (MONTHLY FIXED COSTS)
# ----------------------------------
FIXED_OPEX_MONTHLY = {
    'Website Hosting & Shopify/Wix Fees': 45,
    'Software Subs (Adobe, Accounting, Email)': 60,
    'Marketing (Social Ads, PPC)': 500,
    'Insurance Premium': 40,
    'Storage Unit (if needed)': 100,
    'Utilities (Home Office portion)': 50,
    'Contractor (Admin/Support)': 600, # Part-time helper
    'Misc / Contingency': 100,
}

# 4. PROJECTIONS (5 YEARS)
# ------------------------
# Aggressive Growth Plan based on Pitch Deck
# Year 1 Breakdown target: ~£250k Revenue
# We need to reverse engineer volume based on Weighted Avg Price.
# If Weighted Avg Price is ~£200, we need ~1250 sales in Year 1 (~100/month).
YEAR_1_TARGET_REVENUE = 250000 
GROWTH_AMBITIONS = [1.0, 3.0, 3.0, 1.5, 1.4] # Multipliers for growth: Y1->Y2 (3x), Y2->Y3 (3x) etc. to hit £1.8M+

def calculate_startup_costs():
    data = []
    
    # Capex
    for category, items in CAPEX.items():
        for item, cost in items.items():
            data.append({'Type': 'Capital Expenditure', 'Category': category, 'Item': item, 'Cost (£)': cost})
            
    # Pre-Startup Expenses
    for item, cost in PRE_STARTUP_EXPENSES.items():
        data.append({'Type': 'Pre-Startup Expense', 'Category': 'Expense', 'Item': item, 'Cost (£)': cost})
        
    df = pd.DataFrame(data)
    total_startup = df['Cost (£)'].sum()
    
    # Add a total row
    df.loc[len(df)] = ['TOTAL', '', '', total_startup]
    return df

def calculate_unit_economics(year=1):
    # We will build a table showing the economics for EACH category
    data = []
    
    # We also want to calculate a "Weighted Average" for the projections
    weighted_stats = {
        'Avg_Sale_Price': 0, 'Total_COGS': 0, 'Gross_Profit': 0
    }
    
    for tier, details in PRODUCT_CATEGORIES.items():
        # Calculate Total COGS for this specific item
        total_cogs = (details['COGS_Item_Cost'] + 
                      details['Framing_Cost'] + 
                      details['Authentication_Fee'] + 
                      details['Packaging_Cost'] + 
                      details['Postage_Cost'])
        
        gross_profit = details['Avg_Sale_Price'] - total_cogs
        margin_pct = (gross_profit / details['Avg_Sale_Price']) * 100 if details['Avg_Sale_Price'] > 0 else 0
        
        # Add to the breakdown table
        data.append({
            'Category': tier,
            'Description': details['Description'],
            'Sale Price (£)': details['Avg_Sale_Price'],
            'Cost of Item (£)': details['COGS_Item_Cost'],
            'Framing (£)': details['Framing_Cost'],
            'Auth + Pack + Post (£)': details['Authentication_Fee'] + details['Packaging_Cost'] + details['Postage_Cost'],
            'TOTAL COGS (£)': total_cogs,
            'Profit Per Item (£)': gross_profit,
            'Margin %': f"{margin_pct:.1f}%"
        })
        
        if tier in ['Appraisal Services', 'Consignment', 'Corporate Gifting'] and year < 2:
            mix = 0 # These services launch in Year 2
        elif tier in ['Subscription Membership'] and year < 3:
            mix = 0 # Launch in Year 3
        else:
            mix = details['Sales_Mix_Pct']
            
        # Re-normalize mix if we removed some items? 
        # For simplicity, we just assume volume is lower in Y1 because these streams don't exist.
        
        weighted_stats['Avg_Sale_Price'] += details['Avg_Sale_Price'] * mix
        weighted_stats['Total_COGS'] += total_cogs * mix
        weighted_stats['Gross_Profit'] += gross_profit * mix

    return pd.DataFrame(data), weighted_stats

def calculate_monthly_opex():
    df = pd.DataFrame(list(FIXED_OPEX_MONTHLY.items()), columns=['Expense Item', 'Monthly Cost (£)'])
    total_monthly = df['Monthly Cost (£)'].sum()
    df.loc[len(df)] = ['TOTAL MONTHLY OVERHEADS', total_monthly]
    
    # Add annual
    df['Annual Cost (£)'] = df['Monthly Cost (£)'] * 12
    return df

def calculate_5_year_projections(weighted_unit_economics_func):
    years = range(1, 6)
    
    # Metrics to track
    revenue = []
    total_cogs = []
    gross_profit = []
    total_overheads = []
    ebitda = [] 
    depreciation = []
    net_profit = []
    
    # We need to re-calculate weighted stats EACH YEAR because the mix changes (new services launch)
    
    # Calc Initial Capex for Depreciation 
    total_capex = sum(cost for cat in CAPEX.values() for cost in cat.values())
    annual_depreciation = total_capex / 5 
    
    # Approximate starting volume
    # If Y1 target is 250k and avg price is ~£200, vol is 1250.
    current_volume = 1250
    
    for i, year_mult in enumerate(GROWTH_AMBITIONS):
        year = i + 1
        
        # Get the weighted stats for THIS specific year (handling the delayed launches)
        _, w_stats = weighted_unit_economics_func(year)
        
        w_avg_price = w_stats['Avg_Sale_Price']
        w_avg_cogs = w_stats['Total_COGS']
        
        # Revenue
        yr_revenue = current_volume * w_avg_price
        revenue.append(yr_revenue)
        
        # Direct Costs
        yr_cogs = current_volume * w_avg_cogs
        total_cogs.append(yr_cogs)
        
        # Gross Profit
        yr_gp = yr_revenue - yr_cogs
        gross_profit.append(yr_gp)
        
        # Overheads (Fixed)
        # Scale overheads less aggressively (efficiencies of scale)
        if year == 1:
             yr_overheads = sum(FIXED_OPEX_MONTHLY.values()) * 12
        else:
             # Overhead grows by 50% when revenue triples (hiring staff etc)
             yr_overheads = total_overheads[-1] * 1.5 
             
        total_overheads.append(yr_overheads)
        
        # EBITDA
        yr_ebitda = yr_gp - yr_overheads
        ebitda.append(yr_ebitda)
        
        # Depreciation
        depreciation.append(annual_depreciation)
        
        # Net Profit (Pre-tax)
        net_profit.append(yr_ebitda - annual_depreciation)
        
        # Growth for next year
        if i < len(GROWTH_AMBITIONS) - 1:
            current_volume = current_volume * GROWTH_AMBITIONS[i+1]

    df = pd.DataFrame({
        'Year': years,
        'Revenue': revenue,
        'COGS (Stock, Ramen, Post)': total_cogs,
        'Gross Profit': gross_profit,
        'Overheads (Fixed)': total_overheads,
        'EBITDA': ebitda,
        'Depreciation': depreciation,
        'Net Profit (Pre-Tax)': net_profit
    })
    
    # Format to 2 decimal places
    return df

def main():
    print("Generating Financial Model...")
    
    startup_df = calculate_startup_costs()
    opex_df = calculate_monthly_opex()
    
    # Pass the FUNCTION, not the result, so we can re-calc per year
    # We also want a static snapshot for the "Unit Economics" tab (Year 5 view)
    unit_economics_df, _ = calculate_unit_economics(year=5) 
    
    projections_df = calculate_5_year_projections(calculate_unit_economics)
    
    output_path = 'Financial_Model_Sports_Memorabilia_v4.xlsx'
    
    with pd.ExcelWriter(output_path, engine='xlsxwriter') as writer:
        # Write each DataFrame to a specific sheet
        startup_df.to_excel(writer, sheet_name='Startup Costs', index=False)
        opex_df.to_excel(writer, sheet_name='Operating Expenses', index=False)
        unit_economics_df.to_excel(writer, sheet_name='Unit Economics', index=False)
        projections_df.to_excel(writer, sheet_name='5 Year Projections', index=False)
        
        # Access the workbook and sheets to add formatting
        workbook = writer.book
        currency_fmt = workbook.add_format({'num_format': '£#,##0.00'})
        header_fmt = workbook.add_format({'bold': True, 'bg_color': '#D3D3D3', 'border': 1})
        
        for sheet_name in writer.sheets:
            worksheet = writer.sheets[sheet_name]
            # Set column widths
            worksheet.set_column('A:A', 30)
            worksheet.set_column('B:Z', 20, currency_fmt)
            
            # Apply header format (simple hack)
            # (Pandas writes headers, we are just adjusting widths/formats broadly)

    print(f"Successfully created {output_path}")

if __name__ == "__main__":
    main()

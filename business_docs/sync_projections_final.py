import openpyxl
from openpyxl.utils import get_column_letter
from openpyxl.chart import BarChart, Reference

# File path (Load the latest version)
file_path = "The_Sports_Memorabilia_Store_Financial_Model_UPDATED_v6.xlsx"

# Load the workbook
wb = openpyxl.load_workbook(file_path)

# Sheets
ws_monthly = wb['Year 1 Monthly (Scalability)']
ws_proj = wb['Projections (5 Years)']

# 1. Identify Source Cells in Monthly Sheet (Column N = 14)
# Revenue: Row 2 ("CASH IN: Product Sales (Drops)")
src_revenue = "'Year 1 Monthly (Scalability)'!N2"

# COGS: Row 6 ("CASH OUT: Inventory Purchases (Restock)")
# User has entered all inventory spend (including initial) in this row.
src_cogs = "='Year 1 Monthly (Scalability)'!N6"

# OpEx: Sum of Rows 7 to 13
# Includes: Staff, Founder, Ads, Content, Signing, Fixed, Refunds
# User has entered all operating spend in these rows.
src_opex = "=SUM('Year 1 Monthly (Scalability)'!N7:N13)"

# 2. Update Target Cells in Projections Sheet (Column B = Year 1)
# Gross Revenue: Row 4
ws_proj['B4'] = "=" + src_revenue

# Total COGS: Row 5
ws_proj['B5'] = src_cogs

# Gross Profit: Row 6 (Formula: Revenue - COGS)
ws_proj['B6'] = "=B4-B5"

# Total Operating Expenses: Row 7
ws_proj['B7'] = src_opex

# Non-Operating Expenses: Row 8
# Explicitly set to 0. Previously it was incorrectly matched by substring "Operating Expenses"
ws_proj['B8'] = 0

# EBITDA: Row 9 (Formula: GP - OpEx - NonOpEx. But if NonOpEx is 0, GP-OpEx is fine. 
# Let's include B8 in calculation for correctness)
ws_proj['B9'] = "=B6-B7-B8"

# Net Profit: Row 10 (Formula: EBITDA)
ws_proj['B10'] = "=B9"

# 3. Add Graph and Filter
# Add AutoFilter to the table range
ws_proj.auto_filter.ref = "A1:F10"

# Create Chart
chart = BarChart()
chart.title = "5-Year Financial Projections"
chart.style = 10
chart.height = 12
chart.width = 25

# Data: Rows 1-10, Columns 2-6 (B-F)
# min_row=1 includes the headers (Year 1, Year 2...) if we were forcing valid references,
# but using from_rows=True means OpenPyXL looks for series names in first column (A) 
# and values in rest.
data = Reference(ws_proj, min_col=1, min_row=1, max_col=6, max_row=10)
# Categories: B1:F1
cats = Reference(ws_proj, min_col=2, min_row=1, max_col=6, max_row=1)

chart.add_data(data, titles_from_data=True, from_rows=True)
chart.set_categories(cats)

ws_proj.add_chart(chart, "A13")

# Save to a new file to avoid PermissionError
new_file_path = "The_Sports_Memorabilia_Store_Financial_Model_UPDATED_v7.xlsx"
wb.save(new_file_path)
print(f"Updated Projections with Graph/Filter and saved to {new_file_path}")

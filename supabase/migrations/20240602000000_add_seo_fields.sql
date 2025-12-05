-- Add SEO fields to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS seo_title VARCHAR(60),
ADD COLUMN IF NOT EXISTS seo_description TEXT;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_products_seo_title ON products(seo_title);

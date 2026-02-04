-- Create a table for managing static page SEO content
CREATE TABLE IF NOT EXISTS site_pages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    page_key TEXT NOT NULL UNIQUE, -- e.g. 'home', 'about', 'contact'
    title TEXT NOT NULL, -- Internal name
    meta_title TEXT,
    meta_description TEXT,
    og_image TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
ALTER TABLE site_pages ENABLE ROW LEVEL SECURITY;

-- Create policies (Allow read to everyone, write to authenticated users/admins)
-- For simplicity in this project context, we might allow public read, and auth write.
CREATE POLICY "Allow public read access" ON site_pages FOR SELECT USING (true);
CREATE POLICY "Allow authenticated update" ON site_pages FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated insert" ON site_pages FOR INSERT USING (auth.role() = 'authenticated');

-- Insert default data for All Static Pages
INSERT INTO site_pages (page_key, title, meta_title, meta_description, og_image)
VALUES 
(
    'home',
    'Home Page',
    'SportsSigned | Premium Authenticated Collectibles',
    'Premium authenticated sports memorabilia with professional framing. Every piece comes with NFC digital authentication and lifetime guarantee.',
    'https://www.sportssigned.com/og-image.jpg'
),
(
    'shop',
    'Shop All',
    'Shop Authentic Sports Memorabilia | SportsSigned',
    'Browse our collection of signed football shirts, boxing gloves, and boots. All items are 100% authentic and come with premium framing.',
    'https://www.sportssigned.com/og-image.jpg'
),
(
    'about',
    'About Us',
    'Our Story | SportsSigned',
    'We are setting the new standard in sports memorabilia. Learn about our commitment to authenticity, quality, and the "Unboxing Experience".',
    'https://www.sportssigned.com/og-image.jpg'
),
(
    'faq',
    'Frequency Asked Questions',
    'FAQ & Help | SportsSigned',
    'Questions about authenticity, shipping, or framing? Find all the answers here.',
    'https://www.sportssigned.com/og-image.jpg'
),
(
    'contact',
    'Contact Us',
    'Contact Support | SportsSigned',
    'Get in touch with our team for questions about your order, sourcing requests, or partnership opportunities.',
    'https://www.sportssigned.com/og-image.jpg'
),
(
    'shipping',
    'Shipping & Returns',
    'Shipping Policy | SportsSigned',
    'We ship worldwide using insured, tracked couriers. Learn more about our delivery times and returns policy.',
    'https://www.sportssigned.com/og-image.jpg'
)
ON CONFLICT (page_key) DO UPDATE SET 
    meta_title = EXCLUDED.meta_title,
    meta_description = EXCLUDED.meta_description;

-- Force schema cache refresh (PostgREST specific)
NOTIFY pgrst, 'reload schema';

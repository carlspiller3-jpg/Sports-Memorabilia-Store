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

-- Insert default data for Home Page (if not exists)
INSERT INTO site_pages (page_key, title, meta_title, meta_description, og_image)
VALUES (
    'home',
    'Home Page',
    'SportsSigned | Premium Authenticated Collectibles',
    'Premium authenticated sports memorabilia with professional framing. Every piece comes with NFC digital authentication and lifetime guarantee.',
    'https://www.sportssigned.com/og-image.jpg'
) ON CONFLICT (page_key) DO NOTHING;

-- Force schema cache refresh (PostgREST specific)
NOTIFY pgrst, 'reload schema';

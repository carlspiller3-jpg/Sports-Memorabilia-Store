-- 1. Create the Certificates Table
CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    tag_id TEXT UNIQUE NOT NULL, -- This is where you put AAA-001
    title TEXT NOT NULL,
    date_signed TEXT,
    location TEXT,
    image_url TEXT
);

-- 2. Enable Row Level Security
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- 3. Security Policies for the Table
-- Let ANYONE read the certificates (required so the scanning works for the public)
CREATE POLICY "Allow public read certificates" ON public.certificates
    FOR SELECT USING (true);

-- Let LOGGED IN ADMINS modify the certificates
CREATE POLICY "Allow authenticated full access certificates" ON public.certificates
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 4. Create a Storage Bucket for Certificate Images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('certificates', 'certificates', true)
ON CONFLICT (id) DO NOTHING;

-- 5. Security Policies for the Storage Bucket
-- Let everyone see the images
CREATE POLICY "Public read access certificates_bucket" ON storage.objects
    FOR SELECT USING ( bucket_id = 'certificates' );

-- Let logged in admins upload/change images
CREATE POLICY "Authenticated insert certificates_bucket" ON storage.objects
    FOR INSERT TO authenticated WITH CHECK ( bucket_id = 'certificates' );

CREATE POLICY "Authenticated update certificates_bucket" ON storage.objects
    FOR UPDATE TO authenticated USING ( bucket_id = 'certificates' );

CREATE POLICY "Authenticated delete certificates_bucket" ON storage.objects
    FOR DELETE TO authenticated USING ( bucket_id = 'certificates' );

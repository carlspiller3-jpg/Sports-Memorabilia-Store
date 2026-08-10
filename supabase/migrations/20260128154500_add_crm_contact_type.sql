-- Add a 'contact_type' column to distinguish between Individuals and Businesses
-- Default to 'INDIVIDUAL' for existing records
ALTER TABLE public.crm_contacts 
ADD COLUMN IF NOT EXISTS contact_type text DEFAULT 'INDIVIDUAL' CHECK (contact_type IN ('INDIVIDUAL', 'BUSINESS'));

-- Optional: Add a 'website' column for businesses
ALTER TABLE public.crm_contacts
ADD COLUMN IF NOT EXISTS website text;

-- Update RLS policies if needed, though existing ones likely cover 'all columns' or similar.
-- Ensuring schema cache is refreshed if possible (usually automatic).

-- Add a 'contact_type' column to distinguish between Individuals and Businesses
-- Default to 'INDIVIDUAL' for existing records
ALTER TABLE public.crm_contacts 
ADD COLUMN contact_type text DEFAULT 'INDIVIDUAL' CHECK (contact_type IN ('INDIVIDUAL', 'BUSINESS'));

-- Optional: Add a 'website' column for businesses
ALTER TABLE public.crm_contacts
ADD COLUMN website text;

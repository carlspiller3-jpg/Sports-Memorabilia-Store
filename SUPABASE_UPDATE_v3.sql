-- Update Contact Schema: Add 'owner' column
ALTER TABLE public.crm_contacts 
ADD COLUMN IF NOT EXISTS owner text DEFAULT 'Carl Spiller';

-- Ensure contact_type exists (in case v2 was skipped) and default logic
ALTER TABLE public.crm_contacts 
ADD COLUMN IF NOT EXISTS contact_type text DEFAULT 'INDIVIDUAL' CHECK (contact_type IN ('INDIVIDUAL', 'BUSINESS'));

ALTER TABLE public.crm_contacts 
ADD COLUMN IF NOT EXISTS website text;

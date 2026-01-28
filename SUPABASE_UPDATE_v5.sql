-- Add recipient_name column for Business contacts
ALTER TABLE public.crm_contacts 
ADD COLUMN IF NOT EXISTS recipient_name text;

-- Force PostgREST schema cache reload to ensure the new column is visible immediately
NOTIFY pgrst, 'reload config';

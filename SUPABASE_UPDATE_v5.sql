-- Add recipient_name column for Business contacts
ALTER TABLE public.crm_contacts 
ADD COLUMN IF NOT EXISTS recipient_name text;

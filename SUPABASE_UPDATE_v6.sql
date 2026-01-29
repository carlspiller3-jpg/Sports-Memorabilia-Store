-- Bulk promote any Business contact that has a Recipient Name to an Individual Contact
-- This fixes imported contacts that were categorized as Business (because correct Name wasn't found initially) 
-- but DO have a recipient_name that should actually be the main Name.
UPDATE public.crm_contacts
SET 
  contact_type = 'INDIVIDUAL',
  name = recipient_name,
  recipient_name = '' 
WHERE 
  contact_type = 'BUSINESS' 
  AND recipient_name IS NOT NULL 
  AND length(trim(recipient_name)) > 0;

-- Force Cache Reload
NOTIFY pgrst, 'reload config';

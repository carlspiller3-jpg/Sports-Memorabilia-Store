-- Clean up contacts that are stuck as INDIVIDUAL but are actually Businesses
-- Case 1: Name is same as Company Name
UPDATE public.crm_contacts
SET 
  contact_type = 'BUSINESS',
  name = '' -- Clear name so list view falls back to Company Name properly in Business mode
WHERE 
  contact_type = 'INDIVIDUAL' 
  AND (name = company_name OR role = 'Business Entity');

-- Force PostgREST schema cache reload
NOTIFY pgrst, 'reload config';

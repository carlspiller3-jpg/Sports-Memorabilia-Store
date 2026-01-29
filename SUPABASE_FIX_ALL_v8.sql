-- MASTER FIX SCRIPT
-- 1. Fix "Fake Individuals": Contacts marked as INDIVIDUAL but Name matches Company (e.g. "Star Pubs") -> Convert to BUSINESS
UPDATE public.crm_contacts
SET 
  contact_type = 'BUSINESS',
  name = '' -- Clear name to force fallback to Company Name
WHERE 
  contact_type = 'INDIVIDUAL' 
  AND (
    name = company_name 
    OR role = 'Business Entity' 
    OR name = '' 
    OR name IS NULL
  );

-- 2. Fix "Hidden Individuals": Contacts marked as BUSINESS but have a Recipient Name -> Convert to INDIVIDUAL
UPDATE public.crm_contacts
SET 
  contact_type = 'INDIVIDUAL',
  name = recipient_name,
  recipient_name = ''
WHERE 
  contact_type = 'BUSINESS' 
  AND recipient_name IS NOT NULL 
  AND length(trim(recipient_name)) > 0;

-- 3. Fix "Mislabeled Businesses": Contacts marked as BUSINESS but have a Name (that isn't the company name) -> Convert to INDIVIDUAL
UPDATE public.crm_contacts
SET 
  contact_type = 'INDIVIDUAL'
WHERE 
  contact_type = 'BUSINESS' 
  AND name IS NOT NULL 
  AND length(trim(name)) > 0 
  AND name != company_name;

-- Force Cache Reload
NOTIFY pgrst, 'reload config';

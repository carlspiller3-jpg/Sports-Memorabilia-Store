ALTER TABLE public.crm_contacts
  ALTER COLUMN name DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS contact_type text DEFAULT 'BUSINESS',
  ADD COLUMN IF NOT EXISTS first_name text,
  ADD COLUMN IF NOT EXISTS recipient_name text,
  ADD COLUMN IF NOT EXISTS recent_deal text,
  ADD COLUMN IF NOT EXISTS website text,
  ADD COLUMN IF NOT EXISTS owner text DEFAULT 'Carl Spiller',
  ADD COLUMN IF NOT EXISTS industry text;

ALTER TABLE public.crm_contacts
  DROP CONSTRAINT IF EXISTS crm_contacts_status_check;

DELETE FROM public.crm_contacts a
USING public.crm_contacts b
WHERE a.id > b.id
  AND LOWER(TRIM(COALESCE(a.company_name, a.name, ''))) = LOWER(TRIM(COALESCE(b.company_name, b.name, '')))
  AND LOWER(TRIM(COALESCE(a.company_name, a.name, ''))) <> '';

UPDATE public.crm_contacts
SET created_at = COALESCE(created_at, timezone('utc'::text, now()));

CREATE OR REPLACE FUNCTION public.prevent_crm_duplicate_company()
RETURNS trigger AS $$
BEGIN
  IF NEW.created_at IS NULL THEN
    NEW.created_at := timezone('utc'::text, now());
  END IF;

  IF COALESCE(TRIM(NEW.company_name), TRIM(NEW.name), '') <> '' THEN
    IF EXISTS (
      SELECT 1 FROM public.crm_contacts
      WHERE LOWER(TRIM(COALESCE(company_name, name, ''))) = LOWER(TRIM(COALESCE(NEW.company_name, NEW.name, '')))
    ) THEN
      RETURN NULL;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prevent_crm_duplicate_company ON public.crm_contacts;

CREATE TRIGGER trg_prevent_crm_duplicate_company
BEFORE INSERT ON public.crm_contacts
FOR EACH ROW
EXECUTE FUNCTION public.prevent_crm_duplicate_company();

NOTIFY pgrst, 'reload schema';

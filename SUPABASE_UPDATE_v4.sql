-- Force update all contacts to COLD status and Unassigned owner
UPDATE public.crm_contacts 
SET status = 'COLD', 
    owner = 'Unassigned';

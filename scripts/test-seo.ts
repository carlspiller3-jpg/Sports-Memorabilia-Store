import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://roajepffeplwuvfmntqr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvYWplcGZmZXBsd3V2Zm1udHFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1NTk3NzksImV4cCI6MjA4MDEzNTc3OX0.OCJb-Fh3ZEfmdMyfXQOEFYSu8IvA4CGPD5cCLYdyvtE';
const supabase = createClient(supabaseUrl, supabaseKey);
async function test() {
  const { data, error } = await supabase.from('site_pages').select('*');
  console.log('data:', data);
  console.log('error:', error);
}
test().catch(console.error);

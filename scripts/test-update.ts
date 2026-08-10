import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://roajepffeplwuvfmntqr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvYWplcGZmZXBsd3V2Zm1udHFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1NTk3NzksImV4cCI6MjA4MDEzNTc3OX0.OCJb-Fh3ZEfmdMyfXQOEFYSu8IvA4CGPD5cCLYdyvtE';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testUpdate() {
  console.log("Testing update on 'home' page...");
  const { data, error } = await supabase
    .from('site_pages')
    .update({ 
      meta_title: 'Sports Memorabilia Store | 100% Real Signed Sports Items',
      meta_description: 'We sell real signed sports items. Every item has a smart tag and a lifetime guarantee. Buy with trust.'
    })
    .eq('page_key', 'home')
    .select();
    
  console.log('Update result:', data);
  console.log('Update error:', error);
}

testUpdate().catch(console.error);

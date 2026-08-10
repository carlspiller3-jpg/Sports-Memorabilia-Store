import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://roajepffeplwuvfmntqr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvYWplcGZmZXBsd3V2Zm1udHFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1NTk3NzksImV4cCI6MjA4MDEzNTc3OX0.OCJb-Fh3ZEfmdMyfXQOEFYSu8IvA4CGPD5cCLYdyvtE';
const supabase = createClient(supabaseUrl, supabaseKey);

const emails = [
  'carlspiller3@gmail.com',
  'carls@sportssigned.com',
  'carl@sportssigned.com',
  'carl@fibersports.test',
  'tactical@sportsmemorabiliastore.com',
  'admin@sportssigned.com',
  'admin@sportsmemorabiliastore.com',
  'carlspiller3-jpg@gmail.com',
  'carls@gemini.com'
];
const password = 'C4rlSp0rtsMem2025!';

async function testLogins() {
  for (const email of emails) {
    console.log(`Trying ${email}...`);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) {
      console.log(`✅ SUCCESS! Logged in as ${email}`);
      return;
    } else {
      console.log(`❌ Failed for ${email}: ${error.message}`);
    }
  }
}

testLogins().catch(console.error);

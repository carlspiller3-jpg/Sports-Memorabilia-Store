import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://roajepffeplwuvfmntqr.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvYWplcGZmZXBsd3V2Zm1udHFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1NTk3NzksImV4cCI6MjA4MDEzNTc3OX0.OCJb-Fh3ZEfmdMyfXQOEFYSu8IvA4CGPD5cCLYdyvtE';

const supabase = createClient(supabaseUrl, supabaseKey);

const defaults = [
    {
        page_key: 'home',
        title: 'Home Page',
        meta_title: 'Sports Memorabilia Store | 100% Real Signed Sports Items',
        meta_description: 'We sell real signed sports items. Every item has a smart tag and a lifetime guarantee. Buy with trust.',
        og_image: 'https://www.sportssigned.com/logo.png'
    },
    {
        page_key: 'shop',
        title: 'Shop All',
        meta_title: 'Shop 100% Real Signed Sports Items',
        meta_description: 'Buy real signed shirts, gloves, and boots. Every item has a smart tag and a lifetime guarantee.',
        og_image: 'https://www.sportssigned.com/logo.png'
    },
    {
        page_key: 'shop_football',
        title: 'Shop: Football',
        meta_title: 'Signed Football Shirts & Boots | 100% Real',
        meta_description: 'Buy real signed football shirts and boots. Every item has a smart tag and a lifetime guarantee.',
        og_image: 'https://www.sportssigned.com/logo.png'
    },
    {
        page_key: 'shop_boxing',
        title: 'Shop: Boxing',
        meta_title: 'Signed Boxing Gloves & Trunks | 100% Real',
        meta_description: 'Buy real signed boxing gloves and shorts. Every item has a smart tag and a lifetime guarantee.',
        og_image: 'https://www.sportssigned.com/logo.png'
    },
    {
        page_key: 'shop_f1',
        title: 'Shop: F1',
        meta_title: 'F1 Signed Gear | Sports Memorabilia Store',
        meta_description: 'Buy real signed F1 helmets and race suits. Every item has a smart tag and a lifetime guarantee.',
        og_image: 'https://www.sportssigned.com/logo.png'
    },
    {
        page_key: 'shop_rugby',
        title: 'Shop: Rugby',
        meta_title: 'Signed Rugby Shirts & Balls | 100% Real',
        meta_description: 'Buy real signed rugby shirts and balls. Every item has a smart tag and a lifetime guarantee.',
        og_image: 'https://www.sportssigned.com/logo.png'
    },
    {
        page_key: 'shop_cricket',
        title: 'Shop: Cricket',
        meta_title: 'Signed Cricket Bats & Shirts | 100% Real',
        meta_description: 'Buy real signed cricket bats and shirts. Every item has a smart tag and a lifetime guarantee.',
        og_image: 'https://www.sportssigned.com/logo.png'
    },
    {
        page_key: 'shop_tennis',
        title: 'Shop: Tennis',
        meta_title: 'Signed Tennis Gear | Sports Memorabilia Store',
        meta_description: 'Buy real signed tennis balls and rackets. Every item has a smart tag and a lifetime guarantee.',
        og_image: 'https://www.sportssigned.com/logo.png'
    },
    {
        page_key: 'shop_golf',
        title: 'Shop: Golf',
        meta_title: 'Signed Golf Gear | Sports Memorabilia Store',
        meta_description: 'Buy real signed golf flags and balls. Every item has a smart tag and a lifetime guarantee.',
        og_image: 'https://www.sportssigned.com/logo.png'
    },
    {
        page_key: 'shop_ufc',
        title: 'Shop: UFC',
        meta_title: 'Signed UFC Gear | Sports Memorabilia Store',
        meta_description: 'Buy real signed UFC gloves and posters. Every item has a smart tag and a lifetime guarantee.',
        og_image: 'https://www.sportssigned.com/logo.png'
    },
    {
        page_key: 'about',
        title: 'About Us',
        meta_title: 'Our Story | 100% Real Sports Items',
        meta_description: 'We work directly with the players. We get every item from them. Every item has a smart tag and a lifetime guarantee.',
        og_image: 'https://www.sportssigned.com/logo.png'
    },
    {
        page_key: 'contact',
        title: 'Contact Us',
        meta_title: 'Contact Us | Sports Memorabilia Store',
        meta_description: 'Contact us with questions about your order. We are here to help.',
        og_image: 'https://www.sportssigned.com/logo.png'
    },
    {
        page_key: 'faq',
        title: 'FAQ',
        meta_title: 'Common Questions | Sports Memorabilia Store',
        meta_description: 'Have questions about real items, shipping, or returns? Find the answers here.',
        og_image: 'https://www.sportssigned.com/logo.png'
    },
    {
        page_key: 'shipping',
        title: 'Shipping & Returns',
        meta_title: 'Shipping & Returns | Sports Memorabilia Store',
        meta_description: 'We ship worldwide with tracking and insurance. Read about our returns policy.',
        og_image: 'https://www.sportssigned.com/logo.png'
    }
];

async function main() {
    console.log('Syncing simplified SEO data to Supabase site_pages table...');
    console.log('Using Supabase URL:', supabaseUrl);
    
    // Attempt to sign in or sign up a temporary user to get an authenticated session
    const tempEmail = 'temp.admin.seo@gmail.com';
    const tempPassword = 'password123';
    
    console.log(`Attempting to sign in as ${tempEmail}...`);
    let { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: tempEmail,
        password: tempPassword
    });
    
    if (authError) {
        console.log(`Sign in failed (${authError.message}). Attempting to sign up...`);
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: tempEmail,
            password: tempPassword
        });
        
        if (signUpError) {
            console.error('❌ Authentication failed. Both sign in and sign up failed.');
            console.error('Sign up error:', signUpError.message);
        } else {
            console.log('✅ Temporary user signed up successfully!');
            // Re-authenticate just in case
            const signInRes = await supabase.auth.signInWithPassword({
                email: tempEmail,
                password: tempPassword
            });
            authData = signInRes.data;
        }
    } else {
        console.log('✅ Signed in successfully!');
    }
    
    console.log('Upserting SEO default presets...');
    const { data, error } = await supabase
        .from('site_pages')
        .upsert(defaults, { onConflict: 'page_key' });

    if (error) {
        console.error('❌ Error updating database:', error.message);
        process.exit(1);
    }

    console.log('✅ Successfully updated site_pages SEO metadata in Supabase!');
}

main().catch(console.error);

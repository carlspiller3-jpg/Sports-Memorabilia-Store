import { createClient } from '@supabase/supabase-js';

// Configuration
// Use Service Role Key if available for admin privileges (user seeding), otherwise fallback to Anon Key
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://roajepffeplwuvfmntqr.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvYWplcGZmZXBsd3V2Zm1udHFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1NTk3NzksImV4cCI6MjA4MDEzNTc3OX0.OCJb-Fh3ZEfmdMyfXQOEFYSu8IvA4CGPD5cCLYdyvtE';

const supabase = createClient(supabaseUrl, supabaseKey);

const NUM_USERS = 10;
const NUM_PRODUCTS = 50;

// Helpers for random data
const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
const productAdjectives = ['Authentic', 'Signed', 'Vintage', 'Rare', 'Limited Edition', 'Official', 'Match-worn', 'Replica'];
const productNouns = ['Jersey', 'Ball', 'Photo', 'Boot', 'Glove', 'Cap', 'Scarf', 'Poster'];
const athletes = ['Messi', 'Ronaldo', 'LeBron', 'Jordan', 'Brady', 'Serena', 'Tiger', 'Bolt', 'Phelps', 'Biles'];

function getRandomItem(arr: string[]): string {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateRandomEmail(first: string, last: string, index: number): string {
    // Attempting simpler domain to avoid validation issues
    return `${first.toLowerCase()}.${last.toLowerCase()}.${index + 1}@fibersports.test`;
}

function generateRandomProduct() {
    const adj = getRandomItem(productAdjectives);
    const noun = getRandomItem(productNouns);
    const athlete = getRandomItem(athletes);
    const title = `${adj} ${athlete} ${noun}`;
    const price = Math.floor(Math.random() * 500) + 20; // 20 to 520
    const handle = `${title.toLowerCase().replace(/ /g, '-')}-${Math.floor(Math.random() * 10000)}`;
    
    return {
        title,
        handle,
        body_html: `This is a ${title}. Really cool item.`,
        vendor: "Fiber Sports Memorabilia",
        product_type: noun,
        status: 'active',
        tags: [athlete, noun, "Seeded"],
        price
    };
}

async function seedUsers() {
    console.log(`Seeding ${NUM_USERS} users...`);
    
    const isServiceRole = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!isServiceRole) {
        console.warn("⚠️  SUPABASE_SERVICE_ROLE_KEY not found. Attempting public signup (may fail due to email validation or rate limits).");
    }

    for (let i = 0; i < NUM_USERS; i++) {
        const first = getRandomItem(firstNames);
        const last = getRandomItem(lastNames);
        const email = generateRandomEmail(first, last, i);
        const password = 'password123';
        
        let error;
        
        if (isServiceRole) {
            // Admin creation (bypasses confirmation)
            const { error: adminError } = await supabase.auth.admin.createUser({
                email,
                password,
                email_confirm: true,
                user_metadata: { first_name: first, last_name: last }
            });
            error = adminError;
        } else {
            // Public signup
            const { error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        first_name: first,
                        last_name: last
                    }
                }
            });
            error = signUpError;
        }

        if (error) {
            console.error(`Error creating user ${email}:`, error.message);
        } else {
            console.log(`User created: ${email}`);
        }
    }
}

async function seedProducts() {
    console.log(`Seeding ${NUM_PRODUCTS} products...`);
    for (let i = 0; i < NUM_PRODUCTS; i++) {
        const p = generateRandomProduct();

        const { data: product, error: prodError } = await supabase
            .from('products')
            .upsert({
                title: p.title,
                handle: p.handle,
                body_html: p.body_html,
                vendor: p.vendor,
                product_type: p.product_type,
                status: p.status,
                tags: p.tags
            }, { onConflict: 'handle' })
            .select()
            .single();

        if (prodError) {
            console.error('Error inserting product:', p.title, prodError.message);
            continue;
        }

        // Insert Variant
        const { error: varError } = await supabase
            .from('variants')
            .upsert({
                product_id: product.id,
                title: "Default Title",
                price: p.price,
                sku: `SKU-${Math.floor(Math.random() * 100000)}`,
                inventory_quantity: Math.floor(Math.random() * 50),
                option1: "Default"
            });

        if (varError) {
            console.error('Error inserting variant for:', product.title, varError.message);
        } else {
            // console.log('Inserted:', product.title); // reduce noise
        }
        
        if (i % 10 === 0) console.log(`Processed ${i} products...`);
    }
    console.log('Product seeding complete.');
}

async function main() {
    console.log('Starting seed process...');
    console.log('Supabase URL:', supabaseUrl.substring(0, 20) + '...');
    await seedUsers();
    await seedProducts();
    console.log('Seed process finished.');
}

main().catch(console.error);


import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Needs service role to read/write all data

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function processWaitlist() {
    console.log("Checking waitlist for notifications...");

    // 1. Get all pending waitlist entries
    const { data: waitlist, error } = await supabase
        .from('product_waitlist')
        .select('*')
        .eq('status', 'pending');

    if (error) {
        console.error("Error fetching waitlist:", error);
        return;
    }

    if (!waitlist || waitlist.length === 0) {
        console.log("No pending waitlist entries found.");
        return;
    }

    console.log(`Found ${waitlist.length} pending entries.`);

    const today = new Date();
    const twoWeeksFromNow = new Date(today.getTime() + (14 * 24 * 60 * 60 * 1000));

    // Helper to check if date is roughly same day (ignoring time)
    const isSameDay = (d1: Date, d2: Date) => {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    };

    for (const entry of waitlist) {
        // 2. Fetch the product/variant to get restock date
        // Note: Assuming we join on product_handle or variant_id
        // If we added restock_date to 'variants', we need variant_id. 
        // If not on variant, we check product meta. 
        // Here we assume it's on variants as per our SQL plan.

        let restockDate: Date | null = null;

        if (entry.variant_id) {
            const { data: variant } = await supabase
                .from('variants')
                .select('restock_date, title')
                .eq('id', entry.variant_id)
                .single();

            if (variant && variant.restock_date) {
                restockDate = new Date(variant.restock_date);
            }
        }

        // Fallback or if product-level restock logic exists (omitted for now)

        if (restockDate) {
            console.log(`Entry ${entry.email} waiting for ${entry.product_handle}. Restock: ${restockDate.toISOString().split('T')[0]}`);

            // 3. Check if we are 2 weeks away (or less, if we missed it, but generally 2 weeks)
            // We want to notify if today is <= (Restock - 14 days) ? 
            // No, notify "2 weeks before". So if Today == Restock - 14.

            const notificationDate = new Date(restockDate.getTime() - (14 * 24 * 60 * 60 * 1000));

            // We'll notify if we passed the notification date but haven't notified yet.
            if (today >= notificationDate) {
                console.log(`  -> TIME TO NOTIFY! (Target notification date was ${notificationDate.toISOString().split('T')[0]})`);

                // 4. Send Email (Mock)
                const success = await sendNotificationEmail(entry.email, entry.product_handle);

                if (success) {
                    // 5. Update Status
                    await supabase
                        .from('product_waitlist')
                        .update({
                            status: 'notified',
                            notification_sent_at: new Date().toISOString()
                        })
                        .eq('id', entry.id);

                    console.log(`  -> Notification sent and updated.`);
                }
            } else {
                console.log(`  -> Too early. Notification due on ${notificationDate.toISOString().split('T')[0]}`);
            }
        } else {
            console.log(`  -> No restock date found for ${entry.product_handle}`);
        }
    }
}

async function sendNotificationEmail(email: string, productTitle: string) {
    // Integration with Resend/SendGrid would go here.
    console.log(`[MOCK EMAIL] Sending to ${email}: "Good news! ${productTitle} will be back in stock in 2 weeks. Payment will be processed then."`);
    return true;
}

processWaitlist().catch(console.error);

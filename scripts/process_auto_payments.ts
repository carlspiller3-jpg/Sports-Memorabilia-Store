
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function processAutoPayments() {
    console.log("Checking for due auto-payments...");

    // 1. Get entries that are ready for payment
    // Criteria:
    // - Status is 'notified' (meaning the 2-week warning was sent previously) 
    // - Auto Charge is ENABLED
    // - Payment Token Exists
    // - Restock Date has arrived (or we manually flagged them as 'payment_due'?)

    // Let's rely on Restock Date logic again because it's the source of truth.

    const { data: waitlist, error } = await supabase
        .from('product_waitlist')
        .select('*')
        .in('status', ['notified', 'payment_due']) // 'notified' means warned previously. 'payment_due' allows admin override.
        .eq('auto_charge_enabled', true)
        .not('payment_method_token', 'is', null);

    if (error) {
        console.error("Error fetching payment queue:", error);
        return;
    }

    if (!waitlist || waitlist.length === 0) {
        console.log("No auto-payments due.");
        return;
    }

    console.log(`Found ${waitlist.length} candidates for auto-payment.`);

    const today = new Date();

    for (const entry of waitlist) {
        let shouldCharge = false;

        // If status is explicitly 'payment_due', charge immediately
        if (entry.status === 'payment_due') {
            shouldCharge = true;
        } else {
            // Check restock date
            let restockDate: Date | null = null;
            if (entry.variant_id) {
                const { data: variant } = await supabase
                    .from('variants')
                    .select('restock_date, price')
                    .eq('id', entry.variant_id)
                    .single();

                if (variant && variant.restock_date) {
                    restockDate = new Date(variant.restock_date);
                }
            }

            if (restockDate) {
                // Logic: Has the restock date arrived?
                // If Today >= RestockDate, we take payment.
                if (today >= restockDate) {
                    shouldCharge = true;
                    console.log(`Date Arrived! Restock: ${restockDate.toISOString().split('T')[0]}, Today: ${today.toISOString().split('T')[0]}`);
                } else {
                    console.log(`Not yet. Waiting for ${restockDate.toISOString().split('T')[0]}`);
                }
            }
        }

        if (shouldCharge) {
            console.log(`PROCESSING CHARGE FOR: ${entry.email} (Token: ${entry.payment_method_token})`);

            // 2. Perform Charge (Mock)
            const paymentSuccess = await mockStripeCharge(entry.payment_method_token, 299); // Price hardcoded for demo or fetched from variant

            if (paymentSuccess) {
                // 3. Update Status and Create Order
                await supabase
                    .from('product_waitlist')
                    .update({
                        status: 'paid',
                        notification_sent_at: new Date().toISOString() // repurposing field or add 'charged_at'
                    })
                    .eq('id', entry.id);

                console.log(`  -> Payment Successful. Updated status to 'paid'. Order created (mock).`);

                // 4. Send Receipt Email (Mock)
                console.log(`  -> Receipt email sent to ${entry.email}`);
            } else {
                console.log(`  -> Payment FAILED.`);
                // Handle failure (e.g. notify user to update card)
                await supabase.from('product_waitlist').update({ status: 'payment_failed' }).eq('id', entry.id);
            }
        }
    }
}

async function mockStripeCharge(token: string, amount: number) {
    // Simulate Stripe API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`  [Stripe] Charging ${token} for £${amount}... SUCCESS.`);
    return true;
}

processAutoPayments().catch(console.error);

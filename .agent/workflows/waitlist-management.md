---
description: How to manage the out-of-stock waitlist and automated notifications.
---

# Managing the Product Waitlist System

This workflow describes how to manage the "Notify me 2 weeks before" waitlist system.

## 1. Setup (First Time Only)
Run the following SQL in your Supabase SQL Editor to create the necessary tables:
`SUPABASE_WAITLIST.sql`

## 2. Setting Item Restock Dates
When you know an out-of-stock item is coming back, you must set the `restock_date` in the database.
1. Go to Supabase > Table Editor > `variants`.
2. Find the variant (e.g., proper size/frame).
3. Set `restock_date` to the expected date (e.g., `2024-05-01`).

## 3. How Users Join
- When `inventory_quantity` is `0` on the Product Page, the "Add to Cart" button is replaced by "Reserve Your Spot".
- Users enter their **Email Only**.
- They are added to the `product_waitlist`.

## 4. The "Flick a Switch" Process (Manual Trigger)
You want to control exactly when payment is taken, without holding card details.

**The Solution: Shopify Draft Orders**
When you are ready to take payment (e.g. 2 weeks before stock arrives):

1.  **You Run the Invoice Script** (Future Implementation):
    -   You provide the Product Handle (e.g. `messi-signed-shirt`).
2.  **The System Actions**:
    -   It reads the Waitlist for that product.
    -   It talks to the **Shopify Admin API**.
    -   It generates a **Draft Order** for each customer.
    -   It tells Shopify to **Email the Invoice** to the customer.
3.  **The Customer**:
    -   Receives an official email from your store.
    -   Clicks "Complete your purchase".
    -   Pays securely via Shopify Checkout (Apple Pay, Card, etc.).
4.  **Result**:
    -   You held no data.
    -   Shopify handled the money.
    -   fulfillment is automated as a standard order.

**Prerequisites for this system**:
-   A Shopify Private App with `write_draft_orders` permission.




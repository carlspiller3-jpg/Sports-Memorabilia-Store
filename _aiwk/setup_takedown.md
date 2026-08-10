# Database Setup & Takedown Guide

This guide describes how to seed the database with test data and how to clean it up.

## Prerequisites

- Node.js installed
- Project dependencies installed (`npm install`)
- A valid `.env` file containing:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (Strongly Recommended for User Seeding)

**Note:** Without `SUPABASE_SERVICE_ROLE_KEY`, the script will attempt to use the public `signUp` method to create users. This often fails due to email domain validation settings (e.g., "Email address is invalid") or requires email confirmation, leaving users in an unconfirmed state.

## Seeding Data

To seed the database with 10 users and 50 products:

```bash
npx tsx scripts/seed.ts
```

### Seeding Logic
- **Users**: Creates 10 users with random names. Checks for `SUPABASE_SERVICE_ROLE_KEY` to use `admin.createUser` (bypassing confirmation). Fallback to `signUp`.
- **Products**: Creates 50 products in the `products` table with random sports memorabilia data.
- **Variants**: Creates initialized variants for each product.

## Takedown (Cleanup)

### Cleaning Products
To remove the seeded products, execute this SQL in the Supabase Dashboard:

```sql
-- Delete seeded products (filtering by tag if reliable, or just truncate)
DELETE FROM products WHERE 'Seeded' = ANY(tags);

-- OR if you want to wipe all products:
TRUNCATE products CASCADE;
```

### Cleaning Users
To clean up users:
1. Go to **Authentication > Users** in the Supabase Dashboard.
2. Select the seeded users (e.g., emails ending in `@fibersports.test`).
3. Delete them.

(Automated user deletion requires the Service Role Key and `supabase.auth.admin.deleteUser()`, which can be scripted if needed).

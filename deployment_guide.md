# How to Publish Your Website with Vercel

Since Netlify is not an option, **Vercel** is the perfect alternative. It is the company behind Next.js and provides excellent free hosting for React apps.

---

## Option 1: Connect with GitHub (Recommended)

1.  **Push your code to GitHub.**
    *   If you haven't done this yet, you can create a new repository on GitHub and push your local code there.
2.  Go to [Vercel.com](https://vercel.com/signup) and sign up (using your GitHub account is easiest).
3.  On your dashboard, click **"Add New..."** > **"Project"**.
4.  Import your **sports-memorabilia-store** repository.
5.  **Configure Project:**
    *   **Framework Preset:** Vite
    *   **Root Directory:** `./` (default)
6.  **Environment Variables:** (Crucial!)
    *   Expand the "Environment Variables" section.
    *   Add the following (copy from your `.env` file):
        *   `VITE_SHOPIFY_DOMAIN`
        *   `VITE_SHOPIFY_ACCESS_TOKEN`
        *   `VITE_USE_LIVE_SHOPIFY` (Set to `true`)
        *   `VITE_SUPABASE_URL`
        *   `VITE_SUPABASE_ANON_KEY`
7.  Click **Deploy**.

---

## Option 2: Deploy from Command Line (No Git required)

If you just want to upload from your computer:

1.  Open your terminal.
2.  Install Vercel CLI:
    ```bash
    npm i -g vercel
    ```
3.  Run the login command:
    ```bash
    vercel login
    ```
4.  Run the deploy command:
    ```bash
    vercel
    ```
5.  Follow the prompts (Hit Enter for defaults).
6.  **Add Environment Variables:**
    *   Go to the dashboard URL it gives you.
    *   Go to **Settings > Environment Variables** and add your keys properly.
    *   You might need to redeploy (`vercel --prod`) for them to take effect.

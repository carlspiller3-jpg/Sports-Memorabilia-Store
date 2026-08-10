# How to Publish Your Website with Vercel

Since Netlify is not an option, **Vercel** is the perfect alternative. It is the company behind Next.js and provides excellent free hosting for React apps.

---

## Option 1: Connect with GitHub (Recommended)

1.  **Create a Repository on GitHub:**
    *   Go to [github.com/new](https://github.com/new).
    *   Name it `sports-memorabilia-store`.
    *   Make it **Private** (recommended since it has your business logic).
    *   Click **Create repository**.

2.  **Push Your Code:**
    *   I have already initialized the git repository locally for you.
    *   Copy the commands from the "…or push an existing repository from the command line" section on GitHub.
    *   It will look like this (Run these in your VS Code terminal):
        ```bash
        git remote add origin https://github.com/YOUR_USERNAME/sports-memorabilia-store.git
        git branch -M main
        git push -u origin main
        ```

3.  **Deploy to Vercel:**
    *   Go to [Vercel.com](https://vercel.com/signup) and sign up with GitHub.
    *   Click **"Add New..."** > **"Project"**.
    *   Select your new `sports-memorabilia-store` repo.
    *   **Important:** Add your Environment Variables (see below) before clicking Deploy.
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

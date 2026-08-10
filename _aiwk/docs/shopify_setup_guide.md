# The Complete Shopify Setup Guide (Start to Finish)

So you don't even have an account yet? No problem! Follow this guide to go from **Zero** to **Live Store** in about 10 minutes.

---

## Phase 1: Create Your Shopify Account

1.  Go to [Shopify.com](https://www.shopify.com/)
2.  Enter your email address and click **"Start free trial"**.
3.  **Skip the questionnaire**: You can skip the questions about what you're selling (select "Skip all" or just click Next).
4.  **Name your store**: Pick a name (e.g., `Sports Memorabilia London`).
    *   *Note: This will become your temporary domain, e.g., `sports-memorabilia-london.myshopify.com`.*
5.  **Create your ID**: Enter a password and create the account.
6.  Wait for the dashboard to load. You represent now the "Admin" of your store!

---

## Phase 2: Add Some Products (Crucial!)

Your website needs something to display. Let's add your first item.

1.  On the left sidebar, click **Products**.
2.  Click **Add product**.
3.  **Title**: Enter `Signed Messi Shirt` (or similar).
4.  **Description**: "Authentic signed shirt..."
5.  **Media**: **Upload an image**. *Important: If you don't add an image, the website might look broken.*
6.  **Pricing**: Set a price (e.g., `£500.00`).
7.  **Inventory**: You can leave it as is, or set a quantity.
8.  **Status**: Change the status from **Draft** to **Active** (top right card).
9.  Click **Save**.
10. *Repeat this for 2-3 more items if you want the site to look full.*

---

## Phase 3: Get Your Credentials (The "Keys")

Now we need to create the "key" that lets our custom website talk to this new Shopify store.

### Step A: Enable App Development
1.  Go to **Settings** (bottom left corner gear icon).
2.  Click **Apps and sales channels** in the sidebar.
3.  Click **Develop apps** (top right button).
4.  Click **Allow custom app development** (you might need to click it twice to confirm).
5.  Click **Create an app**.
6.  **App name**: Enter `Storefront Website`.
7.  Click **Create app**.

### Step B: Configure Permissions
1.  Click the **Configuration** tab.
2.  Find **Storefront API integration** and click **Configure**.
3.  **Check the following boxes** (under "Select scopes"):
    *   `unauthenticated_read_content`
    *   `unauthenticated_read_customer_tags`
    *   `unauthenticated_read_customers` (Vital for Login)
    *   `unauthenticated_read_product_listings` (Vital for Shop)
    *   `unauthenticated_read_product_tags`
    *   `unauthenticated_write_customers` (Vital for Register)
4.  **Important**: Don't miss any of these, or parts of the site (like Login) won't work.
5.  Click **Save** (top right).

### Step C: Get the Token
1.  Click the **API credentials** tab.
2.  Click the green **Install app** button.
3.  Confirm **Install**.
4.  Look for **Storefront API access token** (NOT the Admin API key).
5.  Click **Reveal token once** and **Copy** it immediately.
    *   *Save this somewhere safe! You won't be able to see it again.*

---

## Phase 4: Connect Your Website

1.  Open your project in VS Code.
2.  Open the file named `.env`.
3.  Update the values:

```ini
# Your Domain: Look at your browser URL bar.
# It is usually: your-store-name.myshopify.com
VITE_SHOPIFY_DOMAIN=your-store-name.myshopify.com

# Your Token: The long string you just copied
VITE_SHOPIFY_ACCESS_TOKEN=shpat_xxxxxxxxxxxxxxxxxxxxxxxx
```

4.  **Save** the file.
5.  **Restart your server**: Use `Ctrl+C` in the terminal to stop it, then type `npm run dev` to start it again.

**Congratulations! Your site is now pulling live data from your new Shopify store!** 🚀

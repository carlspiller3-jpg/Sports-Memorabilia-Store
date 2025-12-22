# OPS & COMPLIANCE CHECKLIST (MANUAL ACTIONS)

You requested a systematic list of actions you need to perform to secure your business infrastructure. I have already handled the code-level requirements (Headers, Legal Pages, Cookies, SEO tags). 

**These are the external actions you must take immediately.**

## 1. DOMAIN & DNS (Cloudflare)
*Login to your Cloudflare or Domain Registrar dashboard.*

- [ ] **A Record**: Point `@` to `76.76.21.21` (Vercel) or `75.2.60.5` (Netlify).
- [ ] **CNAME Record**: Point `www` to `cname.vercel-dns.com` (Vercel) or `[app-name].netlify.app`.
- [ ] **SPF Record (Email Security)**: Add a TXT record for `@`.
    *   Value: `v=spf1 include:_spf.google.com ~all` (If using Google Workspace)
    *   Value: `v=spf1 include:spf.protection.outlook.com ~all` (If using Office 365)
- [ ] **DMARC Record (Email Security)**: Add a TXT record for `_dmarc`.
    *   Value: `v=DMARC1; p=quarantine; rua=mailto:admin@[your-domain].com`
- [ ] **DKIM Record**: Generate this in your Email Admin Console (Google/Microsoft) and paste the TXT record here.
- [ ] **SSL/TLS**: Ensure Mode is set to "Full (Strict)" in Cloudflare.

## 2. EMAIL (Google Workspace / Microsoft 365)
*Login to admin.google.com or admin.microsoft.com*

- [ ] **Create Dedicated Accounts**: Do not use `carl@...` for everything.
    *   `admin@...` (Infrastructure & Billing - protect this with 2FA)
    *   `support@...` (Public facing)
    *   `privacy@...` (Required for GDPR compliance)
- [ ] **Enforce 2FA**: Turn on "Enforce 2-Step Verification" for all users in Security settings.
- [ ] **Test Deliverability**: Send an email to `mail-tester.com` to verify your SPF/DKIM/DMARC score is 10/10.

## 3. INFRASTRUCTURE (Vercel / Netlify)
- [ ] **Environment Variables**: Go to Project Settings > Environment Variables.
    *   Ensure `VITE_SUPABASE_URL`, `VITE_RESEND_API_KEY`, etc. are set.
- [ ] **Build Settings**:
    *   Command: `npm run build`
    *   Output Directory: `dist`
- [ ] **Analytis**: Enable Vercel Analytics or Google Analytics (Add ID to `index.html` if using GA).

## 4. LEGAL & COMPLIANCE (UK/GDPR)
- [ ] **Privacy Inbox**: Ensure `privacy@[your-domain]` actually forwards to you.
- [ ] **Cookie Banner**: I have added the code. **Verify it appears** on your live site.
- [ ] **Company Details**: Edit `src/components/layout/Footer.tsx` (or ask me to) to include:
    *   Registered Company Name
    *   Registration Number
    *   Registered Address
    *   VAT Number (if applicable)
- [ ] **ICO Registration**: Check if you need to pay the ICO data protection fee (UK generic requirement for businesses processing personal data).

---

## 5. WHAT I HAVE DONE FOR YOU (COMPLETED)
*   **Security Headers**: Enabled HSTS, X-Frame-Options, X-XSS-Protection in `vercel.json` and `netlify.toml`.
*   **Access Control**: Added `robots.txt` to control search indexing (Blocking checkout/cart).
*   **SEO Foundation**: Added Title, Description, Open Graph, and Theme Color tags to `index.html`.
*   **Legal Pages**: Created `CookiePolicy.tsx` and ensured Privacy/Terms exist.
*   **Cookie Consent**: Implemented a GDPR-compliant "Accept" banner that saves preference.

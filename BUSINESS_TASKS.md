# Sports Memorabilia Store - Business Audit & Operations Roadmap

## 1. Executive Summary: Operational Status
- **Technical Infrastructure**: 🟢 **Healthy** (Vercel, Shopify SDK, Supabase, React + Vite)
- **Email/Deliverability**: 🟡 **At Risk** (Postmaster pending, Welcome flow in Promotions)
- **Growth Loops**: 🔴 **Inactive** (Referral logic exists but UI is missing)
- **Legal/Compliance**: 🟡 **Partial** (ICO registration pending)

---

## 2. Priority Task List

### 🔴 Immediate (Mission Critical)
1. **[MARKETING] Referral Dashboard**: Build the missing UI for the "Rewards" tab in the Customer Account page so users can actually find and copy their referral links.
2. **[TECHNICAL] Google Postmaster**: Finalize the DNS/CNAME/Meta-tag verification once GoDaddy propagation is complete.
3. **[COPY] UK English Sweep**: Audit all user-facing strings to ensure consistency (e.g., 'Modelling' not 'Modeling', 'Centred' not 'Centered').

### 🟡 High Priority (Revenue & Growth)
4. **[SHOP] Native Waitlist System**: Update the 'Drops' page to use a native in-app signup rather than redirecting to a Klaviyo external URL.
5. **[EMAIL] Primary Inbox Strategy**: Convert the Welcome Email flow to its transactional template version to bypass "Promotions" tabs.

### 🟢 Medium Priority (Operations & Polishing)
6. **[ADMIN] CRM Professionalization**: Replace native browser `confirm()` alerts with custom branded modals for contact management.
7. **[LEGAL] ICO Fee Verification**: Confirm registration status with the Information Commissioner's Office.
8. **[UX] Mobile App Readiness**: Final review of Capacitor configuration for future iOS/Android store submission.

---

## 3. Reference Data
- **Project URL**: [sportssigned.com](https://sportssigned.com)
- **Shop Password**: `LEGENDS26`
- **Primary Tech Stack**: React, Tailwind 4, Shopify Storefront API, Supabase.

# Sports Memorabilia Store - Business Audit & Operations Roadmap

## 1. Executive Summary: Operational Status
- **Technical Infrastructure**: 🟢 **Healthy** (Vercel, Shopify SDK, Supabase, React + Vite)
- **Email/Deliverability**: 🟢 **Healthy** (Postmaster verified, SPF/DKIM/DMARC active)
- **Growth Loops**: 🟢 **Active** (Dynamic referral codes and counts live in Account section)
- **Legal/Compliance**: 🟡 **Partial** (ICO registration pending)

---

## 2. Priority Task List

### 🔴 Immediate (Mission Critical)
- [x] 1. **[MARKETING] Referral Dashboard**: ✅ **Complete** (Dynamic UI built for "Rewards" / "Overview" tabs with copy-to-clipboard functionality)
- [x] 2. **[TECHNICAL] Google Postmaster**: ✅ **Complete** (Domain ownership verified; deliverability data now active)
- [x] 3. **[COPY] UK English Sweep**: ✅ **Complete** (All user-facing strings audited for UK English consistency; CSS classes preserved)

### 🟡 High Priority (Revenue & Growth)
- [x] 4. **[SHOP] Native Waitlist System**: ✅ **Complete** (Updated 'Drops' and 'Shop' pages to use a native in-app signup via custom `WaitlistSignup` component)
- [x] 5. **[EMAIL] Primary Inbox Strategy**: ✅ **Complete** (Updated API to trigger 'Joined Waitlist' event, allowing for event-based transactional flows)

### 🟢 Medium Priority (Operations & Polishing)
- [x] 6. **[ADMIN] CRM Professionalization**: ✅ **Complete** (Native browser `confirm()` alerts replaced with custom branded modals)
- [ ] 7. **[LEGAL] ICO Fee Verification**: Confirm registration status with the Information Commissioner's Office.
- [ ] 8. **[UX] Mobile App Readiness**: Final review of Capacitor configuration for future iOS/Android store submission.

---

## 3. Reference Data
- **Project URL**: [sportssigned.com](https://sportssigned.com)
- **Shop Password**: `LEGENDS26`
- **Primary Tech Stack**: React, Tailwind 4, Shopify Storefront API, Supabase.

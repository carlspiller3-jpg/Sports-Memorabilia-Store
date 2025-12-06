# PROJECT KNOWLEDGE FILE — The Sports Memorabilia Store

## 1. Project Overview
The Sports Memorabilia Store is a premium signed sports memorabilia brand. The focus is on authenticity, premium gifting experience, and craftsmanship-led presentation (Apple-style unboxing, museum-grade framing).

**Tech Stack:**
- React 19
- TailwindCSS v4
- shadcn/ui component library
- TypeScript
- Vite
- Supabase (database, file storage, authentication)
- GitHub repository
- Netlify hosting
- Browser-based routing (no Next.js)

**Shopify Integration Readiness:**
The system must be structurally prepared for future Shopify integration.
- Product data structures must follow Shopify product + variant hierarchy
- Inventory entries must be stored in a format suitable for eventual syncing
- Authentication and customer accounts should be built with portability in mind

---

## 2. Codebase Structure & Rules
This project uses a centralized "AI Workspace" folder (`/_aiwk`) to organize all non-application code and documentation.

**Directory Structure:**
- `/_aiwk`: **Central Repo Root**
  - `/docs`: All project documentation, guides, and knowledge files.
  - `/scripts`: Utility scripts, setup tools, and maintenance commands.
  - `/plans`: Implementation plans, TODOs, and architectural decisions.
  - `/tests`: Integration, fuzzy, and logic tests (excluding unit tests adjacent to source code).
  - `/logs`: Log files (ignored by git).

**Rules:**
- **No Orphaned Files:** Do not create random files in the project root.
- **Root Directory:** Should only contain standard config files (`package.json`, `vite.config.ts`, etc.) and the `src` folder.
- **New Artifacts:** Always place new plans, guides, or scripts in the appropriate `_aiwk` subdirectory.

---

## 2. Brand Identity & Style Guide
- **Logo:** Signature in a gold framed square, serif + sans typography.
- **Core Brand Concept:** Modern Heritage Luxury

**Color Palette:**
- **Primary Background:** Warm Ivory White (#F9F7F3)
- **Primary Text:** Charcoal Graphite (#2E2E2E)
- **Accent Highlight:** Champagne Gold (#C6A664) (used sparingly)
- **Secondary Support:** Slate Navy (#1C273A) (depth, backgrounds)
- **Neutral Support:** Stone Grey (#D9D5CD) (dividers, shadows)

**Typography:**
- **Headings:** Serif (elegant, premium)
- **Body Text:** Clean sans serif (legibility)
- **Signature mark:** Always isolated, never distorted

**Tone of Voice:**
- Calm, assured, premium
- Avoid hype language
- Use storytelling + provenance language

---

## 3. High-Level Market Overview
- **Market:** ~$26B+ global sports memorabilia market.
- **Key Forces:** Authenticity concerns, Gift market expansion, Shift to online communities, Athlete direct access.
- **Differentiation:** Premium gifting experience + narrative + authenticity.

---

## 4. ICPs — Ideal Customer Profiles
1.  **The Premium Gift Buyer:** Age 28–55, wants meaningful luxury gift, values presentation.
2.  **The Authentic Collector:** Age 25–60, understands signatures/provenance, values trust.
3.  **Corporate & Hospitality Buyers:** Bulk orders, frictionless procurement.

---

## 5. Low-Level Route to Market & Execution Plan
**Sales Funnels:**
1.  **Direct Product Drop:** Landing page → countdown → limited run release.
2.  **Occasion Gifting Flow:** Quiz → Suggest curated framed selections.
3.  **Corporate Order Inquiry:** Contact form → sales rep follow-up.

**Core Product Structure (Shopify Compatible):**
- **Product:** Name, Sport/Team/Athlete, Authentication Type, Certificate ID, Images, Description, Price.
- **Variants:** Frame Style, Edition Size.
- **Inventory:** SKU, Stock Qty, Warehouse Location.

**Proof-of-Signing & Authenticity Workflow:**
- Unique inventory entry per item.
- Serial number assigned.
- Digital COA generated (stored in Supabase).
- Customer receives Physical COA + Digital COA access.

---

## Executive Summary (Diagnosis Pack) Highlights
- **Positioning:** "Luxury gifting brand disguised as a memorabilia company."
- **Value Engine:** Luxury Framing, Proof of Signing, COA, Packaging Experience, Speed of Delivery (24-hour dispatch).
- **Sales Engine:** Attention (TikTok/Content) → Conversion (Lives/DMs) → Fulfilment.
- **Unit Economics:** High margin (~65-75% gross).
- **Operations:** 24-hour dispatch rule, Apple-style packaging, QC system.

---

## Brand & Product Architecture
- **Brand Doctrine:** "We create premium sports gifting experiences people are proud to give."
- **Product Lines:**
    1.  Framed Shirts (Flagship)
    2.  Framed Boots & Gloves (Mid-tier)
    3.  Framed Photos (Entry-level/Upsell)
- **Product Depth Strategy:** Deepen existing categories (better frames, exclusive signings) rather than adding random new products.

---

## Sales Engine Mechanics
- **Channels:** TikTok Lives (Primary), DM Conversion (Secondary), Website Sales (Passive), Corporate Gifting (High Ticket).
- **Live Selling:** Daily lives, "Showcase Loop", "Gifting Prompt", "One-to-Many Closing".
- **DM Conversion:** Speed wins, "Gift First" rule, G.R.I.P. framework.
- **AOV Multipliers:** Bundles, Premium Plaques, Occasion Cards.

---

## Operational Systems
- **Stock Room:** 6-zone system (Intake, Proof Library, Frame Prep, Finished Stock, Packaging, Returns).
- **Proof Management:** Naming standard (PLAYER_ITEMTYPE_DATE_VARIANT), 3-layer backup.
- **Packaging Flow:** 10-step quality flow (Clean station -> Dispatch confirmation).
- **Dispatch:** 24-hour dispatch, 2 daily windows.

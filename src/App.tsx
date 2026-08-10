
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { HelmetProvider, Helmet } from "react-helmet-async"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { HomePage } from "@/pages/HomePage"
import { VerifyPage } from "@/pages/VerifyPage"
import { ShopPage } from "@/pages/ShopPage"
import { ProductPage } from "@/pages/ProductPage"
import { CollectionsPage } from "@/pages/CollectionsPage"
import { DropsPage } from "@/pages/DropsPage"
import { DebugPage } from "./pages/DebugPage"
import { CartProvider } from "@/context/CartContext"
import { CartDrawer } from "@/components/cart/CartDrawer"
import { ChatWidget } from "@/components/chat/ChatWidget"
import { PrivacyPolicy } from "@/pages/legal/PrivacyPolicy"
import { TermsOfService } from "@/pages/legal/TermsOfService"
import { CookiePolicy } from "@/pages/legal/CookiePolicy"
import { RefundPolicy } from "@/pages/legal/RefundPolicy"
import { CookieConsent } from "@/components/layout/CookieConsent"
import { ShippingReturns } from "@/pages/support/ShippingReturns"
import { ContactPage } from "@/pages/support/ContactPage"
import { FAQPage } from "@/pages/support/FAQPage"
import { AboutPage } from "@/pages/AboutPage"
import { NotFoundPage } from "@/pages/NotFoundPage"
import { MobileNav } from "@/components/layout/MobileNav"
import { AuthProvider } from "@/context/AuthContext"
import { LoginPage } from "@/pages/LoginPage"
import { RegisterPage } from "@/pages/RegisterPage"
import { AccountPage } from "@/pages/AccountPage"
import { KnowledgeHubPage } from "@/pages/blog/KnowledgeHubPage"
import { ArticlePage } from "@/pages/blog/ArticlePage"
import { ShopGate } from "@/components/auth/ShopGate"
import { ScrollToTop } from "@/components/layout/ScrollToTop"
import { B2BProposal } from "@/pages/B2BProposal"
import { CRMPage } from "@/pages/admin/CRMPage"
import { InvoiceGenerator } from "@/pages/admin/InvoiceGenerator"
import { AssetGenerator } from "@/pages/admin/AssetGenerator"
import { SEOManager } from "@/pages/admin/SEOManager"
import { AIDebug } from "@/pages/admin/AIDebug"
import { NFCManager } from "@/pages/admin/NFCManager"
import { AdminDashboard } from "@/pages/admin/AdminDashboard"
import { AdminGate } from "@/components/auth/AdminGate"
import { AssetDemoPage } from "@/pages/AssetDemoPage"
import { SEOGeneratorPage } from "@/pages/admin/SEOGeneratorPage"
import { SocialGenerator } from "@/pages/admin/SocialGenerator"

function App() {
  // Configured check
  return (
    <HelmetProvider>
      <AuthProvider>
        <Helmet>
          <title>Sports Memorabilia Store | Authentic Signed Collectibles</title>
          <meta name="description" content="The global authority in 100% authentic sports memorabilia. Direct access to athletes, blockchain verified provenance, and luxury packaging." />
        </Helmet>
        <CartProvider>
          <Router>
            <ScrollToTop />
            <div className="min-h-screen bg-ivory text-charcoal font-sans selection:bg-gold/30 flex flex-col">
              <Header />
              <CartDrawer />
              <main className="flex-1 animate-fade-in pb-16 md:pb-0">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/home" element={<Navigate to="/" replace />} />
                  <Route path="/shop" element={
                    <ShopGate>
                      <ShopPage />
                    </ShopGate>
                  } />
                  <Route path="/shop/:category" element={
                    <ShopGate>
                      <ShopPage />
                    </ShopGate>
                  } />
                  <Route path="/drops" element={<DropsPage />} />
                  <Route path="/collections" element={
                    <ShopGate>
                      <CollectionsPage />
                    </ShopGate>
                  } />
                  <Route path="/product/:handle" element={
                    <ShopGate>
                      <ProductPage />
                    </ShopGate>
                  } />
                  <Route path="/verify" element={<VerifyPage />} />
                  <Route path="/verify/:tagId" element={<VerifyPage />} />
                  <Route path="/debug" element={<DebugPage />} />

                  {/* Account */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/account" element={<AccountPage />} />

                  {/* Legal & Support */}
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/cookies" element={<CookiePolicy />} />
                  <Route path="/terms" element={<TermsOfService />} />
                  <Route path="/refund-policy" element={<RefundPolicy />} />
                  <Route path="/shipping" element={<ShippingReturns />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/faq" element={<FAQPage />} />

                  {/* Knowledge Hub */}
                  <Route path="/hub" element={<KnowledgeHubPage />} />
                  <Route path="/hub/:slug" element={<ArticlePage />} />



                  {/* PDF Generation Routes */}
                  <Route path="/b2b-proposal" element={<B2BProposal />} />

                  {/* Internal Admin Tools */}
                  <Route path="/admin" element={<AdminGate><AdminDashboard /></AdminGate>} />
                  <Route path="/admin/crm" element={<AdminGate><CRMPage /></AdminGate>} />
                  <Route path="/admin/nfc" element={<AdminGate><NFCManager /></AdminGate>} />
                  <Route path="/admin/seo" element={<AdminGate><SEOManager /></AdminGate>} />
                  <Route path="/admin/invoice-generator" element={<AdminGate><InvoiceGenerator /></AdminGate>} />
                  <Route path="/admin/asset-generator" element={<AdminGate><AssetGenerator /></AdminGate>} />
                  <Route path="/admin/social-generator" element={<AdminGate><SocialGenerator /></AdminGate>} />
                  <Route path="/admin/ai-debug" element={<AdminGate><AIDebug /></AdminGate>} />
                  <Route path="/admin/seo-generator" element={<AdminGate><SEOGeneratorPage /></AdminGate>} />

                  <Route path="*" element={<NotFoundPage />} />

                  {/* Demo Routes */}
                  <Route path="/asset/demo" element={<AssetDemoPage />} />
                </Routes>
              </main>
              <Footer />
              <MobileNav />
              <ChatWidget />
              <CookieConsent />
            </div>
            <CartDrawer />
          </Router>
        </CartProvider>
      </AuthProvider>
    </HelmetProvider>
  )
}

export default App

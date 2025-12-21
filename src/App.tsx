
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { HelmetProvider, Helmet } from "react-helmet-async"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { HomePage } from "@/pages/HomePage"
import { VerifyPage } from "@/pages/VerifyPage"
import { ShopPage } from "@/pages/ShopPage"
import { ProductPage } from "@/pages/ProductPage"
import { CollectionsPage } from "@/pages/CollectionsPage"
import { CheckoutPage } from "./pages/CheckoutPage"
import { DebugPage } from "./pages/DebugPage"
import { CartProvider } from "@/context/CartContext"
import { CartDrawer } from "@/components/cart/CartDrawer"
import { ChatWidget } from "@/components/chat/ChatWidget"
import { PrivacyPolicy } from "@/pages/legal/PrivacyPolicy"
import { TermsOfService } from "@/pages/legal/TermsOfService"
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

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Helmet>
          <title>SportsSigned | Authentic Signed Memorabilia</title>
          <meta name="description" content="Premium signed sports memorabilia, authentically verified on the blockchain. Shop signed shirts, photos, and equipment from the world's greatest athletes." />
        </Helmet>
        <CartProvider>
          <Router>
            <div className="min-h-screen bg-ivory text-charcoal font-sans selection:bg-gold/30 flex flex-col">
              <Header />
              <CartDrawer />
              <main className="flex-1 animate-fade-in pb-16 md:pb-0">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/shop" element={
                    <ShopGate>
                      <ShopPage />
                    </ShopGate>
                  } />
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
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/debug" element={<DebugPage />} />

                  {/* Account */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/account" element={<AccountPage />} />

                  {/* Legal & Support */}
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<TermsOfService />} />
                  <Route path="/shipping" element={<ShippingReturns />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/faq" element={<FAQPage />} />

                  {/* Knowledge Hub */}
                  <Route path="/hub" element={<KnowledgeHubPage />} />
                  <Route path="/hub/:slug" element={<ArticlePage />} />

                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              <Footer />
              <MobileNav />
              <ChatWidget />
            </div>
            <CartDrawer />
          </Router>
        </CartProvider>
      </AuthProvider>
    </HelmetProvider>
  )
}

export default App


import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { HelmetProvider, Helmet } from "react-helmet-async"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { HomePage } from "@/pages/HomePage"
import { VerifyPage } from "@/pages/VerifyPage"
import { ShopPage } from "@/pages/ShopPage"
import { ProductPage } from "@/pages/ProductPage"
import { CollectionsPage } from "@/pages/CollectionsPage"
import { CheckoutPage } from "@/pages/CheckoutPage"
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
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/collections" element={<CollectionsPage />} /> {/* Added Collections route */}
                <Route path="/product/:handle" element={<ProductPage />} />
                <Route path="/verify" element={<VerifyPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />

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

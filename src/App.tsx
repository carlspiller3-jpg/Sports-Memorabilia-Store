import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { HelmetProvider, Helmet } from "react-helmet-async"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { HomePage } from "@/pages/HomePage"
import { VerifyPage } from "@/pages/VerifyPage"
import { ShopPage } from "@/pages/ShopPage"
import { ProductPage } from "@/pages/ProductPage"
import { CheckoutPage } from "@/pages/CheckoutPage"

function App() {
  return (
    <HelmetProvider>
      <Helmet>
        <title>The Sports Memorabilia Store | Authentic Signed Memorabilia</title>
        <meta name="description" content="Premium signed sports memorabilia, authentically verified on the blockchain. Shop signed shirts, photos, and equipment from the world's greatest athletes." />
      </Helmet>
      <Router>
        <div className="min-h-screen bg-ivory text-charcoal font-sans selection:bg-gold/30 flex flex-col">
          <Header />
          <main className="flex-1 animate-fade-in">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/product/:handle" element={<ProductPage />} />
              <Route path="/verify" element={<VerifyPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </HelmetProvider>
  )
}

export default App


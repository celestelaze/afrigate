import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './components/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Breadcrumb from './components/Breadcrumb'
import CookieBanner from './components/CookieBanner'
import SEOHead from './components/SEOHead'
import Home from './pages/Home'
import Transfer from './pages/Transfer'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Contact from './pages/Contact'
import Social from './pages/Social'
import FAQ from './pages/FAQ'
import NotFound from './pages/NotFound'

function Layout() {
  const { pathname } = useLocation()
  const noFooter = ['/login', '/signup'].includes(pathname)
  const isFullscreen = ['/login', '/signup', '/404'].includes(pathname)

  return (
    <>
      <SEOHead />
      <Navbar />
      {!isFullscreen && <Breadcrumb />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/transfer" element={<Transfer />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/social" element={<Social />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!noFooter && <Footer />}
      <CookieBanner />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </BrowserRouter>
  )
}

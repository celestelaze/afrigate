import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { AuthProvider } from './components/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Breadcrumb from './components/Breadcrumb'
import SEOHead from './components/SEOHead'
import Home from './pages/Home'
import Transfer from './pages/Transfer'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Contact from './pages/Contact'
import Social from './pages/Social'
import FAQ from './pages/FAQ'
import NotFound from './pages/NotFound'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import { PASSWORD_RESET_ENABLED } from './lib/constants'
import { INITIAL_URL, supabase } from './lib/supabase'

function Layout() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  // Un lien de réinitialisation qui arrive sur une autre page est renvoyé vers le bon écran
  useEffect(() => {
    if (PASSWORD_RESET_ENABLED && /type=recovery/.test(INITIAL_URL) && pathname !== '/reset-password') {
      // on attend que Supabase ait lu le jeton dans l'adresse avant de changer de page
      supabase.auth.getSession().then(() => navigate('/reset-password', { replace: true }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const noFooter = ['/login', '/signup', '/forgot-password', '/reset-password'].includes(pathname)
  const isFullscreen = ['/login', '/signup', '/forgot-password', '/reset-password', '/404'].includes(pathname)

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
          {PASSWORD_RESET_ENABLED && <Route path="/forgot-password" element={<ForgotPassword />} />}
          {PASSWORD_RESET_ENABLED && <Route path="/reset-password" element={<ResetPassword />} />}
          <Route path="/contact" element={<Contact />} />
          <Route path="/social" element={<Social />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!noFooter && <Footer />}
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

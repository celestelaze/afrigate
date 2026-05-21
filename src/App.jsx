import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { AuthProvider } from './components/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Transfer from './pages/Transfer'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Contact from './pages/Contact'
import Social from './pages/Social'

function Layout() {
  const { pathname } = useLocation()
  const noFooter = ['/login', '/signup'].includes(pathname)

  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/transfer" element={<Transfer />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/social" element={<Social />} />
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
        <SpeedInsights />
      </AuthProvider>
    </BrowserRouter>
  )
}

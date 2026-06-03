import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AdminProvider } from './hooks/useAdmin'
import { ToastProvider } from './hooks/useToast'
import { initQrGate, getRemainingMs } from './hooks/useQrGate'
import QrBlock from './pages/QrBlock'
import Admin from './pages/Admin'
import Main from './pages/Main'
import Menu from './pages/Menu'
import ProfileForm from './pages/ProfileForm'
import ProfileList from './pages/ProfileList'
import Restaurant from './pages/Restaurant'
import Guestbook from './pages/Guestbook'

export default function App() {
  const isAdmin = window.location.pathname === '/admin'
  const [allowed, setAllowed] = useState(() => isAdmin || initQrGate())

  useEffect(() => {
    if (!allowed || isAdmin) return
    const remaining = getRemainingMs()
    if (remaining <= 0) { setAllowed(false); return }
    const timer = setTimeout(() => setAllowed(false), remaining)
    return () => clearTimeout(timer)
  }, [allowed])

  if (!allowed) return <QrBlock />

  return (
    <AdminProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/"           element={<Main />} />
            <Route path="/menu"       element={<Menu />} />
            <Route path="/profile"    element={<ProfileForm />} />
            <Route path="/list"       element={<ProfileList />} />
            <Route path="/restaurant" element={<Restaurant />} />
            <Route path="/guestbook"  element={<Guestbook />} />
            <Route path="/admin"      element={<Admin />} />
            <Route path="*"           element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AdminProvider>
  )
}

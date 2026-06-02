import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AdminProvider } from './hooks/useAdmin'
import { ToastProvider } from './hooks/useToast'
import Main from './pages/Main'
import Menu from './pages/Menu'
import ProfileForm from './pages/ProfileForm'
import ProfileList from './pages/ProfileList'
import Restaurant from './pages/Restaurant'
import Guestbook from './pages/Guestbook'

export default function App() {
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
            <Route path="*"           element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AdminProvider>
  )
}

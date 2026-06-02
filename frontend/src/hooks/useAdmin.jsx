import { createContext, useContext, useState } from 'react'

const AdminContext = createContext(null)

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(false)

  const login = (token) => {
    sessionStorage.setItem('admin_token', token)
    setAdmin(true)
  }

  const logout = () => {
    sessionStorage.removeItem('admin_token')
    setAdmin(false)
  }

  return (
    <AdminContext.Provider value={{ admin, login, logout }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  return useContext(AdminContext)
}

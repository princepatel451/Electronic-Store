import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../api'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user')
      return stored && stored !== 'undefined' ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  // Synchronize and refresh profile on app load if token exists
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      api('/users/profile')
        .then((res) => {
          const u = res.user || res.data
          if (u) {
            localStorage.setItem('user', JSON.stringify(u))
            setUser(u)
          }
        })
        .catch(() => {
          // Token invalid or expired
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          setUser(null)
        })
    }
  }, [])

  const save = (data) => {
    const u = data.user || data.data
    if (data.token) localStorage.setItem('token', data.token)
    if (u) {
      localStorage.setItem('user', JSON.stringify(u))
      setUser(u)
    }
  }

  const login = async (body) => {
    const res = await api('/auth/login', { method: 'POST', body })
    save(res)
    return res
  }

  const register = async (body) => {
    const res = await api('/auth/register', { method: 'POST', body })
    save(res)
    return res
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const update = (updatedUser) => {
    localStorage.setItem('user', JSON.stringify(updatedUser))
    setUser(updatedUser)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, update }}>
      {children}
    </AuthContext.Provider>
  )
}

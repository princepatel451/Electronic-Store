import { createContext, useContext, useState } from 'react'
import { api } from '../api'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null')
    } catch {
      return null
    }
  })

  const save = (data) => {
    const u = data.user || data.data
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(u))
    setUser(u)
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

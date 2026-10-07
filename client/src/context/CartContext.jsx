import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { api, list } from '../api'
import { useAuth } from './AuthContext'

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [cart, setCart] = useState({ items: [] })

  const refresh = useCallback(async () => {
    if (!user) return setCart({ items: [] })
    try {
      const data = await api('/cart')
      const c = data.cart || data.data || data
      setCart({ ...c, items: list(c, 'items', 'products') })
    } catch {
      setCart({ items: [] })
    }
  }, [user])

  useEffect(() => {
    refresh()
  }, [refresh])

  const add = async (productId, quantity = 1) => {
    await api('/cart', { method: 'POST', body: { productId, quantity } })
    await refresh()
  }

  const setQty = async (productId, quantity) => {
    await api(`/cart/item/${productId}`, { method: 'PUT', body: { quantity } })
    await refresh()
  }

  const remove = async (productId) => {
    await api(`/cart/item/${productId}`, { method: 'DELETE' })
    await refresh()
  }

  const clear = async () => {
    await api('/cart/clear', { method: 'DELETE' })
    await refresh()
  }

  const count = (cart.items || []).reduce((sum, item) => sum + (item.quantity || 1), 0)
  const total = (cart.items || []).reduce((sum, item) => {
    const price = item.product?.price || item.price || 0
    return sum + (item.quantity || 1) * price
  }, 0)

  return (
    <CartContext.Provider value={{ cart, count, total, add, setQty, remove, clear, refresh }}>
      {children}
    </CartContext.Provider>
  )
}

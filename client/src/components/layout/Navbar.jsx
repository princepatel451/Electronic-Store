import { Link, NavLink } from 'react-router-dom'
import { useState } from 'react'
import { useAuth, useCart } from '../../context'

export function Navbar() {
  const { user, logout } = useAuth()
  const { count } = useCart()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/80 backdrop-blur-xl">
      <nav className="wrap flex h-14 items-center justify-between text-[13px]">
        <Link to="/" className="text-base font-semibold tracking-tight">Electro</Link>
        <div className="flex items-center gap-6 text-mute">
          <NavLink to="/products" className={({ isActive }) => `hover:text-ink transition ${isActive ? 'text-ink font-medium' : ''}`}>Shop</NavLink>
          <Link to="/cart" className="relative hover:text-ink transition">
            Bag
            {count > 0 && (
              <span className="ml-1 rounded-full bg-blue px-1.5 py-0.5 text-[10px] text-white">
                {count}
              </span>
            )}
          </Link>
          {user ? (
            <div className="relative">
              <button onClick={() => setOpen(!open)} className="hover:text-ink flex items-center gap-1 font-medium text-ink">
                {user.name?.split(' ')[0]}
              </button>
              {open && (
                <div onClick={() => setOpen(false)} className="absolute right-0 top-9 w-48 rounded-2xl border border-black/5 bg-white p-2 shadow-xl z-50">
                  <div className="px-3 py-2 border-b border-black/5 mb-1">
                    <p className="font-medium text-ink truncate">{user.name}</p>
                    <p className="text-xs text-mute truncate">{user.email}</p>
                  </div>
                  {[
                    ['/profile', 'Profile'],
                    ['/my-orders', 'My orders'],
                    ...(user.role === 'ADMIN' ? [['/admin/orders', 'Admin portal']] : [])
                  ].map(([to, label]) => (
                    <Link key={to} to={to} className="block rounded-lg px-3 py-2 text-ink hover:bg-snow transition">
                      {label}
                    </Link>
                  ))}
                  <button onClick={logout} className="block w-full rounded-lg px-3 py-2 text-left text-ink hover:bg-snow transition text-red-600">
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="hover:text-ink transition font-medium">Sign in</Link>
          )}
        </div>
      </nav>
    </header>
  )
}

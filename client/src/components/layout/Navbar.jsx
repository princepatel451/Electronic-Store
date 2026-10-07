import { Link, NavLink } from 'react-router-dom'
import { useState } from 'react'
import { useAuth, useCart } from '../../context'

export function Navbar() {
  const { user, logout } = useAuth()
  const { count } = useCart()
  const [open, setOpen] = useState(false)

  const isAdmin = user?.role === 'ADMIN'

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/80 backdrop-blur-xl">
      <nav className="wrap flex h-14 items-center justify-between text-[13px]">
        <Link to="/" className="text-base font-semibold tracking-tight flex items-center gap-2">
          <span>Electro</span>
          {isAdmin && (
            <span className="rounded-full bg-blue/10 px-2 py-0.5 text-[10px] font-bold text-blue uppercase tracking-wider">
              Admin
            </span>
          )}
        </Link>

        <div className="flex items-center gap-5 text-mute">
          <NavLink
            to="/products"
            className={({ isActive }) => `hover:text-ink transition ${isActive ? 'text-ink font-medium' : ''}`}
          >
            Shop
          </NavLink>

          <Link to="/cart" className="relative hover:text-ink transition">
            Bag
            {count > 0 && (
              <span className="ml-1 rounded-full bg-blue px-1.5 py-0.5 text-[10px] text-white">
                {count}
              </span>
            )}
          </Link>

          {isAdmin && (
            <NavLink
              to="/admin/orders"
              className={({ isActive }) =>
                `rounded-full px-3 py-1 text-xs font-semibold transition ${
                  isActive
                    ? 'bg-ink text-white'
                    : 'bg-snow text-ink hover:bg-neutral-200'
                }`
              }
            >
              Admin Portal
            </NavLink>
          )}

          {user ? (
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="hover:text-ink flex items-center gap-1.5 font-medium text-ink bg-snow px-3 py-1 rounded-full text-xs"
              >
                <span>{user.name?.split(' ')[0]}</span>
                <span className="text-[10px] text-mute">▾</span>
              </button>

              {open && (
                <div
                  onClick={() => setOpen(false)}
                  className="absolute right-0 top-9 w-52 rounded-2xl border border-black/5 bg-white p-2 shadow-xl z-50"
                >
                  <div className="px-3 py-2 border-b border-black/5 mb-1">
                    <p className="font-medium text-ink truncate text-sm">{user.name}</p>
                    <p className="text-xs text-mute truncate">{user.email}</p>
                    <div className="mt-1">
                      <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        isAdmin ? 'bg-blue/10 text-blue' : 'bg-neutral-100 text-neutral-600'
                      }`}>
                        Role: {user.role || 'USER'}
                      </span>
                    </div>
                  </div>

                  {isAdmin && (
                    <div className="border-b border-black/5 pb-1 mb-1">
                      <p className="px-3 py-1 text-[10px] font-semibold text-mute uppercase tracking-wider">Admin Controls</p>
                      <Link to="/admin/orders" className="block rounded-lg px-3 py-1.5 text-xs text-ink hover:bg-snow font-medium">
                        Orders Management
                      </Link>
                      <Link to="/admin/products" className="block rounded-lg px-3 py-1.5 text-xs text-ink hover:bg-snow font-medium">
                        Products & Categories
                      </Link>
                      <Link to="/admin/users" className="block rounded-lg px-3 py-1.5 text-xs text-ink hover:bg-snow font-medium">
                        Users Management
                      </Link>
                    </div>
                  )}

                  <Link to="/profile" className="block rounded-lg px-3 py-2 text-xs text-ink hover:bg-snow">
                    My Profile
                  </Link>
                  <Link to="/my-orders" className="block rounded-lg px-3 py-2 text-xs text-ink hover:bg-snow">
                    My Orders
                  </Link>

                  <button
                    onClick={logout}
                    className="block w-full rounded-lg px-3 py-2 text-left text-xs text-red-600 hover:bg-snow transition font-medium mt-1 border-t border-black/5"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="hover:text-ink transition font-medium text-xs bg-ink text-white px-4 py-1.5 rounded-full">
              Sign in
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}

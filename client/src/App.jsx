import { Routes, Route } from 'react-router-dom'
import { Navbar, Footer, ProtectedRoute, AdminRoute } from './components'
import {
  HomePage,
  ShopPage,
  ProductDetailsPage,
  LoginPage
} from './pages/public'
import {
  CartPage,
  CheckoutPage,
  OrderDetailsPage,
  MyOrdersPage,
  ProfilePage
} from './pages/customer'
import {
  AdminOrdersPage,
  AdminProductsPage,
  AdminUsersPage
} from './pages/admin'

export default function App() {
  return (
    <>
      <Navbar />
      <main className="min-h-[70vh]">
        <Routes>
          {/* Public Storefront Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ShopPage />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<LoginPage register />} />
          <Route path="/cart" element={<CartPage />} />

          {/* Authenticated Customer Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/orders/:id" element={<OrderDetailsPage />} />
            <Route path="/my-orders" element={<MyOrdersPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Admin Portal Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin/orders" element={<AdminOrdersPage />} />
            <Route path="/admin/products" element={<AdminProductsPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
          </Route>

          {/* 404 Fallback */}
          <Route
            path="*"
            element={
              <div className="wrap py-32 text-center text-mute">
                <h2 className="text-3xl font-semibold text-ink mb-2">404</h2>
                <p>This page doesn’t exist.</p>
              </div>
            }
          />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

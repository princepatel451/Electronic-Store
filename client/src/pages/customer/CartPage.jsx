import { Link, useNavigate } from 'react-router-dom'
import { money, img } from '../../api'
import { useAuth, useCart } from '../../context'
import { Title } from '../../components'

export function CartPage() {
  const { cart, total, setQty, remove, clear } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  if (!user) {
    return (
      <div className="py-32 text-center">
        <p className="text-2xl font-semibold">Sign in to see your bag.</p>
        <Link to="/login" state={{ from: '/cart' }} className="btn mt-6">
          Sign in
        </Link>
      </div>
    )
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="py-32 text-center">
        <p className="text-2xl font-semibold">Your bag is empty.</p>
        <Link to="/products" className="btn mt-6">
          Continue shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="wrap max-w-3xl py-12">
      <Title>Review your bag.</Title>

      <div className="divide-y divide-black/5">
        {cart.items.map((item) => {
          const product = item.product || item
          const productId = product._id || product.id
          const itemPrice = product.price || item.price || 0
          const itemImg = img(product)

          return (
            <div key={item._id || productId} className="flex items-center gap-5 py-5">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-snow p-2 shrink-0">
                {itemImg ? (
                  <img src={itemImg} alt="" className="max-h-full max-w-full object-contain" />
                ) : (
                  <div className="h-12 w-12 rounded-xl bg-white/70" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-ink truncate">{product.name}</p>
                <p className="text-xs text-mute mt-0.5">{money(itemPrice)} each</p>
                <button
                  onClick={() => remove(productId)}
                  className="mt-2 text-sm text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>

              <div className="flex items-center gap-3 rounded-full bg-snow px-3 py-1">
                <button
                  aria-label="Decrease"
                  disabled={item.quantity <= 1}
                  onClick={() => setQty(productId, item.quantity - 1)}
                  className="px-1 disabled:opacity-30 hover:text-blue"
                >
                  −
                </button>
                <span className="w-5 text-center text-sm font-medium">{item.quantity}</span>
                <button
                  aria-label="Increase"
                  onClick={() => setQty(productId, item.quantity + 1)}
                  className="px-1 hover:text-blue"
                >
                  +
                </button>
              </div>

              <p className="w-24 text-right font-semibold text-ink">
                {money(itemPrice * item.quantity)}
              </p>
            </div>
          )
        })}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-black/5 pt-6">
        <button onClick={clear} className="text-sm text-mute hover:text-red-600 transition">
          Clear bag
        </button>
        <div className="text-right">
          <p className="text-xs text-mute">Subtotal</p>
          <p className="text-2xl font-semibold text-ink">{money(total)}</p>
        </div>
      </div>

      <button
        onClick={() => navigate('/checkout')}
        className="btn mt-8 w-full py-3.5 text-base"
      >
        Proceed to checkout
      </button>
    </div>
  )
}

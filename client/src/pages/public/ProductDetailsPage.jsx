import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { api, list, money } from '../../api'
import { useAuth, useCart } from '../../context'
import { Msg, Loading } from '../../components'

export function ProductDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { add } = useCart()

  const [res, setRes] = useState(null)
  const [reviews, setReviews] = useState([])
  const [activeImage, setActiveImage] = useState(0)
  const [form, setForm] = useState({ rating: 5, comment: '' })
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(true)

  const loadData = () => {
    setLoading(true)
    Promise.all([
      api('/products/' + id).catch(() => null),
      api('/reviews/product/' + id).catch(() => ({ reviews: [] }))
    ]).then(([prodData, revData]) => {
      setRes(prodData)
      setReviews(list(revData, 'reviews'))
      setLoading(false)
    })
  }

  useEffect(() => {
    loadData()
  }, [id])

  if (loading || !res) return <Loading />

  const product = res.product || res.data || res
  const images = (product.images || []).map(i => i.url || i)
  const stock = product.stock ?? 0

  const handleAddToCart = async () => {
    if (!user) {
      return navigate('/login', { state: { from: `/products/${id}` } })
    }
    try {
      await add(product._id)
      navigate('/cart')
    } catch (e) {
      setMsg(e.message)
    }
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    try {
      await api('/reviews', {
        method: 'POST',
        body: { productId: id, ...form }
      })
      setForm({ rating: 5, comment: '' })
      setMsg('')
      // Refresh reviews & product to get updated rating
      loadData()
    } catch (er) {
      setMsg(er.message)
    }
  }

  return (
    <div className="wrap py-12">
      <div className="grid gap-12 md:grid-cols-2">
        {/* Product Images */}
        <div>
          <div className="flex h-96 items-center justify-center rounded-3xl bg-snow p-8 overflow-hidden">
            {images[activeImage] ? (
              <img
                src={images[activeImage]}
                alt={product.name}
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <div className="h-40 w-40 rounded-3xl bg-white flex items-center justify-center text-mute text-sm">
                No Image Available
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
              {images.map((imgSrc, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`h-16 w-16 shrink-0 rounded-xl bg-snow p-2 transition ${i === activeImage ? 'ring-2 ring-blue' : 'opacity-70 hover:opacity-100'}`}
                >
                  <img src={imgSrc} alt="" className="h-full w-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div>
          <p className="text-sm uppercase tracking-wider text-mute">{product.brand}</p>
          <h1 className="mt-1 text-4xl font-semibold text-ink">{product.name}</h1>
          <p className="mt-4 text-3xl font-semibold">{money(product.price)}</p>

          <div className="mt-2 flex items-center gap-2">
            <span className={`text-sm font-medium ${stock > 0 ? 'text-green-700' : 'text-red-600'}`}>
              {stock > 0 ? (stock < 5 ? `Only ${stock} left in stock` : 'In stock') : 'Out of stock'}
            </span>
            {product.rating > 0 && (
              <span className="text-sm text-mute">
                · ★ {product.rating} ({product.numReviews} reviews)
              </span>
            )}
          </div>

          <p className="mt-6 text-mute leading-relaxed">{product.description}</p>

          <Msg>{msg}</Msg>

          <button
            onClick={handleAddToCart}
            disabled={stock < 1}
            className="btn mt-8 w-full py-3.5 text-base"
          >
            {stock > 0 ? 'Add to bag' : 'Out of stock'}
          </button>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="mt-24 max-w-2xl border-t border-black/5 pt-12">
        <h2 className="text-3xl font-semibold">Customer reviews</h2>

        <div className="mt-6 space-y-4">
          {reviews.length === 0 && (
            <p className="text-mute">No reviews yet. Be the first to share your thoughts.</p>
          )}
          {reviews.map((r, i) => (
            <div key={r._id || i} className="card">
              <p className="text-sm font-medium">
                {'★'.repeat(r.rating)}
                <span className="text-neutral-300">{'★'.repeat(5 - r.rating)}</span>
                <span className="ml-2 text-mute">{r.user?.name || 'Customer'}</span>
              </p>
              <p className="mt-2 text-ink">{r.comment}</p>
            </div>
          ))}
        </div>

        {user ? (
          <form onSubmit={handleReviewSubmit} className="mt-8 space-y-3">
            <h3 className="font-semibold text-lg">Leave a review</h3>
            <select
              className="input"
              value={form.rating}
              onChange={e => setForm({ ...form, rating: Number(e.target.value) })}
            >
              {[5, 4, 3, 2, 1].map(n => (
                <option key={n} value={n}>{n} stars</option>
              ))}
            </select>
            <textarea
              className="input"
              rows="3"
              required
              placeholder="Share your experience with this product..."
              value={form.comment}
              onChange={e => setForm({ ...form, comment: e.target.value })}
            />
            <button className="btn">Submit review</button>
          </form>
        ) : (
          <p className="mt-6 text-sm text-mute">
            <Link to="/login" className="text-blue">Sign in</Link> to write a review.
          </p>
        )}
      </section>
    </div>
  )
}

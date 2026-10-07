import { Link } from 'react-router-dom'
import { money, img } from '../../api'

export function ProductCard({ p }) {
  const imageUrl = img(p)
  const id = p._id || p.id

  return (
    <Link
      to={`/products/${id}`}
      className="group flex flex-col rounded-3xl bg-snow p-6 transition duration-200 hover:scale-[1.02] hover:shadow-sm"
    >
      <div className="flex h-52 items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={p.name}
            className="max-h-full max-w-full object-contain transition duration-200 group-hover:scale-105"
          />
        ) : (
          <div className="h-24 w-24 rounded-2xl bg-white/70 flex items-center justify-center text-xs text-mute">
            No Image
          </div>
        )}
      </div>
      <p className="mt-4 text-xs font-medium uppercase tracking-wider text-mute">{p.brand || 'Electro'}</p>
      <h3 className="text-lg font-semibold text-ink group-hover:text-blue transition">{p.name}</h3>
      <p className="mt-1 text-sm text-mute">From {money(p.price)}</p>
    </Link>
  )
}

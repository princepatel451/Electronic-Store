import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, list } from '../../api'
import { ProductCard, Loading } from '../../components'

export function HomePage() {
  const [cats, setCats] = useState(null)
  const [prods, setProds] = useState(null)

  useEffect(() => {
    api('/category').then(setCats).catch(() => setCats({ categories: [] }))
    api('/products?limit=8&sort=rating').then(setProds).catch(() => setProds({ products: [] }))
  }, [])

  return (
    <>
      <section className="bg-snow py-24 text-center">
        <div className="wrap">
          <h1 className="text-5xl font-semibold md:text-7xl">Electronics, refined.</h1>
          <p className="mx-auto mt-4 max-w-xl text-xl text-mute">
            Phones, laptops, and audio gadgets curated for performance, aesthetics, and everyday reliability.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link to="/products" className="btn">Shop now</Link>
            <Link to="/products?sort=rating" className="btn-ghost">Top rated</Link>
          </div>
        </div>
      </section>

      <section className="wrap mt-20">
        <h2 className="mb-6 text-3xl font-semibold">Shop by category</h2>
        <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2">
          {list(cats, 'categories').map(c => (
            <Link
              key={c._id}
              to={`/products?category=${c._id}`}
              className="card flex h-36 w-56 shrink-0 items-end text-lg font-semibold hover:scale-[1.02] transition"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="wrap mt-20">
        <h2 className="mb-6 text-3xl font-semibold">Top rated electronics</h2>
        {!prods ? (
          <Loading />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {list(prods, 'products').map(p => (
              <ProductCard key={p._id} p={p} />
            ))}
          </div>
        )}
      </section>

      <section className="wrap mt-20">
        <div className="rounded-3xl bg-ink px-8 py-16 text-center text-white">
          <h2 className="text-4xl font-semibold">Free delivery over ₹999.</h2>
          <p className="mt-2 text-white/70">Genuine products, hassle-free warranty, and quick 7-day returns.</p>
          <Link to="/products" className="btn mt-6">See deals</Link>
        </div>
      </section>
    </>
  )
}

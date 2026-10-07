import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api, list, money } from '../../api'
import { ProductCard, Msg, Loading } from '../../components'

export function ShopPage() {
  const [sp, setSp] = useSearchParams()
  const [page, setPage] = useState(1)
  const q = Object.fromEntries(sp)

  const [cats, setCats] = useState(null)
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  useEffect(() => {
    api('/category').then(setCats).catch(() => setCats({ categories: [] }))
  }, [])

  const qs = new URLSearchParams({ ...q, page, limit: 12 }).toString()

  useEffect(() => {
    setRes(null)
    setErr('')
    api('/products?' + qs)
      .then(setRes)
      .catch(e => setErr(e.message))
  }, [qs])

  const setFilter = (k, v) => {
    const next = new URLSearchParams(sp)
    if (v) next.set(k, v)
    else next.delete(k)
    setSp(next)
    setPage(1)
  }

  const pages = res?.pagination?.totalPages || res?.totalPages || res?.pages || 1

  return (
    <div className="wrap py-12">
      <h1 className="text-4xl font-semibold md:text-5xl">Shop</h1>

      <div className="mt-8 grid gap-3 md:grid-cols-4">
        <input
          className="input md:col-span-2"
          placeholder="Search products by title or brand..."
          defaultValue={q.search || ''}
          onKeyDown={e => e.key === 'Enter' && setFilter('search', e.target.value)}
        />
        <input
          className="input"
          placeholder="Filter by Brand"
          defaultValue={q.brand || ''}
          onBlur={e => setFilter('brand', e.target.value)}
          onKeyDown={e => e.key === 'Enter' && setFilter('brand', e.target.value)}
        />
        <select
          className="input"
          value={q.sort || ''}
          onChange={e => setFilter('sort', e.target.value)}
        >
          <option value="">Featured</option>
          <option value="rating">Top rated</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setFilter('category', '')}
          className={`rounded-full px-4 py-1.5 text-sm transition ${!q.category ? 'bg-ink text-white' : 'bg-snow hover:bg-neutral-200'}`}
        >
          All
        </button>
        {list(cats, 'categories').map(c => (
          <button
            key={c._id}
            onClick={() => setFilter('category', c._id)}
            className={`rounded-full px-4 py-1.5 text-sm transition ${q.category === c._id ? 'bg-ink text-white' : 'bg-snow hover:bg-neutral-200'}`}
          >
            {c.name}
          </button>
        ))}

        <div className="ml-auto flex items-center gap-2 text-sm text-mute">
          Up to {money(q.maxPrice || 200000)}
          <input
            type="range"
            min="0"
            max="200000"
            step="1000"
            defaultValue={q.maxPrice || 200000}
            onMouseUp={e => setFilter('maxPrice', e.target.value)}
            onTouchEnd={e => setFilter('maxPrice', e.target.value)}
          />
        </div>
      </div>

      <Msg>{err}</Msg>

      {!res ? (
        <Loading />
      ) : list(res, 'products').length === 0 ? (
        <p className="py-24 text-center text-mute">No products match your filter. Try clearing a filter.</p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {list(res, 'products').map(p => (
            <ProductCard key={p._id} p={p} />
          ))}
        </div>
      )}

      {pages > 1 && (
        <div className="mt-10 flex justify-center gap-3">
          <button
            className="btn-ghost"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>
          <span className="py-2.5 text-sm text-mute">Page {page} of {pages}</span>
          <button
            className="btn-ghost"
            disabled={page >= pages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

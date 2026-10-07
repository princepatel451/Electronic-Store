import { useEffect, useState } from 'react'
import { api, list, money } from '../../api'
import { Field, Msg, Loading } from '../../components'
import { AdminShell, AdminTable } from './AdminShell'

const initialProduct = {
  name: '',
  brand: 'Samsung',
  price: '',
  stock: 10,
  category: '',
  images: '',
  description: ''
}

export function AdminProductsPage() {
  const [products, setProducts] = useState(null)
  const [categories, setCategories] = useState(null)
  const [editing, setEditing] = useState(null)
  const [newCategory, setNewCategory] = useState('')
  const [err, setErr] = useState('')
  const [formErr, setFormErr] = useState('')

  // Samsung Import Modal State
  const [showSamsungModal, setShowSamsungModal] = useState(false)
  const [samsungUrl, setSamsungUrl] = useState('')
  const [markupPercent, setMarkupPercent] = useState('10')
  const [samsungCategory, setSamsungCategory] = useState('')
  const [samsungPreview, setSamsungPreview] = useState(null)
  const [samsungLoading, setSamsungLoading] = useState(false)
  const [samsungErr, setSamsungErr] = useState('')

  const loadData = () => {
    api('/products?limit=100')
      .then(r => setProducts(list(r, 'products')))
      .catch(e => { setErr(e.message); setProducts([]) })

    api('/category')
      .then(r => setCategories(list(r, 'category', 'categories')))
      .catch(() => setCategories([]))
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSaveProduct = async (e) => {
    e.preventDefault()
    setFormErr('')

    const body = {
      name: editing.name,
      brand: editing.brand || 'Samsung',
      price: Number(editing.price),
      stock: Number(editing.stock),
      category: editing.category,
      description: editing.description,
      images: typeof editing.images === 'string'
        ? editing.images.split(',').map(s => s.trim()).filter(Boolean)
        : editing.images
    }

    try {
      if (editing._id) {
        await api('/products/' + editing._id, { method: 'PUT', body })
      } else {
        await api('/products/create-product', { method: 'POST', body })
      }
      setEditing(null)
      loadData()
    } catch (er) {
      setFormErr(er.message)
    }
  }

  const handleDeleteProduct = async (product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      try {
        await api('/products/' + product._id, { method: 'DELETE' })
        loadData()
      } catch (e) {
        setErr(e.message)
      }
    }
  }

  const handleAddCategory = async (e) => {
    e.preventDefault()
    try {
      await api('/category/create-category', {
        method: 'POST',
        body: { name: newCategory }
      })
      setNewCategory('')
      api('/category')
        .then(r => setCategories(list(r, 'category', 'categories')))
    } catch (er) {
      setErr(er.message)
    }
  }

  // Fetch live preview of Samsung product
  const handlePreviewSamsung = async (e) => {
    e.preventDefault()
    if (!samsungUrl.trim()) return
    setSamsungErr('')
    setSamsungLoading(true)

    try {
      const res = await api('/products/preview-samsung', {
        method: 'POST',
        body: { url: samsungUrl.trim() }
      })
      setSamsungPreview(res.preview)
    } catch (err) {
      setSamsungErr(err.message)
    } finally {
      setSamsungLoading(false)
    }
  }

  // Import Samsung product into store
  const handleImportSamsung = async () => {
    if (!samsungUrl.trim()) return
    setSamsungErr('')
    setSamsungLoading(true)

    try {
      await api('/products/import-samsung', {
        method: 'POST',
        body: {
          url: samsungUrl.trim(),
          markupPercentage: Number(markupPercent) || 0,
          categoryId: samsungCategory || undefined
        }
      })
      setShowSamsungModal(false)
      setSamsungUrl('')
      setSamsungPreview(null)
      loadData()
    } catch (err) {
      setSamsungErr(err.message)
    } finally {
      setSamsungLoading(false)
    }
  }

  if (!products) return <Loading />

  return (
    <AdminShell title="Products & Categories">
      {/* Action Toolbar */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <button
          className="btn"
          onClick={() => setEditing(initialProduct)}
        >
          Add Product
        </button>

        <button
          className="btn-ghost flex items-center gap-2 border-black/20 text-ink hover:border-blue hover:text-blue"
          onClick={() => {
            setShowSamsungModal(true)
            setSamsungErr('')
            setSamsungPreview(null)
          }}
        >
          <span className="h-2 w-2 rounded-full bg-blue animate-pulse"></span>
          Import from Samsung.com
        </button>

        <form onSubmit={handleAddCategory} className="ml-auto flex gap-2">
          <input
            className="input w-48"
            placeholder="New Category Name"
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            required
          />
          <button className="btn-ghost">Add Category</button>
        </form>
      </div>

      <div className="mb-4 flex flex-wrap gap-2 text-xs text-mute items-center">
        <span className="font-medium text-ink">Categories:</span>
        {(categories || []).map(c => (
          <span key={c._id} className="bg-snow px-2.5 py-1 rounded-full">{c.name}</span>
        ))}
      </div>

      <Msg>{err}</Msg>

      <AdminTable head={['Product', 'Source', 'Price', 'Stock', 'Actions']}>
        {products.length === 0 ? (
          <tr>
            <td colSpan={5} className="py-8 text-center text-mute">
              No products found.
            </td>
          </tr>
        ) : (
          products.map(p => {
            const isSamsung = p.supplier?.source === 'SAMSUNG' || p.brand?.toLowerCase() === 'samsung'
            return (
              <tr key={p._id} className="hover:bg-snow/50 transition">
                <td className="px-4 py-3">
                  <p className="font-semibold text-ink">{p.name}</p>
                  <p className="text-xs text-mute">{p.brand} {p.supplier?.modelCode ? `· ${p.supplier.modelCode}` : ''}</p>
                </td>
                <td className="px-4 text-xs">
                  {isSamsung ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue/10 px-2.5 py-0.5 font-medium text-blue">
                      Samsung Store
                    </span>
                  ) : (
                    <span className="text-mute">Direct</span>
                  )}
                </td>
                <td className="px-4 font-medium">
                  {money(p.price)}
                  {p.supplier?.originalPrice > 0 && p.supplier.originalPrice !== p.price && (
                    <span className="block text-[11px] text-mute line-through">
                      Orig: {money(p.supplier.originalPrice)}
                    </span>
                  )}
                </td>
                <td className="px-4">
                  <span className={`px-2 py-0.5 rounded text-xs ${p.stock > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {p.stock} in stock
                  </span>
                </td>
                <td className="px-4 text-right">
                  {p.supplier?.originalUrl && (
                    <a
                      href={p.supplier.originalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mr-3 text-xs text-mute hover:text-ink hover:underline"
                    >
                      View Source
                    </a>
                  )}
                  <button
                    className="mr-3 text-blue hover:underline"
                    onClick={() => setEditing({
                      ...p,
                      category: p.category?._id || p.category || '',
                      images: (p.images || []).map(i => i.url || i).join(', ')
                    })}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleDeleteProduct(p)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )
          })
        )}
      </AdminTable>

      {/* Samsung Product Importer Modal */}
      {showSamsungModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={() => setShowSamsungModal(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-xl space-y-4 overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-black/5 pb-3">
              <div>
                <h2 className="text-2xl font-semibold text-ink">Import from Samsung.com</h2>
                <p className="text-xs text-mute mt-0.5">Scrapes product details, gallery, and specs directly from the official link.</p>
              </div>
              <button
                onClick={() => setShowSamsungModal(false)}
                className="text-mute hover:text-ink text-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePreviewSamsung} className="space-y-3">
              <label className="block text-sm">
                <span className="mb-1 block font-medium text-ink">Samsung Product URL</span>
                <div className="flex gap-2">
                  <input
                    type="url"
                    required
                    placeholder="https://www.samsung.com/in/smartphones/galaxy-s24-ultra/buy/"
                    className="input flex-1 text-xs"
                    value={samsungUrl}
                    onChange={e => setSamsungUrl(e.target.value)}
                  />
                  <button
                    disabled={samsungLoading}
                    type="submit"
                    className="btn px-4 text-xs shrink-0"
                  >
                    {samsungLoading ? 'Scraping…' : 'Fetch Info'}
                  </button>
                </div>
              </label>
            </form>

            <Msg>{samsungErr}</Msg>

            {/* Live Scraped Preview */}
            {samsungPreview && (
              <div className="rounded-2xl border border-black/10 bg-snow p-4 space-y-3">
                <div className="flex gap-4">
                  {samsungPreview.images?.[0] ? (
                    <img
                      src={samsungPreview.images[0]}
                      alt={samsungPreview.name}
                      className="h-20 w-20 rounded-xl bg-white object-contain p-1 border border-black/5"
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-xl bg-white flex items-center justify-center text-xs text-mute">
                      Samsung
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-ink text-base truncate">{samsungPreview.name}</h3>
                    {samsungPreview.modelCode && (
                      <p className="text-xs text-mute">Model Code: <span className="font-mono">{samsungPreview.modelCode}</span></p>
                    )}
                    <p className="text-sm font-semibold text-ink mt-1">
                      Samsung Listed Price: {samsungPreview.price > 0 ? money(samsungPreview.price) : 'Check on store'}
                    </p>
                    <p className="text-xs text-mute mt-1 line-clamp-2">{samsungPreview.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-black/5">
                  <label className="block text-xs">
                    <span className="mb-1 block text-mute">Profit Markup (% added)</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="input py-2 text-xs"
                      value={markupPercent}
                      onChange={e => setMarkupPercent(e.target.value)}
                    />
                  </label>

                  <label className="block text-xs">
                    <span className="mb-1 block text-mute">Target Category</span>
                    <select
                      className="input py-2 text-xs"
                      value={samsungCategory}
                      onChange={e => setSamsungCategory(e.target.value)}
                    >
                      <option value="">Auto-detect / Smart Devices</option>
                      {(categories || []).map(c => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                  </label>
                </div>

                {samsungPreview.price > 0 && (
                  <p className="text-xs text-ink font-medium bg-white/70 p-2 rounded-lg">
                    Final Store Price: <span className="text-blue font-bold text-sm">
                      {money(Math.round(samsungPreview.price * (1 + (Number(markupPercent) || 0) / 100)))}
                    </span>
                    {Number(markupPercent) > 0 && ` (+${markupPercent}% profit)`}
                  </p>
                )}

                <button
                  disabled={samsungLoading}
                  onClick={handleImportSamsung}
                  className="btn w-full py-3 text-sm"
                >
                  {samsungLoading ? 'Importing…' : 'Add to My Store'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Manual Edit / Add Modal */}
      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={() => setEditing(null)}
        >
          <form
            onClick={e => e.stopPropagation()}
            onSubmit={handleSaveProduct}
            className="max-h-[90vh] w-full max-w-lg space-y-3 overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl"
          >
            <h2 className="text-2xl font-semibold">
              {editing._id ? 'Edit Product' : 'Add New Product'}
            </h2>

            <Field
              label="Product Title"
              required
              value={editing.name}
              onChange={e => setEditing({ ...editing, name: e.target.value })}
            />
            <Field
              label="Brand"
              required
              value={editing.brand}
              onChange={e => setEditing({ ...editing, brand: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-4">
              <Field
                label="Price (₹)"
                type="number"
                min="0"
                required
                value={editing.price}
                onChange={e => setEditing({ ...editing, price: e.target.value })}
              />
              <Field
                label="Stock Count"
                type="number"
                min="0"
                required
                value={editing.stock}
                onChange={e => setEditing({ ...editing, stock: e.target.value })}
              />
            </div>

            <label className="block text-sm">
              <span className="mb-1 block text-mute">Category</span>
              <select
                required
                className="input"
                value={editing.category}
                onChange={e => setEditing({ ...editing, category: e.target.value })}
              >
                <option value="">Select a category</option>
                {(categories || []).map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </label>

            <Field
              label="Image URLs (comma separated)"
              value={editing.images}
              onChange={e => setEditing({ ...editing, images: e.target.value })}
            />

            <label className="block text-sm">
              <span className="mb-1 block text-mute">Description</span>
              <textarea
                className="input"
                rows="3"
                value={editing.description || ''}
                onChange={e => setEditing({ ...editing, description: e.target.value })}
              />
            </label>

            <Msg>{formErr}</Msg>

            <div className="flex gap-3 pt-2">
              <button className="btn flex-1">Save Product</button>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setEditing(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminShell>
  )
}

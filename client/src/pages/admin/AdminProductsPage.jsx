import { useEffect, useState } from 'react'
import { api, list, money } from '../../api'
import { Field, Msg, Loading } from '../../components'
import { AdminShell, AdminTable } from './AdminShell'

const initialProduct = {
  name: '',
  brand: '',
  price: '',
  stock: '',
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
      brand: editing.brand,
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

      <AdminTable head={['Product', 'Category', 'Price', 'Stock', 'Actions']}>
        {products.length === 0 ? (
          <tr>
            <td colSpan={5} className="py-8 text-center text-mute">
              No products found.
            </td>
          </tr>
        ) : (
          products.map(p => (
            <tr key={p._id} className="hover:bg-snow/50 transition">
              <td className="px-4 py-3">
                <p className="font-semibold text-ink">{p.name}</p>
                <p className="text-xs text-mute">{p.brand}</p>
              </td>
              <td className="px-4 text-mute text-xs">
                {p.category?.name || 'Unassigned'}
              </td>
              <td className="px-4 font-medium">{money(p.price)}</td>
              <td className="px-4">
                <span className={`px-2 py-0.5 rounded text-xs ${p.stock > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {p.stock} in stock
                </span>
              </td>
              <td className="px-4 text-right">
                <button
                  className="mr-4 text-blue hover:underline"
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
          ))
        )}
      </AdminTable>

      {/* Edit / Add Modal */}
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

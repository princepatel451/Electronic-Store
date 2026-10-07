import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api'
import { useAuth } from '../../context'
import { Field, Msg, Title } from '../../components'

export function ProfilePage() {
  const { user, update } = useAuth()
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  })
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSave = async (e) => {
    e.preventDefault()
    setErr('')
    setMsg('')

    if (form.password && form.password.length < 6) {
      return setErr('Password must be at least 6 characters.')
    }

    setSaving(true)
    try {
      const body = {
        name: form.name,
        email: form.email,
        ...(form.password && { password: form.password })
      }
      const data = await api('/users/profile', { method: 'PUT', body })
      const updated = data.user || data.data || { ...user, ...body }
      update(updated)
      setForm({ ...form, password: '' })
      setMsg('Profile updated successfully.')
    } catch (er) {
      setErr(er.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-5 py-12">
      <Title sub={`Account Role: ${user?.role || 'USER'}`}>Your profile</Title>

      <form onSubmit={handleSave} className="space-y-4">
        <Field
          label="Name"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Field
          label="Email"
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Field
          label="New password (leave blank to keep current)"
          type="password"
          minLength={6}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <Msg>{err}</Msg>
        {msg && <p className="text-sm text-green-700 bg-green-50 rounded-xl px-4 py-3">{msg}</p>}

        <button disabled={saving} className="btn w-full py-3">
          {saving ? 'Saving changes…' : 'Save changes'}
        </button>
      </form>

      <Link to="/my-orders" className="mt-6 block text-center text-sm text-blue hover:underline">
        View my orders
      </Link>
    </div>
  )
}

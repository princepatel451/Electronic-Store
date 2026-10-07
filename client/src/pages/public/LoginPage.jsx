import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context'
import { Field, Msg } from '../../components'

export function LoginPage({ register }) {
  const { login, register: reg } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/'

  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErr('')

    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      return setErr('Enter a valid email address.')
    }
    if (form.password.length < 6) {
      return setErr('Password must be at least 6 characters.')
    }

    setLoading(true)
    try {
      if (register) {
        await reg(form)
      } else {
        await login({ email: form.email, password: form.password })
      }
      navigate(from, { replace: true })
    } catch (er) {
      setErr(er.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-sm px-5 py-24">
      <h1 className="text-center text-4xl font-semibold">
        {register ? 'Create your account' : 'Sign in'}
      </h1>

      <form onSubmit={handleSubmit} className="mt-10 space-y-4">
        {register && (
          <Field
            label="Full name"
            required
            value={form.name}
            onChange={handleChange('name')}
          />
        )}
        <Field
          label="Email"
          type="email"
          required
          value={form.email}
          onChange={handleChange('email')}
        />
        <Field
          label="Password"
          type="password"
          required
          minLength={6}
          value={form.password}
          onChange={handleChange('password')}
        />

        <Msg>{err}</Msg>

        <button disabled={loading} className="btn w-full py-3 text-base">
          {loading ? 'Please wait…' : register ? 'Create account' : 'Sign in'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-mute">
        {register ? 'Already have an account?' : 'New to Electro?'}{' '}
        <Link
          className="text-blue hover:underline"
          to={register ? '/login' : '/register'}
          state={{ from }}
        >
          {register ? 'Sign in' : 'Create account'}
        </Link>
      </p>
    </div>
  )
}

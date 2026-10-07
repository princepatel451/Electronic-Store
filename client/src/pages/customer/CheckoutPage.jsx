import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api, money } from '../../api'
import { useAuth, useCart } from '../../context'
import { Field, Msg, Title } from '../../components'

export function CheckoutPage() {
  const { cart, total, refresh } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [address, setAddress] = useState({
    fullName: user?.name || '',
    phone: '',
    addressLine: '',
    city: '',
    state: '',
    pincode: ''
  })
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  const handleChange = (key) => (e) => {
    setAddress({ ...address, [key]: e.target.value })
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    setErr('')

    if (!/^\d{6}$/.test(address.pincode.trim())) {
      return setErr('Pincode must be a valid 6-digit number.')
    }
    if (!/^\d{10}$/.test(address.phone.trim())) {
      return setErr('Phone number must be a valid 10-digit number.')
    }

    setBusy(true)
    try {
      const res = await api('/orders', {
        method: 'POST',
        body: { shippingAddress: address }
      })
      const order = res.order || res.data || res
      await refresh()
      navigate('/orders/' + order._id, { replace: true })
    } catch (er) {
      setErr(er.message)
      setBusy(false)
    }
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="py-32 text-center text-mute">
        Your bag is empty.{' '}
        <Link to="/products" className="text-blue">Shop products</Link>
      </div>
    )
  }

  return (
    <form onSubmit={handlePlaceOrder} className="wrap grid max-w-5xl gap-12 py-12 md:grid-cols-2">
      <div className="space-y-4">
        <Title>Where should we deliver?</Title>
        <Field
          label="Full name"
          required
          value={address.fullName}
          onChange={handleChange('fullName')}
        />
        <Field
          label="Phone number (10 digits)"
          required
          type="tel"
          value={address.phone}
          onChange={handleChange('phone')}
        />
        <Field
          label="Street Address / Flat / Building"
          required
          value={address.addressLine}
          onChange={handleChange('addressLine')}
        />
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="City"
            required
            value={address.city}
            onChange={handleChange('city')}
          />
          <Field
            label="State"
            required
            value={address.state}
            onChange={handleChange('state')}
          />
        </div>
        <Field
          label="Pincode (6 digits)"
          required
          value={address.pincode}
          onChange={handleChange('pincode')}
        />
      </div>

      <div className="space-y-4">
        <h2 className="pt-3 text-2xl font-semibold md:pt-[5.5rem]">Order summary</h2>

        <div className="card space-y-3 text-sm">
          {cart.items.map((item) => {
            const product = item.product || item
            const itemPrice = product.price || item.price || 0
            return (
              <div key={item._id} className="flex justify-between items-center">
                <span className="text-ink truncate max-w-[200px]">
                  {product.name} × {item.quantity}
                </span>
                <span className="font-medium text-ink">
                  {money(itemPrice * item.quantity)}
                </span>
              </div>
            )
          })}
          <div className="flex justify-between border-t border-black/10 pt-3 text-lg font-semibold text-ink">
            <span>Total to Pay</span>
            <span>{money(total)}</span>
          </div>
        </div>

        <Msg>{err}</Msg>

        <button
          disabled={busy}
          className="btn w-full py-3.5 text-base"
        >
          {busy ? 'Placing order…' : 'Place order'}
        </button>
      </div>
    </form>
  )
}

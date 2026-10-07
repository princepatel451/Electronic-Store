import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api, money } from '../../api'
import { Badge, Msg, Loading, Title } from '../../components'

export function OrderDetailsPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(true)

  const loadOrder = () => {
    setLoading(true)
    api('/orders/' + id)
      .then((data) => {
        setOrder(data.order || data.data || data)
        setLoading(false)
      })
      .catch((e) => {
        setErr(e.message)
        setLoading(false)
      })
  }

  useEffect(() => {
    loadOrder()
  }, [id])

  const handleCancelOrder = async () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await api(`/orders/${id}/cancel`, { method: 'PUT' })
        loadOrder()
      } catch (e) {
        setErr(e.message)
      }
    }
  }

  if (loading) return <Loading />
  if (!order) {
    return (
      <div className="wrap py-24">
        <Msg>{err || 'Order not found'}</Msg>
      </div>
    )
  }

  const items = order.items || []
  const shipping = order.shippingAddress || {}
  const status = order.orderStatus || order.status || 'PENDING'
  const payment = order.paymentStatus || 'PENDING'
  const total = order.totalAmount ?? order.totalPrice ?? 0

  return (
    <div className="wrap max-w-3xl py-12">
      <Title sub={`Order #${order._id.slice(-8)} · Placed on ${new Date(order.createdAt).toLocaleDateString()}`}>
        Order Details
      </Title>

      <div className="mb-6 flex items-center gap-3">
        <Badge s={status} />
        <Badge s={payment} />
      </div>

      {/* Ordered Items */}
      <div className="card space-y-3 text-sm">
        {items.map((item, idx) => {
          const itemPrice = item.price || item.product?.price || 0
          return (
            <div key={item._id || idx} className="flex justify-between items-center py-1">
              <div>
                <p className="font-medium text-ink">{item.name || item.product?.name || 'Product'}</p>
                <p className="text-xs text-mute">Qty: {item.quantity} × {money(itemPrice)}</p>
              </div>
              <span className="font-semibold text-ink">{money(itemPrice * item.quantity)}</span>
            </div>
          )
        })}

        <div className="flex justify-between border-t border-black/10 pt-3 text-lg font-semibold text-ink">
          <span>Total Amount</span>
          <span>{money(total)}</span>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="card mt-4 text-sm">
        <p className="font-semibold text-ink">Shipping Address</p>
        <p className="mt-1 text-mute leading-relaxed">
          {shipping.fullName || shipping.name} · {shipping.phone}<br />
          {shipping.addressLine || shipping.address}<br />
          {shipping.city}, {shipping.state} - {shipping.pincode}
        </p>
      </div>

      <Msg>{err}</Msg>

      {status === 'PENDING' && (
        <button
          onClick={handleCancelOrder}
          className="btn-ghost mt-6 text-red-600 border-red-300 hover:bg-red-50"
        >
          Cancel order
        </button>
      )}
    </div>
  )
}

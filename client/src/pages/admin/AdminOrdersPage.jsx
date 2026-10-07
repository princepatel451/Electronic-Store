import { useEffect, useState } from 'react'
import { api, list, money } from '../../api'
import { Badge, Msg, Loading } from '../../components'
import { AdminShell, AdminTable } from './AdminShell'

const STEPS = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED']

export function AdminOrdersPage() {
  const [orders, setOrders] = useState(null)
  const [filter, setFilter] = useState('')
  const [err, setErr] = useState('')

  const loadOrders = () => {
    api('/orders')
      .then(res => setOrders(list(res, 'orders')))
      .catch(e => {
        setErr(e.message)
        setOrders([])
      })
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const updateStatus = async (orderId, newStatus) => {
    try {
      await api(`/orders/${orderId}/status`, {
        method: 'PUT',
        body: { status: newStatus }
      })
      loadOrders()
    } catch (e) {
      setErr(e.message)
    }
  }

  const togglePayment = async (orderId, currentPayment) => {
    try {
      const nextPayment = currentPayment === 'PAID' ? 'PENDING' : 'PAID'
      await api(`/orders/${orderId}/payment`, {
        method: 'PUT',
        body: { paymentStatus: nextPayment }
      })
      loadOrders()
    } catch (e) {
      setErr(e.message)
    }
  }

  if (!orders) return <Loading />

  const filteredOrders = orders.filter(o => {
    const status = o.orderStatus || o.status
    return !filter || status === filter
  })

  return (
    <AdminShell title="Orders">
      <div className="mb-4 flex items-center justify-between">
        <select
          className="input max-w-xs"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        >
          <option value="">All statuses</option>
          {[...STEPS, 'CANCELLED'].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <span className="text-sm text-mute">{filteredOrders.length} orders</span>
      </div>

      <Msg>{err}</Msg>

      <AdminTable head={['Order', 'Customer', 'Total', 'Status', 'Payment']}>
        {filteredOrders.length === 0 ? (
          <tr>
            <td colSpan={5} className="py-8 text-center text-mute">
              No orders found.
            </td>
          </tr>
        ) : (
          filteredOrders.map(o => {
            const status = o.orderStatus || o.status || 'PENDING'
            const payment = o.paymentStatus || 'PENDING'
            const total = o.totalAmount ?? o.totalPrice ?? o.total ?? 0

            return (
              <tr key={o._id} className="hover:bg-snow/50 transition">
                <td className="px-4 py-3 font-mono text-xs">#{o._id.slice(-8)}</td>
                <td className="px-4">
                  <p className="font-medium text-ink">{o.user?.name || o.shippingAddress?.fullName || 'Guest'}</p>
                  <p className="text-xs text-mute">{o.user?.email || o.shippingAddress?.phone}</p>
                </td>
                <td className="px-4 font-semibold">{money(total)}</td>
                <td className="px-4">
                  <select
                    className="rounded-full bg-snow px-3 py-1 text-xs font-medium outline-none cursor-pointer"
                    value={status}
                    disabled={status === 'CANCELLED'}
                    onChange={e => updateStatus(o._id, e.target.value)}
                  >
                    {[...STEPS, 'CANCELLED'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4">
                  <button
                    onClick={() => togglePayment(o._id, payment)}
                    title="Click to toggle payment status"
                    className="hover:opacity-80 transition"
                  >
                    <Badge s={payment} />
                  </button>
                </td>
              </tr>
            )
          })
        )}
      </AdminTable>
    </AdminShell>
  )
}

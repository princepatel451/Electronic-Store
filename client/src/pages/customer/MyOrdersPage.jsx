import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, list, money } from '../../api'
import { Badge, Loading, Title } from '../../components'

export function MyOrdersPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api('/orders/my-orders')
      .then((res) => {
        setData(res)
        setLoading(false)
      })
      .catch(() => {
        setData({ orders: [] })
        setLoading(false)
      })
  }, [])

  if (loading) return <Loading />

  const orders = list(data, 'orders')

  return (
    <div className="wrap max-w-3xl py-12">
      <Title>Your orders</Title>

      {!orders.length ? (
        <div className="card text-center py-12">
          <p className="text-mute">You haven't placed any orders yet.</p>
          <Link className="btn mt-4 inline-block" to="/products">
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => {
            const status = o.orderStatus || o.status || 'PENDING'
            const total = o.totalAmount ?? o.totalPrice ?? o.total ?? 0

            return (
              <Link
                key={o._id}
                to={'/orders/' + o._id}
                className="card flex items-center justify-between transition hover:scale-[1.01] hover:shadow-sm"
              >
                <div>
                  <p className="font-semibold text-ink">Order #{o._id.slice(-8)}</p>
                  <p className="text-sm text-mute mt-0.5">
                    {new Date(o.createdAt).toLocaleDateString()} · {money(total)}
                  </p>
                </div>
                <Badge s={status} />
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

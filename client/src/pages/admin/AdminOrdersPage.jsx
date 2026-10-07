import { useEffect, useState } from 'react'
import { api, list, money } from '../../api'
import { Badge, Msg, Loading } from '../../components'
import { AdminShell, AdminTable } from './AdminShell'

const STEPS = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED']

export function AdminOrdersPage() {
  const [orders, setOrders] = useState(null)
  const [filter, setFilter] = useState('')
  const [err, setErr] = useState('')

  // 1-Click Samsung Fulfillment Modal State
  const [activeFulfillment, setActiveFulfillment] = useState(null)
  const [fulfillingOrder, setFulfillingOrder] = useState(null)
  const [fulfillmentLoading, setFulfillmentLoading] = useState(false)
  const [copyNotice, setCopyNotice] = useState('')
  const [supplierOrderId, setSupplierOrderId] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [fulfillStatus, setFulfillStatus] = useState('IN_PROGRESS')
  const [saveLoading, setSaveLoading] = useState(false)

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

  // Open 1-Click Samsung Fulfillment
  const handleOpenFulfillment = async (order) => {
    setFulfillingOrder(order)
    setFulfillmentLoading(true)
    setCopyNotice('')
    setSupplierOrderId(order.fulfillment?.supplierOrderId || '')
    setTrackingNumber(order.fulfillment?.trackingNumber || '')
    setFulfillStatus(order.fulfillment?.status || 'IN_PROGRESS')

    try {
      const res = await api(`/orders/${order._id}/samsung-fulfillment`)
      setActiveFulfillment(res.fulfillmentPackage)
    } catch (e) {
      setErr(e.message)
    } finally {
      setFulfillmentLoading(false)
    }
  }

  // Copy to clipboard helper
  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text)
    setCopyNotice(`Copied ${label} to clipboard!`)
    setTimeout(() => setCopyNotice(''), 2500)
  }

  // Save Samsung Fulfillment status
  const handleSaveFulfillment = async () => {
    if (!fulfillingOrder) return
    setSaveLoading(true)

    try {
      await api(`/orders/${fulfillingOrder._id}/samsung-fulfillment`, {
        method: 'PUT',
        body: {
          status: fulfillStatus,
          supplierOrderId,
          trackingNumber
        }
      })
      setActiveFulfillment(null)
      setFulfillingOrder(null)
      loadOrders()
    } catch (e) {
      setErr(e.message)
    } finally {
      setSaveLoading(false)
    }
  }

  if (!orders) return <Loading />

  const filteredOrders = orders.filter(o => {
    const status = o.orderStatus || o.status
    return !filter || status === filter
  })

  return (
    <AdminShell title="Orders Management">
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

      <AdminTable head={['Order', 'Customer', 'Total', 'Status', 'Payment', 'Fulfillment']}>
        {filteredOrders.length === 0 ? (
          <tr>
            <td colSpan={6} className="py-8 text-center text-mute">
              No orders found.
            </td>
          </tr>
        ) : (
          filteredOrders.map(o => {
            const status = o.orderStatus || o.status || 'PENDING'
            const payment = o.paymentStatus || 'PENDING'
            const total = o.totalAmount ?? o.totalPrice ?? o.total ?? 0
            const fulfillmentState = o.fulfillment?.status || 'UNFULFILLED'

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
                <td className="px-4">
                  <button
                    onClick={() => handleOpenFulfillment(o)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1 text-xs font-medium text-white transition hover:bg-neutral-800"
                  >
                    <span>Fulfill (Samsung)</span>
                    {fulfillmentState === 'FULFILLED' && <span className="text-green-400">✓</span>}
                  </button>
                </td>
              </tr>
            )
          })
        )}
      </AdminTable>

      {/* 1-Click Samsung Fulfillment Modal */}
      {(activeFulfillment || fulfillmentLoading) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={() => { setActiveFulfillment(null); setFulfillingOrder(null) }}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-2xl space-y-5 overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-black/5 pb-3">
              <div>
                <h2 className="text-2xl font-semibold text-ink">Samsung 1-Click Fulfillment</h2>
                <p className="text-xs text-mute mt-0.5">
                  Order #{fulfillingOrder?._id.slice(-8)} · Customer: {activeFulfillment?.recipient.fullName}
                </p>
              </div>
              <button
                onClick={() => { setActiveFulfillment(null); setFulfillingOrder(null) }}
                className="text-mute hover:text-ink text-xl"
              >
                ✕
              </button>
            </div>

            {fulfillmentLoading ? (
              <Loading message="Generating fulfillment package…" />
            ) : (
              activeFulfillment && (
                <>
                  {copyNotice && (
                    <div className="rounded-xl bg-green-50 p-3 text-xs font-medium text-green-700 animate-fadeIn">
                      {copyNotice}
                    </div>
                  )}

                  {/* Step 1: Open Samsung Product to Order */}
                  <div className="rounded-2xl border border-black/10 bg-snow p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-ink uppercase tracking-wider">Step 1: Order on Samsung</span>
                      <span className="text-xs text-mute">Open official product page</span>
                    </div>

                    <div className="space-y-2">
                      {activeFulfillment.items.map(item => (
                        <div key={item.index} className="flex items-center justify-between bg-white p-3 rounded-xl border border-black/5">
                          <div>
                            <p className="font-medium text-sm text-ink">{item.name}</p>
                            <p className="text-xs text-mute">Qty: {item.quantity} · Model: {item.modelCode}</p>
                          </div>
                          <a
                            href={item.directUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="btn text-xs py-2 px-4 shrink-0 bg-blue hover:bg-blue/90"
                          >
                            Buy on Samsung.com ↗
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Step 2: Pre-formatted Customer Shipping Address */}
                  <div className="rounded-2xl border border-black/10 bg-snow p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-ink uppercase tracking-wider">Step 2: Enter Delivery Details</span>
                      <button
                        onClick={() => handleCopy(activeFulfillment.recipient.formattedAddress, 'Complete Address')}
                        className="text-xs font-medium text-blue hover:underline"
                      >
                        Copy Full Address 📋
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-white p-3 rounded-xl border border-black/5">
                      <div>
                        <span className="text-mute block">Full Name:</span>
                        <div className="flex items-center justify-between font-medium text-ink">
                          <span>{activeFulfillment.recipient.fullName}</span>
                          <button onClick={() => handleCopy(activeFulfillment.recipient.fullName, 'Name')} className="text-mute hover:text-blue">📋</button>
                        </div>
                      </div>

                      <div>
                        <span className="text-mute block">Phone Number:</span>
                        <div className="flex items-center justify-between font-medium text-ink">
                          <span>{activeFulfillment.recipient.phone}</span>
                          <button onClick={() => handleCopy(activeFulfillment.recipient.phone, 'Phone')} className="text-mute hover:text-blue">📋</button>
                        </div>
                      </div>

                      <div className="col-span-2 pt-1 border-t border-black/5">
                        <span className="text-mute block">Address Line:</span>
                        <div className="flex items-center justify-between font-medium text-ink">
                          <span>{activeFulfillment.recipient.addressLine}</span>
                          <button onClick={() => handleCopy(activeFulfillment.recipient.addressLine, 'Address Line')} className="text-mute hover:text-blue">📋</button>
                        </div>
                      </div>

                      <div className="col-span-2 pt-1 border-t border-black/5">
                        <span className="text-mute block">City, State & Pincode:</span>
                        <div className="flex items-center justify-between font-medium text-ink">
                          <span>{activeFulfillment.recipient.city}, {activeFulfillment.recipient.state} - {activeFulfillment.recipient.pincode}</span>
                          <button onClick={() => handleCopy(activeFulfillment.recipient.pincode, 'Pincode')} className="text-mute hover:text-blue">📋 Pincode</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Record Samsung Confirmation & Tracking */}
                  <div className="space-y-3 pt-1">
                    <span className="text-xs font-semibold text-ink uppercase tracking-wider block">Step 3: Save Samsung Order & Tracking</span>

                    <div className="grid grid-cols-2 gap-3">
                      <label className="block text-xs">
                        <span className="mb-1 block text-mute">Samsung Order ID</span>
                        <input
                          placeholder="e.g. SAM-8291038"
                          className="input py-2 text-xs"
                          value={supplierOrderId}
                          onChange={e => setSupplierOrderId(e.target.value)}
                        />
                      </label>

                      <label className="block text-xs">
                        <span className="mb-1 block text-mute">Carrier / Tracking No.</span>
                        <input
                          placeholder="e.g. BLUEDART-938210"
                          className="input py-2 text-xs"
                          value={trackingNumber}
                          onChange={e => setTrackingNumber(e.target.value)}
                        />
                      </label>
                    </div>

                    <label className="block text-xs">
                      <span className="mb-1 block text-mute">Fulfillment Status</span>
                      <select
                        className="input py-2 text-xs"
                        value={fulfillStatus}
                        onChange={e => setFulfillStatus(e.target.value)}
                      >
                        <option value="IN_PROGRESS">IN_PROGRESS (Ordered on Samsung, awaiting dispatch)</option>
                        <option value="FULFILLED">FULFILLED (Dispatched with tracking number)</option>
                        <option value="UNFULFILLED">UNFULFILLED (Not ordered yet)</option>
                      </select>
                    </label>

                    <div className="flex gap-3 pt-2">
                      <button
                        disabled={saveLoading}
                        onClick={handleSaveFulfillment}
                        className="btn flex-1 py-3 text-sm"
                      >
                        {saveLoading ? 'Saving…' : 'Save Fulfillment & Update Order'}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setActiveFulfillment(null); setFulfillingOrder(null) }}
                        className="btn-ghost"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </>
              )
            )}
          </div>
        </div>
      )}
    </AdminShell>
  )
}

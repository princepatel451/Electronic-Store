const tone = {
  PENDING: 'bg-amber-100 text-amber-800',
  CONFIRMED: 'bg-blue/10 text-blue',
  SHIPPED: 'bg-violet-100 text-violet-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-700',
  PAID: 'bg-green-100 text-green-800',
  FAILED: 'bg-red-100 text-red-700',
  UNPAID: 'bg-neutral-200 text-neutral-700'
}

export function Badge({ s }) {
  const status = s || 'PENDING'
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${tone[status] || tone.PENDING}`}>
      {status}
    </span>
  )
}

const BASE = import.meta.env.VITE_API_URL || '/api'
export async function api(path, { method = 'GET', body } = {}) {
  const token = localStorage.getItem('token')
  const res = await fetch(BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Something went wrong. Try again.')
  return data
}
// Backends wrap lists differently; unwrap the common shapes.
export const list = (d, ...keys) => Array.isArray(d) ? d : keys.map(k => d?.[k]).find(Array.isArray) || d?.data || []
export const money = n => '₹' + Number(n || 0).toLocaleString('en-IN')
export const img = p => p?.images?.[0]?.url || p?.images?.[0] || p?.image || ''

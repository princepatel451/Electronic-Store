export function Loading({ message = 'Loading…' }) {
  return (
    <div className="wrap py-32 text-center text-mute">
      <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-mute border-t-blue mb-3"></div>
      <p>{message}</p>
    </div>
  )
}

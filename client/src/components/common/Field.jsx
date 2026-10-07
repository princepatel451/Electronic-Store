export function Field({ label, ...props }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-mute">{label}</span>
      <input className="input" {...props} />
    </label>
  )
}

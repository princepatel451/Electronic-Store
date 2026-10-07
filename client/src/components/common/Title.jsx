export function Title({ children, sub }) {
  return (
    <div className="mb-10">
      <h1 className="text-4xl font-semibold md:text-5xl">{children}</h1>
      {sub && <p className="mt-2 text-mute">{sub}</p>}
    </div>
  )
}

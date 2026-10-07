import { NavLink } from 'react-router-dom'

export function AdminShell({ title, children }) {
  const tabs = [
    { path: 'orders', label: 'Orders' },
    { path: 'products', label: 'Products & Categories' },
    { path: 'users', label: 'Users' }
  ]

  return (
    <div className="wrap py-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-4xl font-semibold">{title}</h1>
        <div className="flex gap-1 rounded-full bg-snow p-1 text-sm">
          {tabs.map((tab) => (
            <NavLink
              key={tab.path}
              to={'/admin/' + tab.path}
              className={({ isActive }) =>
                `rounded-full px-4 py-1.5 transition ${
                  isActive ? 'bg-white shadow text-ink font-medium' : 'text-mute hover:text-ink'
                }`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </div>
      </div>
      {children}
    </div>
  )
}

export function AdminTable({ head, children }) {
  return (
    <div className="overflow-x-auto rounded-3xl border border-black/5 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-snow text-mute">
          <tr>
            {head.map((h, i) => (
              <th key={i} className="px-4 py-3 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-black/5">{children}</tbody>
      </table>
    </div>
  )
}

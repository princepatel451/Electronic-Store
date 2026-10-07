import { useEffect, useState } from 'react'
import { api, list } from '../../api'
import { Badge, Msg, Loading } from '../../components'
import { AdminShell, AdminTable } from './AdminShell'

export function AdminUsersPage() {
  const [users, setUsers] = useState(null)
  const [err, setErr] = useState('')

  const loadUsers = () => {
    api('/users')
      .then(res => setUsers(list(res, 'users')))
      .catch(e => {
        setErr(e.message)
        setUsers([])
      })
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const toggleRole = async (user) => {
    const nextRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN'
    try {
      await api(`/users/${user._id}/role`, {
        method: 'PUT',
        body: { role: nextRole }
      })
      loadUsers()
    } catch (e) {
      setErr(e.message)
    }
  }

  const handleDeleteUser = async (user) => {
    if (window.confirm(`Are you sure you want to delete user "${user.name}"?`)) {
      try {
        await api(`/users/${user._id}`, { method: 'DELETE' })
        loadUsers()
      } catch (e) {
        setErr(e.message)
      }
    }
  }

  if (!users) return <Loading />

  return (
    <AdminShell title="Users Management">
      <Msg>{err}</Msg>

      <AdminTable head={['User', 'Email', 'Role', 'Actions']}>
        {users.length === 0 ? (
          <tr>
            <td colSpan={4} className="py-8 text-center text-mute">
              No users found.
            </td>
          </tr>
        ) : (
          users.map(u => (
            <tr key={u._id} className="hover:bg-snow/50 transition">
              <td className="px-4 py-3 font-medium text-ink">{u.name}</td>
              <td className="px-4 text-mute">{u.email}</td>
              <td className="px-4">
                <Badge s={u.role === 'ADMIN' ? 'CONFIRMED' : 'UNPAID'} />
                <span className="ml-2 text-xs text-mute font-mono">{u.role}</span>
              </td>
              <td className="px-4 text-right">
                <button
                  className="mr-4 text-blue hover:underline"
                  onClick={() => toggleRole(u)}
                >
                  Make {u.role === 'ADMIN' ? 'USER' : 'ADMIN'}
                </button>
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => handleDeleteUser(u)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))
        )}
      </AdminTable>
    </AdminShell>
  )
}

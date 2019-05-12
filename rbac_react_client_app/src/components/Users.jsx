import { useEffect, useState } from 'react'
import { fetchManagedUsers } from '../api'

export default function Users({ role }) {
  const [list, setList] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchManagedUsers()
      .then(r => setList(r.data))
      .catch(() => setError('Fehler beim Laden'))
  }, [])

  if (role !== 'admin')
    return <div className="text-center mt-8 text-red-500">❌ Keine Berechtigung für {role}</div>

  return (
    <div className="bg-white p-6 rounded shadow mt-4">
      <h2 className="text-xl mb-4">Managed Users</h2>
      {error && <p className="text-red-500">{error}</p>}
      <ul className="space-y-2">
        {list.map(u => (
          <li key={u.id} className="border-b pb-2">
            {u.email} – Rolle: {u.role}
          </li>
        ))}
      </ul>
    </div>
  )
}

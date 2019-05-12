import { useState } from 'react'
import { login } from '../api'
import { useNavigate } from 'react-router-dom'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handle = async e => {
    e.preventDefault()
    setError(null)
    try {
      const data = await login(email, pw)
      console.log('✅ Token erhalten:', data)
      console.log( email + ' --- ' + pw )
      console.log( JSON.stringify(data) + ' --- ' + data )

      onLogin(data)
      navigate('/dashboard') // oder wohin du nach dem Login willst
    } catch (err) {
      console.error('❌ Login fehlgeschlagen:', err)
      setError(err.message || 'Login fehlgeschlagen')
    }
  }

  return (
    <form
      onSubmit={handle}
      className="bg-white p-6 rounded shadow max-w-md mx-auto space-y-4"
    >
      <h2 className="text-2xl">Login</h2>
      <input
        className="w-full p-2 border rounded"
        placeholder="Email"
        type="email"
        required
        onChange={e => setEmail(e.target.value)}
      />
      <input
        className="w-full p-2 border rounded"
        placeholder="Passwort"
        type="password"
        required
        onChange={e => setPw(e.target.value)}
      />
      <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">
        Login
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  )
}


/*

import { useState } from 'react'
import { login } from '../api'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [error, setError] = useState(null)

  const handle = async e => {
    e.preventDefault()
    setError(null)
    try {
      const data = await login(email, pw)
      onLogin(data)
    } catch {
      setError('Login fehlgeschlagen')
    }
  }

  return (
    <form
      onSubmit={handle}
      className="bg-white p-6 rounded shadow max-w-md mx-auto space-y-4"
    >
      <h2 className="text-2xl">Login</h2>
      <input
        className="w-full p-2 border rounded"
        placeholder="Email"
        type="email"
        required
        onChange={e => setEmail(e.target.value)}
      />
      <input
        className="w-full p-2 border rounded"
        placeholder="Passwort"
        type="password"
        required
        onChange={e => setPw(e.target.value)}
      />
      <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">
        Login
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  )
}

*/

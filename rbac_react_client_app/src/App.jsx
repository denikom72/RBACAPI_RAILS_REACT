import { useEffect, useState } from 'react'
import Login from './components/Login'
import Navbar from './components/Navbar'
import Users from './components/Users'
import { setToken } from './api'

function App() {
  const [auth, setAuth] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    const refresh = localStorage.getItem('refresh_token')
    const role = localStorage.getItem('role')
    if (token) {
      setToken(token)
      setAuth({ access_token: token, refresh_token: refresh, role })
    }
  }, [])

  const handleLogin = data => {
    setToken(data.access_token)
    localStorage.setItem('access_token', data.access_token)
    localStorage.setItem('refresh_token', data.refresh_token)
	  console.log( JSON.stringify( data ) )
	  //const payload = JSON.parse(atob(data.access_token.split('.')[1]))
    const payload = data.access_token
    localStorage.setItem('role', payload.role)
    setAuth({ ...data, role: payload.role })
  }

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('role')
    setAuth(null)
  }

  if (!auth) return <Login onLogin={handleLogin} />

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <Navbar role={auth.role} onLogout={handleLogout} />
      <Users role={auth.role} />
    </div>
  )
}

export default App

import axios from 'axios'

const API = axios.create({ baseURL: 'http://172.17.0.2:3000' })
let isRefreshing = false
let refreshSubscribers = []

function onRefreshed(token) {
  refreshSubscribers.forEach(cb => cb(token))
  refreshSubscribers = []
}

API.interceptors.response.use(
  res => res,
  async error => {
    const { config, response } = error
    if (response.status === 401 && !config._retry) {
      config._retry = true
      if (!isRefreshing) {
        isRefreshing = true
        const refresh = localStorage.getItem('refresh_token')
        const data = await refreshToken(refresh)
        localStorage.setItem('access_token', data.access_token)
        localStorage.setItem('refresh_token', data.refresh_token)
        setToken(data.access_token)
        isRefreshing = false
        onRefreshed(data.access_token)
      }
      return new Promise(resolve => {
        refreshSubscribers.push(token => {
          config.headers['Authorization'] = `Bearer ${token}`
          resolve(API(config))
        })
      })
    }
    return Promise.reject(error)
  }
)

export async function login(username, password) {
  const resp = await API.post('/oauth/token', new URLSearchParams({
    grant_type: 'password',
    username,
    password,
    client_id: 'TestClient',
    client_secret: '4CvAFroHHHGaV1HZyiXOufqi7gtLCUmOb0ObVXfzzjY'
  }))
  return resp.data
}

export async function refreshToken(refresh_token) {
  const resp = await API.post('/oauth/token', new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token,
    client_id: 'TestClient',
    client_secret: ''
  }))
  return resp.data
}

export function fetchManagedUsers() {
  return API.get('/api/managed_users')
}

export function createManagedUser(data) {
  return API.post('/api/managed_users', { managed_user: data })
}

export function setToken(token) {
  API.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

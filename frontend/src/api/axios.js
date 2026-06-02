import axios from 'axios'

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_BASE_URL ?? import.meta.env.VITE_API_URL ?? '') + '/api/v1',
  timeout: 10000,
})

// JWT 토큰 자동 첨부
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('admin_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api

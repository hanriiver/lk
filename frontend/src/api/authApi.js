import api from './axios'

export const verifyPin = (pin) =>
  api.post('/auth/verify-pin', { pin }).then(r => r.data.data)

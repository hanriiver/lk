import api from './axios'

export const getProfiles = (gender) =>
  api.get('/profiles', { params: gender ? { gender } : {} }).then(r => r.data.data)

export const createProfile = (formData) =>
  api.post('/profiles', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data.data)

export const deleteProfile = (id) =>
  api.delete(`/profiles/${id}`)

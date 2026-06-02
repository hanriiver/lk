import api from './axios'

export const getProfiles = (gender) =>
  api.get('/profiles', { params: gender ? { gender } : {} }).then(r => r.data.data)

export const createProfile = (data) =>
  api.post('/profiles', data).then(r => r.data.data)

export const deleteProfile = (id) =>
  api.delete(`/profiles/${id}`)

import api from './axios'

export const getGuestbook = () =>
  api.get('/guestbook').then(r => r.data.data)

export const createEntry = (data) =>
  api.post('/guestbook', data).then(r => r.data.data)

export const deleteEntry = (id) =>
  api.delete(`/guestbook/${id}`)

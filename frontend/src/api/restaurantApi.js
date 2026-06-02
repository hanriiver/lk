import api from './axios'

export const getRestaurants = (category, q) =>
  api.get('/restaurants', { params: { category, q } }).then(r => r.data.data)

export const createRestaurant = (data) =>
  api.post('/restaurants', data).then(r => r.data.data)

export const updateRestaurant = (id, data) =>
  api.put(`/restaurants/${id}`, data).then(r => r.data.data)

export const deleteRestaurant = (id) =>
  api.delete(`/restaurants/${id}`)

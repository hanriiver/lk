import api from './axios'

export const getMenus = (base, q) =>
  api.get('/menus', { params: { base, q } }).then(r => r.data.data)

export const createMenu = (formData) =>
  api.post('/menus', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data.data)

export const updateMenu = (id, formData) =>
  api.put(`/menus/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data.data)

export const deleteMenu = (id) =>
  api.delete(`/menus/${id}`)

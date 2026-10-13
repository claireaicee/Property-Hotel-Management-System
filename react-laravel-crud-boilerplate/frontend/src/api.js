const API_URL = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '')

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json', ...options.headers },
  })
  if (response.status === 204) return null
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const validation = data.errors ? Object.values(data.errors).flat().join(' ') : ''
    throw new Error(validation || data.message || `Request failed (${response.status})`)
  }
  return data
}

export const productApi = {
  list: (search = '') => request(`/products${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  get: (id) => request(`/products/${id}`),
  create: (payload) => request('/products', { method: 'POST', body: JSON.stringify(payload) }),
  update: (id, payload) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  remove: (id) => request(`/products/${id}`, { method: 'DELETE' }),
}

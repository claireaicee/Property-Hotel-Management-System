const BASE = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '');
export async function api(path, options = {}) {
  const token = localStorage.getItem('haven_token');
  const headers = { Accept: 'application/json', 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  let response;
  try {
    response = await fetch(`${BASE}${path}`, { ...options, headers });
  } catch {
    throw new Error('Cannot reach the API. Check that Laravel is running and VITE_API_BASE_URL is correct.');
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const firstValidation = data.errors && Object.values(data.errors).flat()[0];
    throw new Error(firstValidation || data.message || `Request failed (${response.status})`);
  }
  return data;
}
export { BASE as API_BASE };

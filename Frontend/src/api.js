// src/api.js
const BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:3000';

function makeUrl(path) {
  return path.startsWith('http') ? path : BASE_URL + path;
}

async function req(path, method = 'GET', body) {
  const res = await fetch(makeUrl(path), {
    method,
    credentials: 'include', // шлём/получаем httpOnly-куки
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null;
  if (!res.ok) {
    let msg = '';
    try { msg = await res.text(); } catch { }
    const err = new Error(msg || res.statusText);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

export const api = {
  get: (p) => req(p),
  post: (p, b) => req(p, 'POST', b),
  del: (p) => req(p, 'DELETE'),
};

export default api;

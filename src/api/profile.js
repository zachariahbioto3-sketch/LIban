const BASE = 'http://localhost:8001/api/auth';

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

async function apiFetch(path, options = {}) {
  const csrfToken = getCookie('csrftoken');
  const res = await fetch(`${BASE}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(csrfToken ? { 'X-CSRFToken': csrfToken } : {}),
    },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const profileApi = {
  getProfile: () => apiFetch('/profile/'),
  updateProfile: (data) => apiFetch('/profile/', { method: 'PATCH', body: JSON.stringify(data) }),
  getAddresses: () => apiFetch('/addresses/'),
  createAddress: (data) => apiFetch('/addresses/', { method: 'POST', body: JSON.stringify(data) }),
  updateAddress: (id, data) => apiFetch(`/addresses/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteAddress: (id) => apiFetch(`/addresses/${id}/`, { method: 'DELETE' }),
  getCards: () => apiFetch('/cards/'),
  createCard: (data) => apiFetch('/cards/', { method: 'POST', body: JSON.stringify(data) }),
  deleteCard: (id) => apiFetch(`/cards/${id}/`, { method: 'DELETE' }),
  getNotifications: () => apiFetch('/notifications/'),
  updateNotifications: (data) => apiFetch('/notifications/', { method: 'PATCH', body: JSON.stringify(data) }),
  changePassword: (data) => apiFetch('/change-password/', { method: 'POST', body: JSON.stringify(data) }),
};

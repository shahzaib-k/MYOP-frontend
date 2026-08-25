import apiClient, { unwrap } from "../api/client";
import ENDPOINTS from "../api/endpoints";

/**
 * Auth calls. `register` and `login` both resolve to { user, token };
 * the backend always creates customers from /register.
 */
export const register = async ({ name, email, password, phone }) => {
  const payload = { name: name.trim(), email: email.trim(), password };

  if (phone && phone.trim() !== "") {
    payload.phone = phone.trim();
  }

  const response = await apiClient.post(ENDPOINTS.auth.register, payload);

  return unwrap(response);
};

export const login = async ({ email, password }) => {
  const response = await apiClient.post(ENDPOINTS.auth.login, {
    email: email.trim(),
    password,
  });

  return unwrap(response);
};

export const fetchProfile = async () => {
  const response = await apiClient.get(ENDPOINTS.auth.me);

  return unwrap(response);
};

export const updateProfile = async (updates) => {
  const response = await apiClient.put(ENDPOINTS.auth.updateProfile, updates);

  return unwrap(response);
};

export const changePassword = async ({ currentPassword, newPassword }) => {
  const response = await apiClient.put(ENDPOINTS.auth.changePassword, {
    currentPassword,
    newPassword,
  });

  return unwrap(response);
};

export const registerPushToken = async (token) => {
  const response = await apiClient.post(ENDPOINTS.auth.pushToken, { token });

  return unwrap(response);
};

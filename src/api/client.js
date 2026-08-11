import axios from "axios";
import { API_BASE_URL, API_TIMEOUT } from "../constants/config";

/**
 * The single axios instance used by every service. Screens must never import
 * axios directly — go through services/ so base URL, auth and error handling
 * stay centralized.
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: { "Content-Type": "application/json" },
});

/**
 * The token lives in module scope rather than being read from AsyncStorage on
 * every request: interceptors must stay synchronous and fast. AuthContext owns
 * persistence and calls setAuthToken whenever the session changes.
 */
let authToken = null;
let unauthorizedHandler = null;

export const setAuthToken = (token) => {
  authToken = token || null;
};

export const getAuthToken = () => authToken;

/**
 * Lets AuthContext react to an expired/invalid token (sign the user out)
 * without the API layer having to import React state.
 */
export const setUnauthorizedHandler = (handler) => {
  unauthorizedHandler = typeof handler === "function" ? handler : null;
};

apiClient.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    // 401 on the login endpoint just means "wrong password" — only treat it as
    // an expired session for requests made with a token we already held.
    const isLoginAttempt = error?.config?.url?.includes("/api/auth/login");

    if (status === 401 && authToken && !isLoginAttempt && unauthorizedHandler) {
      unauthorizedHandler();
    }

    return Promise.reject(error);
  }
);

/**
 * Unwraps the backend envelope { success, message, data }.
 * Services call this so screens receive plain domain objects.
 */
export const unwrap = (response) => response?.data?.data ?? null;

export const unwrapWithMessage = (response) => ({
  data: response?.data?.data ?? null,
  message: response?.data?.message ?? "",
});

export default apiClient;

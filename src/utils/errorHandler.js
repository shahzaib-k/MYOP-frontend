import MESSAGES from "../constants/messages";

/**
 * The backend always answers with { success, message, errors }. This turns any
 * failure — including transport failures that never reached the server — into
 * the same normalized shape so the UI has exactly one thing to render.
 */
export const normalizeError = (error) => {
  if (!error) {
    return { message: MESSAGES.unknown, status: null, errors: null };
  }

  // Request never completed: no internet, wrong base URL, or server down.
  if (!error.response) {
    if (error.code === "ECONNABORTED") {
      return { message: MESSAGES.timeout, status: null, errors: null };
    }

    return { message: MESSAGES.network, status: null, errors: null };
  }

  const { status, data } = error.response;

  if (status === 401) {
    return {
      message: data?.message || MESSAGES.sessionExpired,
      status,
      errors: data?.errors || null,
    };
  }

  if (status >= 500) {
    return {
      message: data?.message || MESSAGES.serverUnavailable,
      status,
      errors: data?.errors || null,
    };
  }

  return {
    message: data?.message || MESSAGES.unknown,
    status,
    errors: data?.errors || null,
  };
};

export const getErrorMessage = (error) => normalizeError(error).message;

/**
 * Backend validation details arrive under `errors` in shapes like
 * { missingFields: [...] } or { invalidFields: [...] }. Flattens them into
 * readable lines for display beneath the main message.
 */
export const getErrorDetails = (error) => {
  const { errors } = normalizeError(error);

  if (!errors || typeof errors !== "object") {
    return [];
  }

  return Object.entries(errors)
    .map(([key, value]) => {
      const readableKey = key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (char) => char.toUpperCase())
        .trim();

      if (Array.isArray(value)) {
        return value.length > 0 ? `${readableKey}: ${value.join(", ")}` : null;
      }

      if (value === null || typeof value === "object") {
        return null;
      }

      return `${readableKey}: ${value}`;
    })
    .filter(Boolean);
};

export const isUnauthorized = (error) => normalizeError(error).status === 401;

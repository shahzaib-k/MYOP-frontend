/** Shared validation primitives. Each returns an error string or null. */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isBlank = (value) =>
  value === undefined || value === null || String(value).trim() === "";

export const required = (value, label = "This field") =>
  isBlank(value) ? `${label} is required` : null;

export const isValidEmail = (value) => EMAIL_PATTERN.test(String(value).trim());

export const minLength = (value, length, label = "This field") =>
  String(value ?? "").length < length
    ? `${label} must be at least ${length} characters`
    : null;

export const isPositiveNumber = (value) => {
  const numeric = Number(value);

  return Number.isFinite(numeric) && numeric > 0;
};

/**
 * Runs a map of { field: () => error | null } and returns
 * { isValid, errors } so forms can render every problem at once.
 */
export const runValidations = (rules) => {
  const errors = {};

  Object.entries(rules).forEach(([field, rule]) => {
    const error = rule();

    if (error) {
      errors[field] = error;
    }
  });

  return { isValid: Object.keys(errors).length === 0, errors };
};

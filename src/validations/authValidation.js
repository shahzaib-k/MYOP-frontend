import { MIN_PASSWORD_LENGTH } from "../constants/config";
import {
  isBlank,
  isValidEmail,
  minLength,
  required,
  runValidations,
} from "./validators";

/** Mirrors middleware/validateAuth.js so users see errors before a round trip. */

const validateEmailField = (email) => {
  if (isBlank(email)) {
    return "Email is required";
  }

  return isValidEmail(email) ? null : "Enter a valid email address";
};

export const validateLoginForm = ({ email, password }) =>
  runValidations({
    email: () => validateEmailField(email),
    password: () => required(password, "Password"),
  });

export const validateRegisterForm = ({ name, email, password, phone }) =>
  runValidations({
    name: () => required(name, "Full name"),
    email: () => validateEmailField(email),
    password: () =>
      required(password, "Password") ||
      minLength(password, MIN_PASSWORD_LENGTH, "Password"),
    // Phone is optional on the backend; only validate it when provided.
    phone: () =>
      isBlank(phone) || /^[0-9+\-\s()]{7,20}$/.test(String(phone).trim())
        ? null
        : "Enter a valid phone number",
  });

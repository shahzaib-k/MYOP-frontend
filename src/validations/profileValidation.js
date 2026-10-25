import { MIN_PASSWORD_LENGTH } from "../constants/config";
import { isBlank, minLength, required, runValidations } from "./validators";

/** Mirrors middleware/validateAuth.js (update profile + change password). */

const PHONE_PATTERN = /^[0-9+\-\s()]{7,20}$/;

/**
 * The backend rejects an empty `phone`, so a number that was saved once can
 * be changed but not cleared. `savedPhone` is what the account has today.
 */
export const createProfileValidator =
  (savedPhone = "") =>
  ({ name, phone }) =>
    runValidations({
      name: () => required(name, "Full name"),
      phone: () => {
        if (isBlank(phone)) {
          return isBlank(savedPhone)
            ? null
            : "Phone number can be changed but not removed";
        }

        return PHONE_PATTERN.test(String(phone).trim())
          ? null
          : "Enter a valid phone number";
      },
    });

export const validatePasswordForm = ({
  currentPassword,
  newPassword,
  confirmPassword,
}) =>
  runValidations({
    currentPassword: () => required(currentPassword, "Current password"),
    newPassword: () => {
      const missing =
        required(newPassword, "New password") ||
        minLength(newPassword, MIN_PASSWORD_LENGTH, "New password");

      if (missing) {
        return missing;
      }

      return newPassword === currentPassword
        ? "New password must be different from the current one"
        : null;
    },
    confirmPassword: () =>
      confirmPassword === newPassword ? null : "Passwords do not match",
  });

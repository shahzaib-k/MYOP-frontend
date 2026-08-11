import { useCallback, useState } from "react";

/**
 * Minimal form state helper: values, per-field errors and submit handling.
 *
 * `validate` receives the current values and returns { isValid, errors },
 * matching the shape produced by src/validations. A field's error clears as
 * soon as the user edits it, so the form never nags about something already
 * fixed.
 */
export const useForm = (initialValues, validate) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const setValue = useCallback((field, value) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];

      return next;
    });
  }, []);

  const validateForm = useCallback(() => {
    if (typeof validate !== "function") {
      return true;
    }

    const { isValid, errors: validationErrors } = validate(values);
    setErrors(validationErrors);

    return isValid;
  }, [validate, values]);

  /** Runs `onValid(values)` only when validation passes. */
  const handleSubmit = useCallback(
    (onValid) => {
      if (!validateForm()) {
        return;
      }

      onValid(values);
    },
    [validateForm, values]
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  return { values, errors, setValue, setErrors, handleSubmit, reset };
};

export default useForm;

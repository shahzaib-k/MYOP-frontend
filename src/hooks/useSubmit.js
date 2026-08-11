import { useCallback, useEffect, useRef, useState } from "react";
import { getErrorDetails, getErrorMessage } from "../utils/errorHandler";

/**
 * Loading/error lifecycle for a one-shot action (place order, sign in).
 * Double submits are blocked with a ref so a second tap can't slip through
 * before the isSubmitting state has re-rendered.
 */
export const useSubmit = (action) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [errorDetails, setErrorDetails] = useState([]);

  const isMounted = useRef(true);
  const inFlight = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setErrorDetails([]);
  }, []);

  const submit = useCallback(
    async (...args) => {
      if (inFlight.current) {
        return { success: false, data: null };
      }

      inFlight.current = true;
      setIsSubmitting(true);
      reset();

      try {
        const data = await action(...args);

        return { success: true, data };
      } catch (submitError) {
        if (isMounted.current) {
          setError(getErrorMessage(submitError));
          setErrorDetails(getErrorDetails(submitError));
        }

        return { success: false, data: null };
      } finally {
        inFlight.current = false;

        if (isMounted.current) {
          setIsSubmitting(false);
        }
      }
    },
    [action, reset]
  );

  return { submit, isSubmitting, error, errorDetails, reset };
};

export default useSubmit;

import { useCallback, useEffect, useRef, useState } from "react";
import { getErrorMessage } from "../utils/errorHandler";

/**
 * Standard loading/error/data lifecycle for a GET-style request, so no screen
 * has to hand-roll it.
 *
 * `request` must be stable (wrap it in useCallback) — it is the trigger for a
 * refetch, exactly like a dependency array.
 *
 * Returns:
 *  isLoading   — first load, render a spinner
 *  isRefreshing — pull-to-refresh, keep showing existing data
 */
export const useFetch = (request, { immediate = true, initialData = null } = {}) => {
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(immediate);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const isMounted = useRef(true);
  /** Guards against an earlier, slower response overwriting a newer one. */
  const requestId = useRef(0);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  const execute = useCallback(
    async ({ isRefresh = false } = {}) => {
      const currentRequest = requestId.current + 1;
      requestId.current = currentRequest;

      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      setError(null);

      try {
        const result = await request();

        if (isMounted.current && requestId.current === currentRequest) {
          setData(result);
        }

        return result;
      } catch (requestError) {
        if (isMounted.current && requestId.current === currentRequest) {
          setError(getErrorMessage(requestError));
        }

        return null;
      } finally {
        if (isMounted.current && requestId.current === currentRequest) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      }
    },
    [request]
  );

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  const refetch = useCallback(() => execute(), [execute]);
  const refresh = useCallback(() => execute({ isRefresh: true }), [execute]);

  return { data, isLoading, isRefreshing, error, refetch, refresh, setData };
};

export default useFetch;

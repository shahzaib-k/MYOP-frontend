import { useEffect, useState } from "react";

/**
 * Delays propagating a fast-changing value. Used to keep quantity taps from
 * firing a recommendation request on every press.
 */
export const useDebouncedValue = (value, delay = 500) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay);

    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debounced;
};

export default useDebouncedValue;

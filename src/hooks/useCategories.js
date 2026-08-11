import { useCallback } from "react";
import useFetch from "./useFetch";
import { fetchCategories } from "../services/categoryService";

/** Active food categories for the Categories screen. */
export const useCategories = () => {
  const request = useCallback(() => fetchCategories({ activeOnly: true }), []);

  const { data, isLoading, isRefreshing, error, refetch, refresh } = useFetch(
    request,
    { initialData: [] }
  );

  return {
    categories: data || [],
    isLoading,
    isRefreshing,
    error,
    refetch,
    refresh,
  };
};

export default useCategories;

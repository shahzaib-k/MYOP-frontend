import { useCallback } from "react";
import useFetch from "./useFetch";
import { fetchFoodsByCategory } from "../services/foodService";

/** Food items for one category. The backend keys foods by category name. */
export const useFoods = (categoryName) => {
  const request = useCallback(
    () => (categoryName ? fetchFoodsByCategory(categoryName) : []),
    [categoryName]
  );

  const { data, isLoading, isRefreshing, error, refetch, refresh } = useFetch(
    request,
    { initialData: [] }
  );

  return {
    foods: data || [],
    isLoading,
    isRefreshing,
    error,
    refetch,
    refresh,
  };
};

export default useFoods;

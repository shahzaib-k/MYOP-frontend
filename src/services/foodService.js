import apiClient, { unwrap } from "../api/client";
import ENDPOINTS from "../api/endpoints";

export const fetchAllFoods = async () => {
  const response = await apiClient.get(ENDPOINTS.foods.list);

  return unwrap(response) || [];
};

/** The backend keys foods by category *name*, not by category id. */
export const fetchFoodsByCategory = async (categoryName) => {
  const response = await apiClient.get(ENDPOINTS.foods.byCategory(categoryName));

  return unwrap(response) || [];
};

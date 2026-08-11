import apiClient, { unwrap } from "../api/client";
import ENDPOINTS from "../api/endpoints";

/**
 * Customers should only ever see enabled categories, so activeOnly is on by
 * default rather than being decided per screen.
 */
export const fetchCategories = async ({ activeOnly = true } = {}) => {
  const response = await apiClient.get(ENDPOINTS.categories.list, {
    params: activeOnly ? { activeOnly: "true" } : undefined,
  });

  return unwrap(response) || [];
};

export const fetchCategoryById = async (id) => {
  const response = await apiClient.get(ENDPOINTS.categories.detail(id));

  return unwrap(response);
};

import apiClient, { unwrap } from "../api/client";
import ENDPOINTS from "../api/endpoints";
import { toOrderItems } from "../utils/platterCalculations";

/**
 * Both recommendation endpoints are public (no token needed) and both require
 * a positive budget; /review additionally requires a non-empty item list.
 * Callers must guard for that — an empty platter would be a 400.
 */

/**
 * Reviews the current platter against the budget using live prices.
 * Returns { items, itemCount, totalPrice, budget, remainingBudget,
 * withinBudget, amountOverBudget, addOns, alternatives }.
 */
export const reviewPlatter = async ({ budget, items }) => {
  const response = await apiClient.post(ENDPOINTS.recommendations.review, {
    budget: Number(budget),
    items: toOrderItems(items),
  });

  return unwrap(response);
};

/**
 * Asks the backend to build a whole platter for a budget.
 * Returns { items, totalPrice, budget, remainingBudget }.
 */
export const suggestPlatter = async ({ budget, categories, maxItems }) => {
  const payload = { budget: Number(budget) };

  if (Array.isArray(categories) && categories.length > 0) {
    payload.categories = categories;
  }

  if (Number(maxItems) > 0) {
    payload.maxItems = Number(maxItems);
  }

  const response = await apiClient.post(
    ENDPOINTS.recommendations.platter,
    payload
  );

  return unwrap(response);
};

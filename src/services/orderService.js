import apiClient, { unwrap, unwrapWithMessage } from "../api/client";
import ENDPOINTS from "../api/endpoints";
import { toOrderItems } from "../utils/platterCalculations";
import { roundAmount } from "../utils/currency";

/**
 * POST /api/orders accepts exactly three fields — items, totalPrice, budget —
 * and rejects anything else with a 400. userId and status come from the token
 * and the server, never from the client.
 *
 * totalPrice and budget are sent so the backend can cross-check our maths:
 * a mismatch or an over-budget platter is rejected server-side.
 */
export const placeOrder = async ({ items, totalPrice, budget }) => {
  const payload = { items: toOrderItems(items) };

  if (Number(totalPrice) > 0) {
    payload.totalPrice = roundAmount(totalPrice);
  }

  if (Number(budget) > 0) {
    payload.budget = roundAmount(budget);
  }

  const response = await apiClient.post(ENDPOINTS.orders.create, payload);

  return unwrapWithMessage(response);
};

export const fetchMyOrders = async ({ page, limit, status, sort } = {}) => {
  const response = await apiClient.get(ENDPOINTS.orders.list, {
    params: { page, limit, status, sort },
  });

  const data = unwrap(response) || {};

  return { orders: data.orders || [], pagination: data.pagination || null };
};

export const fetchOrderById = async (id) => {
  const response = await apiClient.get(ENDPOINTS.orders.detail(id));

  return unwrap(response);
};

export const cancelOrder = async (id) => {
  const response = await apiClient.put(ENDPOINTS.orders.cancel(id));

  return unwrap(response);
};

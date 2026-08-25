import { useCallback } from "react";
import useFetch from "./useFetch";
import { fetchMyOrders } from "../services/orderService";

const RECENT_ORDERS_LIMIT = 50;

/**
 * The customer's own orders, newest first. GET /api/orders paginates, but a
 * single page of the most recent 50 is enough for the history screen — the
 * All/Active/Completed split is then done client-side on that page, the same
 * pattern useFoods/useCategories already use for simple lists.
 */
export const useOrders = () => {
  const request = useCallback(
    () => fetchMyOrders({ limit: RECENT_ORDERS_LIMIT, sort: "desc" }),
    []
  );

  const { data, isLoading, isRefreshing, error, refetch, refresh } = useFetch(
    request,
    { initialData: { orders: [], pagination: null } }
  );

  return {
    orders: data?.orders || [],
    pagination: data?.pagination || null,
    isLoading,
    isRefreshing,
    error,
    refetch,
    refresh,
  };
};

export default useOrders;

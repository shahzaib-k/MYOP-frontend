import { useMemo } from "react";
import useOrders from "./useOrders";
import { buildOrderStats } from "../utils/profile";

/** Order counts and total spent for the profile screen, from the order list. */
export const useProfileStats = () => {
  const { orders, pagination, isLoading, refetch } = useOrders();

  const stats = useMemo(
    () => buildOrderStats(orders, pagination?.totalItems),
    [orders, pagination]
  );

  return { stats, isLoading, refetch };
};

export default useProfileStats;

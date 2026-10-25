import { ORDER_STATUS, isActiveOrder } from "../constants/orderStatus";
import { roundAmount } from "./currency";

/** "Shahzaib Khan" -> "SK", "tim" -> "T". Falls back to "?" for no name. */
export const getInitials = (name) => {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return "?";
  }

  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";

  return `${first}${last}`.toUpperCase();
};

/** "October 2026", or "" when the date is missing or invalid. */
export const formatMemberSince = (isoString) => {
  const date = new Date(isoString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString(undefined, { month: "long", year: "numeric" });
};

/**
 * Headline numbers for the profile screen. Money only counts completed orders,
 * so a cancelled or still-pending order never inflates "total spent".
 */
export const buildOrderStats = (orders = [], totalOrders) => {
  const list = Array.isArray(orders) ? orders : [];

  const completedOrders = list.filter(
    (order) => order.status === ORDER_STATUS.completed
  );

  return {
    totalOrders: Number.isFinite(totalOrders) ? totalOrders : list.length,
    activeOrders: list.filter((order) => isActiveOrder(order.status)).length,
    completedOrders: completedOrders.length,
    totalSpent: roundAmount(
      completedOrders.reduce((sum, order) => sum + Number(order.totalPrice || 0), 0)
    ),
  };
};

/**
 * Mirrors ../app-backend/utils/orderStatus.js. Customers can only cancel (not
 * set an arbitrary status), so this only needs cancel-eligibility and display
 * metadata — the full transition table lives on the server.
 */
export const ORDER_STATUS = {
  pending: "pending",
  preparing: "preparing",
  completed: "completed",
  cancelled: "cancelled",
};

export const ORDER_STATUS_META = {
  pending: { label: "Pending", tone: "warning", iconName: "time-outline" },
  preparing: { label: "Preparing", tone: "info", iconName: "flame-outline" },
  completed: {
    label: "Completed",
    tone: "success",
    iconName: "checkmark-circle-outline",
  },
  cancelled: { label: "Cancelled", tone: "neutral", iconName: "close-circle-outline" },
};

export const getStatusMeta = (status) =>
  ORDER_STATUS_META[status] || ORDER_STATUS_META.pending;

/** Cancelling is only allowed from pending or preparing — same as the backend. */
export const canCancelOrder = (status) =>
  status === ORDER_STATUS.pending || status === ORDER_STATUS.preparing;

export const isActiveOrder = (status) =>
  status === ORDER_STATUS.pending || status === ORDER_STATUS.preparing;

export default ORDER_STATUS;

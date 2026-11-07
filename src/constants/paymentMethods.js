export const PAYMENT_METHOD = {
  cod: "cod",
  card: "card",
};

export const PAYMENT_METHOD_OPTIONS = [
  {
    value: PAYMENT_METHOD.cod,
    label: "Cash on delivery",
    description: "Pay in cash when your order arrives.",
    iconName: "cash-outline",
  },
  {
    value: PAYMENT_METHOD.card,
    label: "Pay online by card",
    description: "Secure card payment via Stripe (test mode).",
    iconName: "card-outline",
  },
];

export const PAYMENT_STATUS_META = {
  pending: { label: "Payment pending", tone: "warning" },
  paid: { label: "Paid", tone: "success" },
  failed: { label: "Payment failed", tone: "danger" },
};

// Orders placed before payments existed carry neither field; they were cash.
export const getPaymentMethodLabel = (method) =>
  PAYMENT_METHOD_OPTIONS.find((option) => option.value === method)?.label ||
  PAYMENT_METHOD_OPTIONS[0].label;

export const getPaymentStatusMeta = (status) =>
  PAYMENT_STATUS_META[status] || PAYMENT_STATUS_META.pending;

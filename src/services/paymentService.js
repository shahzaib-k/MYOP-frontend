import {
  initPaymentSheet,
  initStripe,
  presentPaymentSheet,
} from "@stripe/stripe-react-native";
import apiClient, { unwrap } from "../api/client";
import ENDPOINTS from "../api/endpoints";

/**
 * Failures here are shaped like an axios error so the shared errorHandler
 * shows our message instead of its generic "can't reach the server" copy.
 */
const paymentError = (message) =>
  Object.assign(new Error(message), {
    response: { status: 402, data: { message } },
  });

/**
 * Opens Stripe's native payment sheet for an order created with
 * paymentMethod "card". The backend returns the PaymentIntent client secret and
 * the publishable key, so the app holds no Stripe configuration of its own.
 * Resolves only when the customer has paid; throws otherwise.
 */
export const payForOrder = async (order) => {
  const { clientSecret, publishableKey } = order.payment || {};

  if (!clientSecret || !publishableKey) {
    throw paymentError("Online payment isn't available right now. Try cash on delivery.");
  }

  await initStripe({ publishableKey });

  const { error: initError } = await initPaymentSheet({
    paymentIntentClientSecret: clientSecret,
    merchantDisplayName: "Make Your Own Platter",
    returnURL: "myop://stripe-redirect",
  });

  if (initError) {
    throw paymentError(initError.message);
  }

  const { error } = await presentPaymentSheet();

  if (error) {
    throw paymentError(
      error.code === "Canceled" ? "Payment was cancelled." : error.message
    );
  }
};

/** Asks the backend to check the PaymentIntent with Stripe and record the result. */
export const confirmOrderPayment = async (orderId) => {
  const response = await apiClient.post(ENDPOINTS.orders.confirmPayment(orderId));

  return unwrap(response);
};

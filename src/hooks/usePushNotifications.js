import { useEffect } from "react";
import useAuth from "./useAuth";
import {
  addNotificationReceivedListener,
  addNotificationResponseReceivedListener,
  getLastNotificationResponseAsync,
  registerForPushNotificationsAsync,
} from "../services/notificationService";
import { registerPushToken } from "../services/authService";
import { navigate } from "../navigation/navigationRef";
import ROUTES, { TABS } from "../navigation/routes";

const openOrderFromNotification = (response) => {
  const data = response?.notification?.request?.content?.data;

  if (data?.orderId) {
    navigate(TABS.orders, {
      screen: ROUTES.orderDetail,
      params: { orderId: data.orderId },
    });
  }
};

/**
 * Registers this device for push notifications once signed in, and routes a
 * tapped notification to the relevant order.
 *
 * Called once from MainNavigator, which only renders while authenticated —
 * signing out swaps back to AuthNavigator and unmounts it, so a later sign-in
 * (possibly as a different account) re-registers the token from scratch.
 */
export const usePushNotifications = () => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const register = async () => {
      const token = await registerForPushNotificationsAsync();

      if (!token) {
        console.warn("[push] No Expo push token obtained — see warnings above.");
        return;
      }

      console.log("[push] Got Expo push token:", token);

      try {
        await registerPushToken(token);
        console.log("[push] Token registered with backend.");
      } catch (error) {
        console.error("[push] Failed to register token with backend:", error?.message, error?.response?.data);
      }
    };

    register();
  }, [isAuthenticated]);

  useEffect(() => {
    // App launched by tapping a notification while it was fully closed.
    getLastNotificationResponseAsync().then((response) => {
      if (response) {
        openOrderFromNotification(response);
      }
    });

    const responseSubscription = addNotificationResponseReceivedListener(
      openOrderFromNotification
    );

    // No-op today — reserved for an in-app toast on a foreground receipt;
    // the OS banner already covers background/killed delivery.
    const receivedSubscription = addNotificationReceivedListener(() => {});

    return () => {
      responseSubscription.remove();
      receivedSubscription.remove();
    };
  }, []);
};

export default usePushNotifications;

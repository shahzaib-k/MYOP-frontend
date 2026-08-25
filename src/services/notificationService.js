import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { colors } from "../constants/theme";

const ANDROID_CHANNEL_ID = "default";

/**
 * Foreground display behaviour. Field names follow the current
 * expo-notifications API (shouldShowBanner/shouldShowList replaced the
 * deprecated shouldShowAlert) — see AGENTS.md's warning about Expo API churn
 * before changing this.
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const ensureAndroidChannel = async () => {
  if (Platform.OS !== "android") {
    return;
  }

  await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
    name: "Order updates",
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: colors.primary,
  });
};

/**
 * Requests permission and returns an Expo push token, or null if the device
 * can't receive push notifications — no physical device, permission denied,
 * or no EAS project configured yet (`expo.extra.eas.projectId`, written by
 * running `eas init`).
 */
export const registerForPushNotificationsAsync = async () => {
  if (!Device.isDevice) {
    console.warn("Push notifications require a physical device.");
    return null;
  }

  await ensureAndroidChannel();

  const existing = await Notifications.getPermissionsAsync();
  let status = existing.status;

  if (status !== "granted") {
    const requested = await Notifications.requestPermissionsAsync();
    status = requested.status;
  }

  if (status !== "granted") {
    console.warn(`Push notification permission not granted (status: ${status}).`);
    return null;
  }

  const projectId = Constants.expoConfig?.extra?.eas?.projectId;

  if (!projectId) {
    console.warn(
      "No EAS projectId configured — run `eas init` to enable push notifications."
    );
    return null;
  }

  const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });

  return token;
};

/** Fires while the app is foregrounded and a notification arrives. */
export const addNotificationReceivedListener = (handler) =>
  Notifications.addNotificationReceivedListener(handler);

/** Fires when the user taps a notification (foreground, background, or cold start). */
export const addNotificationResponseReceivedListener = (handler) =>
  Notifications.addNotificationResponseReceivedListener(handler);

/** The response that reopened the app, if it was launched by tapping a notification. */
export const getLastNotificationResponseAsync = () =>
  Notifications.getLastNotificationResponseAsync();

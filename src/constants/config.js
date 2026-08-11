import { Platform } from "react-native";

/**
 * Base URL resolution order:
 *  1. EXPO_PUBLIC_API_URL from .env (Metro inlines any EXPO_PUBLIC_* variable).
 *  2. A sensible per-platform default for local development.
 *
 * "localhost" from a phone or emulator points at the device itself, not at the
 * machine running the backend, so each platform needs its own default:
 *  - Android emulator reaches the host machine through 10.0.2.2
 *  - iOS simulator and web share the host network, so localhost works
 *  - A physical device needs your LAN IP, e.g. http://192.168.1.10:5000
 */
const DEFAULT_HOSTS = {
  android: "http://10.0.2.2:5000",
  ios: "http://localhost:5000",
  default: "http://localhost:5000",
};

const resolveBaseUrl = () => {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL;

  if (fromEnv && fromEnv.trim() !== "") {
    return fromEnv.trim().replace(/\/+$/, "");
  }

  return Platform.select(DEFAULT_HOSTS);
};

export const API_BASE_URL = resolveBaseUrl();

export const API_TIMEOUT = 15000;

export const CURRENCY_SYMBOL = "Rs";

/** Splash screen is purely cosmetic; keep it short enough to not annoy users. */
export const SPLASH_DURATION = 1600;

/** Maximum quantity a customer may add for a single food item. */
export const MAX_ITEM_QUANTITY = 20;

/** How many smart suggestions to show under the food list. */
export const MAX_SUGGESTIONS = 6;

export const MIN_PASSWORD_LENGTH = 6;

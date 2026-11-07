import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Appearance, useColorScheme } from "react-native";
import { darkColors, lightColors } from "../constants/colors";
import STORAGE_KEYS from "../constants/storageKeys";
import { getItem, setItem } from "../utils/storage";

/**
 * Light / dark theme.
 *
 * `mode` is the customer's choice: "system" (follow the phone, the default),
 * "light" or "dark". The choice is persisted. The effective palette is derived
 * from it, so every component re-renders with the right colours the moment it
 * changes — including when the phone itself switches while the app is open.
 *
 * `Appearance.setColorScheme` is also told about the choice so native pieces
 * the app doesn't draw (alert dialogs, the keyboard) match the app.
 */
export const THEME_MODES = ["system", "light", "dark"];

export const ThemeContext = createContext(null);

const isValidMode = (value) => THEME_MODES.includes(value);

export const ThemeProvider = ({ children }) => {
  const systemScheme = useColorScheme();

  const [mode, setModeState] = useState("system");
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    const restoreMode = async () => {
      const saved = await getItem(STORAGE_KEYS.themeMode);

      if (!isCancelled) {
        if (isValidMode(saved)) {
          setModeState(saved);
        }

        setIsRestoring(false);
      }
    };

    restoreMode();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Keep native dialogs and the keyboard in step with the in-app choice.
  useEffect(() => {
    try {
      // "unspecified" = follow the phone. (Passing null crashes the Android
      // native module in this React Native version.)
      Appearance.setColorScheme(mode === "system" ? "unspecified" : mode);
    } catch (error) {
      // Not supported on this platform/version — the app's own colours still work.
    }
  }, [mode]);

  const setMode = useCallback((nextMode) => {
    if (!isValidMode(nextMode)) {
      return;
    }

    setModeState(nextMode);
    setItem(STORAGE_KEYS.themeMode, nextMode);
  }, []);

  const isDark = mode === "system" ? systemScheme === "dark" : mode === "dark";

  const value = useMemo(
    () => ({
      colors: isDark ? darkColors : lightColors,
      isDark,
      mode,
      setMode,
      isRestoring,
    }),
    [isDark, mode, setMode, isRestoring]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;

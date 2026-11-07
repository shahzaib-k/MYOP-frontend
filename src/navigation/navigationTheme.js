import { DarkTheme, DefaultTheme } from "@react-navigation/native";

/**
 * Feeds the active palette into React Navigation so screen transitions and
 * container backgrounds match the app instead of the library defaults.
 * Built from the dark or light base theme so fonts and flags stay correct.
 */
export const buildNavigationTheme = (colors, isDark) => {
  const base = isDark ? DarkTheme : DefaultTheme;

  return {
    ...base,
    dark: isDark,
    colors: {
      ...base.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
      notification: colors.primary,
    },
  };
};

export default buildNavigationTheme;

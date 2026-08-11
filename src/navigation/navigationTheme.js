import { DefaultTheme } from "@react-navigation/native";
import { colors } from "../constants/theme";

/**
 * Feeds the design system into React Navigation so screen transitions and
 * container backgrounds match the app instead of the library defaults.
 */
export const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
    notification: colors.primary,
  },
};

export default navigationTheme;

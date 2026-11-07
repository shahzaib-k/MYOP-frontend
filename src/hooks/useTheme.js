import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

/**
 * The active palette and theme controls:
 *   const { colors, isDark, mode, setMode } = useTheme();
 *
 * Components build their styles from `colors` (see any `createStyles`) so they
 * re-render when the theme changes.
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside a ThemeProvider");
  }

  return context;
};

export default useTheme;

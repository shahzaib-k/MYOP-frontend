import colors from "./colors";
import typography from "./typography";
import spacing, { radii, shadows } from "./spacing";

/** Barrel import so components can pull the whole design system in one line. */
export const theme = {
  colors,
  typography,
  spacing,
  radii,
  shadows,
};

export { colors, typography, spacing, radii, shadows };

export default theme;

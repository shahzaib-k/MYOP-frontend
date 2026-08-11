/**
 * Single source of truth for colour. Screens and components must never
 * hardcode hex values — import from here so the palette stays consistent.
 */
export const colors = {
  primary: "#FF5A1F",
  primaryDark: "#E14914",
  primarySoft: "#FFF1EB",
  /** Pressed state for surfaces sitting on primarySoft. */
  primarySoftPressed: "#FFE3D6",

  background: "#FFFFFF",
  surface: "#FFFFFF",
  surfaceAlt: "#F6F7F9",
  surfaceSunken: "#EFF1F5",

  text: "#14181F",
  textSecondary: "#4B5563",
  textMuted: "#8A94A6",
  textInverse: "#FFFFFF",

  border: "#ECEEF2",
  borderStrong: "#D9DDE5",

  success: "#0FA968",
  successSoft: "#E6F7F0",
  warning: "#F59E0B",
  warningSoft: "#FEF5E6",
  danger: "#E5484D",
  dangerDark: "#C93B3F",
  dangerSoft: "#FDEDED",
  info: "#3B82F6",
  infoSoft: "#EAF2FE",

  overlay: "rgba(20, 24, 31, 0.45)",
  /** Translucent white for chips sitting on a primary-coloured surface. */
  overlayLight: "rgba(255, 255, 255, 0.25)",
  shadow: "#14181F",
  skeleton: "#E9ECF1",
};

export default colors;

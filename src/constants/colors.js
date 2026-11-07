/**
 * Single source of truth for colour. Screens and components must never
 * hardcode hex values.
 *
 * There are two palettes with identical keys. React code reads the active one
 * through `useTheme()` (see context/ThemeContext.js) so the UI follows light /
 * dark mode. The static `colors` export below is the LIGHT palette and exists
 * only for code that can't use hooks (e.g. native notification config).
 */
export const lightColors = {
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

/**
 * Dark palette. The brand orange stays recognisable; surfaces step up in
 * lightness (background < surface < surfaceAlt) so cards still separate from
 * the page, and the "soft" tints become dark tints instead of pastel ones.
 * `primaryDark` is used both as the pressed colour and as text on tinted
 * backgrounds, so in dark mode it is a lighter orange that stays readable.
 */
export const darkColors = {
  primary: "#FF5A1F",
  primaryDark: "#FF7A45",
  primarySoft: "#3A2118",
  primarySoftPressed: "#4A2B1F",

  background: "#0F1115",
  surface: "#171A21",
  surfaceAlt: "#1E222A",
  surfaceSunken: "#14171D",

  text: "#F2F4F8",
  textSecondary: "#B4BCCB",
  textMuted: "#8590A3",
  textInverse: "#FFFFFF",

  border: "#272C36",
  borderStrong: "#394050",

  success: "#22C47E",
  successSoft: "#12332A",
  warning: "#F5A524",
  warningSoft: "#3A2E14",
  danger: "#F2555A",
  dangerDark: "#D8474C",
  dangerSoft: "#3B1D1F",
  info: "#5B9BFF",
  infoSoft: "#172B4A",

  overlay: "rgba(0, 0, 0, 0.6)",
  overlayLight: "rgba(255, 255, 255, 0.2)",
  shadow: "#000000",
  skeleton: "#252A33",
};

/** Light palette, for code that cannot read the active theme. */
export const colors = lightColors;

export default colors;

import { Platform } from "react-native";

const fontFamily = Platform.select({
  ios: "System",
  android: "sans-serif",
  default: "System",
});

const fontFamilyMedium = Platform.select({
  ios: "System",
  android: "sans-serif-medium",
  default: "System",
});

/**
 * Typography ramp. `weight` is kept separate from `family` because Android
 * needs the -medium family to render mid weights correctly.
 */
export const typography = {
  display: {
    fontFamily: fontFamilyMedium,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  title: {
    fontFamily: fontFamilyMedium,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  heading: {
    fontFamily: fontFamilyMedium,
    fontSize: 19,
    lineHeight: 26,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  subheading: {
    fontFamily: fontFamilyMedium,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "600",
  },
  body: {
    fontFamily,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "400",
  },
  bodyStrong: {
    fontFamily: fontFamilyMedium,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "600",
  },
  caption: {
    fontFamily,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "400",
  },
  captionStrong: {
    fontFamily: fontFamilyMedium,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
  },
  label: {
    fontFamily: fontFamilyMedium,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
};

export default typography;

import { Dimensions, PixelRatio } from "react-native";

/** Reference width: iPhone 11 / most mid-range Android phones in dp. */
const BASE_WIDTH = 390;

const SMALL_DEVICE_WIDTH = 360;
const TABLET_WIDTH = 600;

export const getWindow = () => Dimensions.get("window");

export const isSmallDevice = () => getWindow().width < SMALL_DEVICE_WIDTH;

export const isTablet = () => getWindow().width >= TABLET_WIDTH;

/**
 * Scales a dp value against the reference width so layouts keep their
 * proportions on small phones and tablets. Clamped so text never becomes
 * unreadable or comically large.
 */
export const scaleSize = (size, { min = 0.85, max = 1.25 } = {}) => {
  const ratio = getWindow().width / BASE_WIDTH;
  const clamped = Math.min(Math.max(ratio, min), max);

  return PixelRatio.roundToNearestPixel(size * clamped);
};

/**
 * Number of grid columns for a given minimum tile width, so grids stay
 * responsive without hardcoding column counts per screen.
 *
 * `availableWidth` is passed in rather than read from Dimensions so callers can
 * feed it from useWindowDimensions and re-render on rotation.
 */
export const getColumnCount = (
  availableWidth,
  minTileWidth,
  horizontalPadding = 0
) => {
  const usableWidth = availableWidth - horizontalPadding;

  return Math.max(2, Math.floor(usableWidth / minTileWidth));
};

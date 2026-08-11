import { memo } from "react";
import { StyleSheet, View } from "react-native";
import { colors, radii } from "../../constants/theme";

/** Budget usage bar. `progress` is 0–1 and is clamped defensively. */
const ProgressBar = ({ progress = 0, color = colors.primary, height = 6, style }) => {
  const clamped = Math.min(Math.max(progress, 0), 1);

  return (
    <View style={[styles.track, { height, borderRadius: height }, style]}>
      <View
        style={[
          styles.fill,
          {
            width: `${clamped * 100}%`,
            backgroundColor: color,
            borderRadius: height,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    backgroundColor: colors.surfaceSunken,
    overflow: "hidden",
    borderRadius: radii.pill,
  },
  fill: {
    height: "100%",
  },
});

export default memo(ProgressBar);

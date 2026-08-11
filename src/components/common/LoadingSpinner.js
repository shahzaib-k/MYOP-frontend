import { memo } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "../../constants/theme";

/**
 * Loading indicator. `fullScreen` centres it in the remaining space — use it
 * for first loads; leave it off for inline spinners inside a section.
 */
const LoadingSpinner = ({
  label = "Loading…",
  fullScreen = true,
  size = "large",
  style,
}) => (
  <View style={[fullScreen ? styles.fullScreen : styles.inline, style]}>
    <ActivityIndicator size={size} color={colors.primary} />
    {label ? <Text style={styles.label}>{label}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xxl,
    gap: spacing.md,
  },
  inline: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xl,
    gap: spacing.sm,
  },
  label: {
    ...typography.caption,
    color: colors.textMuted,
  },
});

export default memo(LoadingSpinner);

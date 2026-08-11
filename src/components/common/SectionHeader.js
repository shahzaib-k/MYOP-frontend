import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "../../constants/theme";

/** Title + optional subtitle and trailing action for a list section. */
const SectionHeader = ({
  title,
  subtitle,
  actionLabel,
  onAction,
  style,
}) => (
  <View style={[styles.container, style]}>
    <View style={styles.textGroup}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>

    {actionLabel && onAction ? (
      <Pressable onPress={onAction} hitSlop={8} accessibilityRole="button">
        <Text style={styles.action}>{actionLabel}</Text>
      </Pressable>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  textGroup: {
    flex: 1,
  },
  title: {
    ...typography.heading,
    color: colors.text,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  action: {
    ...typography.captionStrong,
    color: colors.primary,
  },
});

export default memo(SectionHeader);

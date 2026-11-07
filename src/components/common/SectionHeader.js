import { memo, useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { spacing, typography } from "../../constants/theme";
import useTheme from "../../hooks/useTheme";

/** Title + optional subtitle and trailing action for a list section. */
const SectionHeader = ({
  title,
  subtitle,
  actionLabel,
  onAction,
  style,
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
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
};

const createStyles = (colors) => StyleSheet.create({
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

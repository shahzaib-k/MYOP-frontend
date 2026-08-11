import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PrimaryButton from "./PrimaryButton";
import { colors, radii, spacing, typography } from "../../constants/theme";

/**
 * Shown when a request succeeded but returned nothing. Always explains what
 * happened and, where possible, offers the next action.
 */
const EmptyState = ({
  iconName = "fast-food-outline",
  title,
  description,
  actionLabel,
  onAction,
  style,
}) => (
  <View style={[styles.container, style]}>
    <View style={styles.iconCircle}>
      <Ionicons name={iconName} size={32} color={colors.primary} />
    </View>

    <Text style={styles.title}>{title}</Text>

    {description ? <Text style={styles.description}>{description}</Text> : null}

    {actionLabel && onAction ? (
      <PrimaryButton
        label={actionLabel}
        onPress={onAction}
        variant="secondary"
        size="medium"
        fullWidth={false}
        style={styles.action}
      />
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.huge,
    gap: spacing.md,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: radii.pill,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.heading,
    color: colors.text,
    textAlign: "center",
  },
  description: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: "center",
    maxWidth: 320,
  },
  action: {
    marginTop: spacing.sm,
  },
});

export default memo(EmptyState);

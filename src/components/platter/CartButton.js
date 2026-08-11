import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { formatCurrency } from "../../utils/currency";
import { colors, radii, shadows, spacing, typography } from "../../constants/theme";

/**
 * Floating cart bar. Appears only once the platter has at least one item and
 * shows the live item count and total. Turns red when over budget so the
 * warning follows the customer down the list.
 */
const CartButton = ({ itemCount, total, isOverBudget = false, onPress }) => {
  const insets = useSafeAreaInsets();

  if (itemCount <= 0) {
    return null;
  }

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.wrapper,
        { paddingBottom: Math.max(insets.bottom, spacing.lg) },
      ]}
    >
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`View platter, ${itemCount} items, total ${formatCurrency(total)}`}
        style={({ pressed }) => [
          styles.button,
          isOverBudget && styles.buttonOverBudget,
          pressed && styles.pressed,
        ]}
      >
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{itemCount}</Text>
        </View>

        <Text style={styles.label}>View platter</Text>

        <View style={styles.totalGroup}>
          <Text style={styles.total}>{formatCurrency(total)}</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.textInverse} />
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.xl,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    minHeight: 58,
    ...shadows.strong,
  },
  buttonOverBudget: {
    backgroundColor: colors.danger,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  countBadge: {
    minWidth: 28,
    height: 28,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.overlayLight,
    alignItems: "center",
    justifyContent: "center",
  },
  countText: {
    ...typography.captionStrong,
    color: colors.textInverse,
  },
  label: {
    ...typography.bodyStrong,
    color: colors.textInverse,
    flex: 1,
  },
  totalGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  total: {
    ...typography.bodyStrong,
    color: colors.textInverse,
  },
});

export default memo(CartButton);

import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { formatCurrency } from "../../utils/currency";
import { colors, radii, spacing, typography } from "../../constants/theme";

/**
 * Subtotal / total breakdown for the order summary.
 * Subtotal and total are equal today because the backend adds no taxes or
 * delivery charges; both are shown so the breakdown reads normally and any
 * future charge has an obvious place to live.
 */
const OrderTotals = ({ summary, style }) => (
  <View style={[styles.container, style]}>
    <View style={styles.line}>
      <Text style={styles.label}>
        Subtotal ({summary.itemCount} {summary.itemCount === 1 ? "item" : "items"})
      </Text>
      <Text style={styles.value}>{formatCurrency(summary.subtotal)}</Text>
    </View>

    <View style={styles.line}>
      <Text style={styles.label}>Charges</Text>
      <Text style={styles.value}>{formatCurrency(0)}</Text>
    </View>

    <View style={styles.divider} />

    <View style={styles.line}>
      <Text style={styles.totalLabel}>Total</Text>
      <Text
        style={[
          styles.totalValue,
          summary.isOverBudget && styles.totalValueOverBudget,
        ]}
      >
        {formatCurrency(summary.total)}
      </Text>
    </View>

    <View style={styles.line}>
      <Text style={styles.label}>
        {summary.isOverBudget ? "Over budget by" : "Remaining budget"}
      </Text>
      <Text
        style={[
          styles.value,
          { color: summary.isOverBudget ? colors.danger : colors.success },
        ]}
      >
        {formatCurrency(
          summary.isOverBudget ? summary.amountOverBudget : summary.remaining
        )}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.md,
  },
  line: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  label: {
    ...typography.body,
    color: colors.textSecondary,
    flex: 1,
  },
  value: {
    ...typography.bodyStrong,
    color: colors.text,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.borderStrong,
  },
  totalLabel: {
    ...typography.heading,
    color: colors.text,
    flex: 1,
  },
  totalValue: {
    ...typography.heading,
    color: colors.primaryDark,
  },
  totalValueOverBudget: {
    color: colors.danger,
  },
});

export default memo(OrderTotals);

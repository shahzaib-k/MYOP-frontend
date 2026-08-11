import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ProgressBar from "../common/ProgressBar";
import { formatCurrency } from "../../utils/currency";
import { colors, radii, shadows, spacing, typography } from "../../constants/theme";

/**
 * Budget, current total and remaining budget, with a usage bar.
 *
 * Colour carries the meaning: green while there is room, amber once the
 * platter is close to the limit, red once it is over — and the over-budget
 * case swaps in an explicit "Budget Exceeded" banner rather than relying on
 * colour alone.
 */
const NEAR_LIMIT_RATIO = 0.85;

const getStatus = (summary) => {
  if (summary.isOverBudget) {
    return { color: colors.danger, tone: "danger" };
  }

  if (summary.usageRatio >= NEAR_LIMIT_RATIO) {
    return { color: colors.warning, tone: "warning" };
  }

  return { color: colors.success, tone: "success" };
};

const BudgetSummary = ({ summary, style }) => {
  const status = getStatus(summary);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.row}>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Budget</Text>
          <Text style={styles.metricValue}>{formatCurrency(summary.budget)}</Text>
        </View>

        <View style={[styles.metric, styles.metricCenter]}>
          <Text style={styles.metricLabel}>Total</Text>
          <Text style={styles.metricValue}>{formatCurrency(summary.total)}</Text>
        </View>

        <View style={[styles.metric, styles.metricEnd]}>
          <Text style={styles.metricLabel}>
            {summary.isOverBudget ? "Over by" : "Remaining"}
          </Text>
          <Text style={[styles.metricValue, { color: status.color }]}>
            {formatCurrency(
              summary.isOverBudget ? summary.amountOverBudget : summary.remaining
            )}
          </Text>
        </View>
      </View>

      <ProgressBar
        progress={summary.usageRatio}
        color={status.color}
        style={styles.progress}
      />

      {summary.isOverBudget ? (
        <View style={styles.warning}>
          <Ionicons name="warning" size={16} color={colors.danger} />
          <Text style={styles.warningText}>
            Budget Exceeded — remove or swap an item to place your order.
          </Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadows.soft,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  metric: {
    flex: 1,
    gap: spacing.xxs,
  },
  metricCenter: {
    alignItems: "center",
  },
  metricEnd: {
    alignItems: "flex-end",
  },
  metricLabel: {
    ...typography.label,
    color: colors.textMuted,
  },
  metricValue: {
    ...typography.subheading,
    color: colors.text,
  },
  progress: {
    marginTop: spacing.xxs,
  },
  warning: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.dangerSoft,
    borderRadius: radii.md,
    padding: spacing.md,
  },
  warningText: {
    ...typography.caption,
    color: colors.danger,
    flex: 1,
    fontWeight: "600",
  },
});

export default memo(BudgetSummary);

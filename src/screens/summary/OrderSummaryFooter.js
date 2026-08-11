import { memo } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PrimaryButton from "../../components/common/PrimaryButton";
import { colors, shadows, spacing } from "../../constants/theme";

/**
 * Docked action bar for the order summary. Placing an order is blocked while
 * the platter is over budget — the backend rejects those orders too, so the
 * button state matches what the server will actually accept.
 */
const OrderSummaryFooter = ({
  isOverBudget,
  isEmpty,
  isSubmitting,
  onPlaceOrder,
  onAddMore,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: Math.max(insets.bottom, spacing.lg) },
      ]}
    >
      <PrimaryButton
        label="Add more items"
        onPress={onAddMore}
        variant="outline"
        size="medium"
        iconName="add"
      />

      <PrimaryButton
        label={isOverBudget ? "Budget exceeded" : "Place order"}
        onPress={onPlaceOrder}
        isLoading={isSubmitting}
        disabled={isOverBudget || isEmpty}
        iconName={isOverBudget ? "warning-outline" : "checkmark-circle-outline"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    ...shadows.medium,
  },
});

export default memo(OrderSummaryFooter);

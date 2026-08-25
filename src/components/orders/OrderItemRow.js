import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { formatCurrency } from "../../utils/currency";
import { colors, spacing, typography } from "../../constants/theme";

/** Read-only line item for a placed order — no quantity controls, unlike PlatterItemRow. */
const OrderItemRow = ({ item }) => (
  <View style={styles.row}>
    <View style={styles.details}>
      <Text style={styles.name} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={styles.meta}>
        {formatCurrency(item.price)} × {item.quantity}
      </Text>
    </View>
    <Text style={styles.subtotal}>{formatCurrency(item.subtotal)}</Text>
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  details: {
    flex: 1,
    gap: 2,
  },
  name: {
    ...typography.body,
    color: colors.text,
  },
  meta: {
    ...typography.caption,
    color: colors.textMuted,
  },
  subtotal: {
    ...typography.bodyStrong,
    color: colors.text,
  },
});

export default memo(OrderItemRow);

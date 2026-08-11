import { memo, useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Card from "../common/Card";
import RemoteImage from "../common/RemoteImage";
import QuantitySelector from "../common/QuantitySelector";
import { formatCurrency } from "../../utils/currency";
import { getLineSubtotal } from "../../utils/platterCalculations";
import { colors, radii, spacing, typography } from "../../constants/theme";

/**
 * One line of the order summary: item, unit price, quantity controls, line
 * subtotal and an explicit remove action.
 */
const PlatterItemRow = ({ item, onIncrement, onDecrement, onRemove }) => {
  const handleIncrement = useCallback(
    () => onIncrement(item.foodId),
    [onIncrement, item.foodId]
  );
  const handleDecrement = useCallback(
    () => onDecrement(item.foodId),
    [onDecrement, item.foodId]
  );
  const handleRemove = useCallback(
    () => onRemove(item.foodId),
    [onRemove, item.foodId]
  );

  return (
    <Card padded={false} style={styles.card}>
      <View style={styles.row}>
        <RemoteImage uri={item.image} style={styles.image} iconSize={20} />

        <View style={styles.details}>
          <View style={styles.titleRow}>
            <Text style={styles.name} numberOfLines={1}>
              {item.name}
            </Text>

            <Pressable
              onPress={handleRemove}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={`Remove ${item.name}`}
              style={styles.removeButton}
            >
              <Ionicons name="trash-outline" size={16} color={colors.danger} />
            </Pressable>
          </View>

          <Text style={styles.unitPrice}>
            {formatCurrency(item.price)} each
          </Text>

          <View style={styles.footer}>
            <QuantitySelector
              quantity={item.quantity}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
              size="small"
            />

            <Text style={styles.subtotal}>
              {formatCurrency(getLineSubtotal(item))}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: "row",
    padding: spacing.md,
    gap: spacing.md,
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: 12,
  },
  details: {
    flex: 1,
    gap: spacing.xxs,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  name: {
    ...typography.subheading,
    color: colors.text,
    flex: 1,
  },
  removeButton: {
    width: 30,
    height: 30,
    borderRadius: radii.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.dangerSoft,
  },
  unitPrice: {
    ...typography.caption,
    color: colors.textMuted,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  subtotal: {
    ...typography.subheading,
    color: colors.primaryDark,
  },
});

export default memo(PlatterItemRow);

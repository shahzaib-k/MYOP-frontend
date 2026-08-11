import { memo, useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import Card from "../common/Card";
import RemoteImage from "../common/RemoteImage";
import PrimaryButton from "../common/PrimaryButton";
import QuantitySelector from "../common/QuantitySelector";
import Badge from "../common/Badge";
import { formatCurrency } from "../../utils/currency";
import { colors, spacing, typography } from "../../constants/theme";

/**
 * Food list row: image, name, description, price and either an Add button or
 * a quantity selector once the item is in the platter.
 *
 * `remainingBudget` is only used to warn that adding this item would push the
 * platter over budget — it never blocks the action; the customer stays in
 * control and the budget banner shows the consequence.
 */
const FoodCard = ({
  food,
  quantity = 0,
  remainingBudget = 0,
  onAdd,
  onIncrement,
  onDecrement,
}) => {
  const handleAdd = useCallback(() => onAdd(food), [onAdd, food]);
  const handleIncrement = useCallback(
    () => onIncrement(food.id),
    [onIncrement, food.id]
  );
  const handleDecrement = useCallback(
    () => onDecrement(food.id),
    [onDecrement, food.id]
  );

  const isInPlatter = quantity > 0;
  const wouldExceedBudget = !isInPlatter && Number(food.price) > remainingBudget;

  return (
    <Card padded={false} style={styles.card}>
      <View style={styles.row}>
        <RemoteImage uri={food.image} style={styles.image} />

        <View style={styles.details}>
          <Text style={styles.name} numberOfLines={1}>
            {food.name}
          </Text>

          {food.description ? (
            <Text style={styles.description} numberOfLines={2}>
              {food.description}
            </Text>
          ) : null}

          <View style={styles.footer}>
            <View style={styles.priceGroup}>
              <Text style={styles.price}>{formatCurrency(food.price)}</Text>
              {wouldExceedBudget ? (
                <Badge label="Over budget" tone="warning" iconName="alert-circle-outline" />
              ) : null}
            </View>

            {isInPlatter ? (
              <QuantitySelector
                quantity={quantity}
                onIncrement={handleIncrement}
                onDecrement={handleDecrement}
                size="small"
              />
            ) : (
              <PrimaryButton
                label="Add"
                onPress={handleAdd}
                size="small"
                variant="secondary"
                fullWidth={false}
                iconName="add"
                style={styles.addButton}
              />
            )}
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
    width: 92,
    height: 92,
    borderRadius: 14,
  },
  details: {
    flex: 1,
    justifyContent: "space-between",
    gap: spacing.xs,
  },
  name: {
    ...typography.subheading,
    color: colors.text,
  },
  description: {
    ...typography.caption,
    color: colors.textMuted,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
    marginTop: spacing.xxs,
  },
  priceGroup: {
    flex: 1,
    gap: spacing.xxs,
  },
  price: {
    ...typography.subheading,
    color: colors.primaryDark,
  },
  addButton: {
    paddingHorizontal: spacing.lg,
  },
});

export default memo(FoodCard);

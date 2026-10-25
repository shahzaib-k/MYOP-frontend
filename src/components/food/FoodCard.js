import { memo, useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Card from "../common/Card";
import RemoteImage from "../common/RemoteImage";
import PrimaryButton from "../common/PrimaryButton";
import QuantitySelector from "../common/QuantitySelector";
import Badge from "../common/Badge";
import { formatCurrency } from "../../utils/currency";
import { isSoldOut } from "../../utils/foodAvailability";
import { colors, spacing, typography } from "../../constants/theme";

/**
 * Food list row: image, name, description, price and either an Add button or
 * a quantity selector once the item is in the platter.
 *
 * `remainingBudget` is only used to warn that adding this item would push the
 * platter over budget — it never blocks the action; the customer stays in
 * control and the budget banner shows the consequence.
 *
 * A sold-out item is greyed out and cannot be added. If one is already in the
 * platter (it sold out after being added) the only action offered is Remove.
 */
const FoodCard = ({
  food,
  quantity = 0,
  remainingBudget = 0,
  isFavourite = false,
  onAdd,
  onIncrement,
  onDecrement,
  onRemove,
  onToggleFavourite,
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
  const handleRemove = useCallback(
    () => onRemove?.(food.id),
    [onRemove, food.id]
  );
  const handleToggleFavourite = useCallback(
    () => onToggleFavourite?.(food.id),
    [onToggleFavourite, food.id]
  );

  const soldOut = isSoldOut(food);
  const isInPlatter = quantity > 0;
  const wouldExceedBudget =
    !soldOut && !isInPlatter && Number(food.price) > remainingBudget;

  const renderAction = () => {
    if (soldOut) {
      return isInPlatter ? (
        <PrimaryButton
          label="Remove"
          onPress={handleRemove}
          size="small"
          variant="outline"
          fullWidth={false}
          iconName="trash-outline"
          style={styles.addButton}
        />
      ) : (
        <PrimaryButton
          label="Sold out"
          size="small"
          variant="secondary"
          fullWidth={false}
          disabled
          style={styles.addButton}
        />
      );
    }

    if (isInPlatter) {
      return (
        <QuantitySelector
          quantity={quantity}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
          size="small"
        />
      );
    }

    return (
      <PrimaryButton
        label="Add"
        onPress={handleAdd}
        size="small"
        variant="secondary"
        fullWidth={false}
        iconName="add"
        style={styles.addButton}
      />
    );
  };

  return (
    <Card padded={false} style={styles.card}>
      <View style={styles.row}>
        <View style={soldOut && styles.dimmed}>
          <RemoteImage uri={food.image} style={styles.image} />
        </View>

        <View style={styles.details}>
          <View style={styles.titleRow}>
            <Text
              style={[styles.name, soldOut && styles.dimmedText]}
              numberOfLines={1}
            >
              {food.name}
            </Text>

            {onToggleFavourite ? (
              <Pressable
                onPress={handleToggleFavourite}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel={
                  isFavourite ? "Remove from favourites" : "Add to favourites"
                }
                accessibilityState={{ selected: isFavourite }}
              >
                <Ionicons
                  name={isFavourite ? "heart" : "heart-outline"}
                  size={22}
                  color={isFavourite ? colors.danger : colors.textMuted}
                />
              </Pressable>
            ) : null}
          </View>

          {food.description ? (
            <Text
              style={[styles.description, soldOut && styles.dimmedText]}
              numberOfLines={2}
            >
              {food.description}
            </Text>
          ) : null}

          <View style={styles.footer}>
            <View style={styles.priceGroup}>
              <Text style={[styles.price, soldOut && styles.dimmedText]}>
                {formatCurrency(food.price)}
              </Text>
              {soldOut ? (
                <Badge label="Sold out" tone="danger" iconName="ban-outline" />
              ) : wouldExceedBudget ? (
                <Badge label="Over budget" tone="warning" iconName="alert-circle-outline" />
              ) : null}
            </View>

            {renderAction()}
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
  dimmed: {
    opacity: 0.4,
  },
  dimmedText: {
    opacity: 0.5,
  },
  details: {
    flex: 1,
    justifyContent: "space-between",
    gap: spacing.xs,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  name: {
    ...typography.subheading,
    flex: 1,
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

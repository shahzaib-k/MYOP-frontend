import { memo, useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Card from "../common/Card";
import RemoteImage from "../common/RemoteImage";
import { formatCurrency } from "../../utils/currency";
import { colors, radii, spacing, typography } from "../../constants/theme";

/** Compact tile used in the horizontal Smart Suggestions strip. */
const SuggestionCard = ({ food, onAdd }) => {
  const handleAdd = useCallback(() => onAdd(food), [onAdd, food]);

  return (
    <Card
      onPress={handleAdd}
      padded={false}
      style={styles.card}
      accessibilityLabel={`Add ${food.name} for ${formatCurrency(food.price)}`}
    >
      <RemoteImage uri={food.image} style={styles.image} iconSize={22} />

      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>
          {food.name}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.price}>{formatCurrency(food.price)}</Text>
          <View style={styles.addBadge}>
            <Ionicons name="add" size={14} color={colors.textInverse} />
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 150,
  },
  image: {
    width: "100%",
    height: 84,
  },
  body: {
    padding: spacing.sm,
    gap: spacing.xs,
  },
  name: {
    ...typography.captionStrong,
    color: colors.text,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.xs,
  },
  price: {
    ...typography.captionStrong,
    color: colors.primaryDark,
    flex: 1,
  },
  addBadge: {
    width: 24,
    height: 24,
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default memo(SuggestionCard);

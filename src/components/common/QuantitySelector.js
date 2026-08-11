import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MAX_ITEM_QUANTITY } from "../../constants/config";
import { colors, radii, spacing, typography } from "../../constants/theme";

const SIZES = {
  small: { button: 28, icon: 15, minWidth: 26 },
  medium: { button: 34, icon: 18, minWidth: 30 },
};

/**
 * Minus / count / plus control. Decrementing past 1 is allowed and reported to
 * the parent — the platter reducer removes the line when quantity hits zero,
 * which is what makes the minus button double as "remove".
 */
const QuantitySelector = ({
  quantity,
  onIncrement,
  onDecrement,
  size = "medium",
  maxQuantity = MAX_ITEM_QUANTITY,
  style,
}) => {
  const dimensions = SIZES[size] || SIZES.medium;
  const canIncrement = quantity < maxQuantity;

  const renderButton = (iconName, onPress, isEnabled, label) => (
    <Pressable
      onPress={isEnabled ? onPress : undefined}
      disabled={!isEnabled}
      hitSlop={6}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.button,
        {
          width: dimensions.button,
          height: dimensions.button,
        },
        pressed && isEnabled && styles.buttonPressed,
        !isEnabled && styles.buttonDisabled,
      ]}
    >
      <Ionicons
        name={iconName}
        size={dimensions.icon}
        color={isEnabled ? colors.primaryDark : colors.textMuted}
      />
    </Pressable>
  );

  return (
    <View style={[styles.container, style]}>
      {renderButton("remove", onDecrement, true, "Decrease quantity")}

      <Text
        style={[styles.quantity, { minWidth: dimensions.minWidth }]}
        accessibilityLabel={`Quantity ${quantity}`}
      >
        {quantity}
      </Text>

      {renderButton("add", onIncrement, canIncrement, "Increase quantity")}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: radii.pill,
    padding: spacing.xxs,
    gap: spacing.xxs,
  },
  button: {
    borderRadius: radii.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
  },
  buttonPressed: {
    backgroundColor: colors.surfaceSunken,
  },
  buttonDisabled: {
    backgroundColor: "transparent",
  },
  quantity: {
    ...typography.bodyStrong,
    color: colors.primaryDark,
    textAlign: "center",
  },
});

export default memo(QuantitySelector);

import { memo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { colors, radii, shadows, spacing } from "../../constants/theme";

/**
 * Rounded, softly shadowed surface used for every card in the app.
 * Renders a Pressable only when `onPress` is supplied, so static cards stay
 * out of the touch hierarchy.
 */
const Card = ({
  children,
  onPress,
  elevation = "soft",
  padded = true,
  style,
  ...rest
}) => {
  const cardStyle = [
    styles.card,
    shadows[elevation] || shadows.soft,
    padded && styles.padded,
    style,
  ];

  if (!onPress) {
    return (
      <View style={cardStyle} {...rest}>
        {children}
      </View>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [...cardStyle, pressed && styles.pressed]}
      {...rest}
    >
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    overflow: "hidden",
  },
  padded: {
    padding: spacing.lg,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
});

export default memo(Card);

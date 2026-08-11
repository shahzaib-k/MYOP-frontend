import { memo } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radii, shadows, spacing, typography } from "../../constants/theme";

/**
 * The app's one button component. Variants keep call sites declarative
 * (`variant="outline"`) instead of each screen restyling a Pressable.
 */
const VARIANT_STYLES = {
  primary: {
    container: { backgroundColor: colors.primary },
    pressed: { backgroundColor: colors.primaryDark },
    label: { color: colors.textInverse },
  },
  secondary: {
    container: { backgroundColor: colors.primarySoft },
    pressed: { backgroundColor: colors.primarySoftPressed },
    label: { color: colors.primaryDark },
  },
  outline: {
    container: {
      backgroundColor: "transparent",
      borderWidth: 1.5,
      borderColor: colors.borderStrong,
    },
    pressed: { backgroundColor: colors.surfaceAlt },
    label: { color: colors.text },
  },
  ghost: {
    container: { backgroundColor: "transparent" },
    pressed: { backgroundColor: colors.surfaceAlt },
    label: { color: colors.primary },
  },
  danger: {
    container: { backgroundColor: colors.danger },
    pressed: { backgroundColor: colors.dangerDark },
    label: { color: colors.textInverse },
  },
};

const SIZE_STYLES = {
  small: { paddingVertical: spacing.sm, minHeight: 38, fontSize: 13 },
  medium: { paddingVertical: spacing.md, minHeight: 48, fontSize: 15 },
  large: { paddingVertical: spacing.lg, minHeight: 56, fontSize: 16 },
};

const PrimaryButton = ({
  label,
  onPress,
  variant = "primary",
  size = "large",
  isLoading = false,
  disabled = false,
  fullWidth = true,
  iconName = null,
  iconPosition = "left",
  elevated = false,
  style,
}) => {
  const variantStyle = VARIANT_STYLES[variant] || VARIANT_STYLES.primary;
  const sizeStyle = SIZE_STYLES[size] || SIZE_STYLES.large;
  const isInteractive = !disabled && !isLoading;

  const icon = iconName ? (
    <Ionicons
      name={iconName}
      size={sizeStyle.fontSize + 3}
      color={variantStyle.label.color}
    />
  ) : null;

  return (
    <Pressable
      onPress={isInteractive ? onPress : undefined}
      disabled={!isInteractive}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !isInteractive, busy: isLoading }}
      style={({ pressed }) => [
        styles.base,
        { paddingVertical: sizeStyle.paddingVertical, minHeight: sizeStyle.minHeight },
        variantStyle.container,
        fullWidth && styles.fullWidth,
        elevated && shadows.medium,
        pressed && isInteractive && variantStyle.pressed,
        !isInteractive && styles.disabled,
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={variantStyle.label.color} />
      ) : (
        <View style={styles.content}>
          {iconPosition === "left" ? icon : null}
          <Text
            style={[
              styles.label,
              variantStyle.label,
              { fontSize: sizeStyle.fontSize },
            ]}
            numberOfLines={1}
          >
            {label}
          </Text>
          {iconPosition === "right" ? icon : null}
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.lg,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  fullWidth: {
    alignSelf: "stretch",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  label: {
    ...typography.bodyStrong,
    textAlign: "center",
  },
  disabled: {
    opacity: 0.45,
  },
});

export default memo(PrimaryButton);

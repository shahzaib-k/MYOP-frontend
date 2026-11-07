import { memo, useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PAYMENT_METHOD_OPTIONS } from "../../constants/paymentMethods";
import { radii, spacing, typography } from "../../constants/theme";
import useTheme from "../../hooks/useTheme";

/** Radio-style choice between cash on delivery and online card payment. */
const PaymentMethodSelector = ({ value, onChange, disabled }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment method</Text>

      {PAYMENT_METHOD_OPTIONS.map((option) => {
        const isSelected = option.value === value;

        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            disabled={disabled}
            accessibilityRole="radio"
            accessibilityState={{ selected: isSelected, disabled }}
            style={[styles.option, isSelected && styles.optionSelected]}
          >
            <Ionicons
              name={option.iconName}
              size={24}
              color={isSelected ? colors.primary : colors.textSecondary}
            />
            <View style={styles.optionText}>
              <Text style={styles.optionLabel}>{option.label}</Text>
              <Text style={styles.optionDescription}>{option.description}</Text>
            </View>
            <Ionicons
              name={isSelected ? "radio-button-on" : "radio-button-off"}
              size={22}
              color={isSelected ? colors.primary : colors.borderStrong}
            />
          </Pressable>
        );
      })}
    </View>
  );
};

const createStyles = (colors) => StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  title: {
    ...typography.subheading,
    color: colors.text,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  optionText: {
    flex: 1,
  },
  optionLabel: {
    ...typography.bodyStrong,
    color: colors.text,
  },
  optionDescription: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});

export default memo(PaymentMethodSelector);

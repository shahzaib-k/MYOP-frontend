import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radii, spacing, typography } from "../../constants/theme";

/**
 * Row of selectable chips. `options` is [{ label, value }]; the selected chip
 * is matched by value so callers can pass numbers or strings.
 */
const ChipGroup = ({ options, selectedValue, onSelect, style }) => (
  <View style={[styles.container, style]}>
    {options.map((option) => {
      const isSelected = option.value === selectedValue;

      return (
        <Pressable
          key={String(option.value)}
          onPress={() => onSelect(option.value)}
          accessibilityRole="button"
          accessibilityState={{ selected: isSelected }}
          style={({ pressed }) => [
            styles.chip,
            isSelected && styles.chipSelected,
            pressed && !isSelected && styles.chipPressed,
          ]}
        >
          <Text style={[styles.label, isSelected && styles.labelSelected]}>
            {option.label}
          </Text>
        </Pressable>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
  },
  chipSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  chipPressed: {
    backgroundColor: colors.surfaceSunken,
  },
  label: {
    ...typography.captionStrong,
    color: colors.textSecondary,
  },
  labelSelected: {
    color: colors.primaryDark,
  },
});

export default memo(ChipGroup);

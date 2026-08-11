import { memo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Badge from "../common/Badge";
import { formatCurrency } from "../../utils/currency";
import { colors, radii, spacing, typography } from "../../constants/theme";

/**
 * Over-budget rescue: cheaper items from the same category, straight from
 * POST /api/recommendations/review. Tapping a swap replaces the expensive item
 * with the cheaper one at the same quantity.
 *
 * `alternatives` shape:
 *   [{ replaceFoodId, replaceName, replacePrice, resolvesBudget,
 *      options: [{ foodId, name, category, price, image, savings }] }]
 */
const AlternativesSection = ({ alternatives, onSwap, style }) => {
  if (!alternatives || alternatives.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Ionicons name="swap-horizontal" size={18} color={colors.primaryDark} />
        <Text style={styles.title}>Cheaper swaps</Text>
      </View>

      <Text style={styles.subtitle}>
        Replace an item to get back within your budget.
      </Text>

      {alternatives.map((group) => (
        <View key={group.replaceFoodId} style={styles.group}>
          <View style={styles.groupHeader}>
            <Text style={styles.groupTitle} numberOfLines={1}>
              Instead of {group.replaceName}
            </Text>
            {group.resolvesBudget ? (
              <Badge label="Fixes budget" tone="success" iconName="checkmark-circle" />
            ) : null}
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.options}
          >
            {group.options.map((option) => (
              <Pressable
                key={option.foodId}
                onPress={() => onSwap(group.replaceFoodId, option)}
                accessibilityRole="button"
                accessibilityLabel={`Swap ${group.replaceName} for ${option.name}`}
                style={({ pressed }) => [
                  styles.option,
                  pressed && styles.optionPressed,
                ]}
              >
                <Text style={styles.optionName} numberOfLines={1}>
                  {option.name}
                </Text>
                <Text style={styles.optionPrice}>
                  {formatCurrency(option.price)}
                </Text>
                <Text style={styles.optionSavings}>
                  Save {formatCurrency(option.savings)}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primarySoft,
    borderRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  title: {
    ...typography.subheading,
    color: colors.text,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  group: {
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  groupTitle: {
    ...typography.captionStrong,
    color: colors.textSecondary,
    flex: 1,
  },
  options: {
    gap: spacing.sm,
    paddingRight: spacing.sm,
  },
  option: {
    minWidth: 132,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    gap: spacing.xxs,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  optionPressed: {
    backgroundColor: colors.surfaceAlt,
  },
  optionName: {
    ...typography.captionStrong,
    color: colors.text,
  },
  optionPrice: {
    ...typography.bodyStrong,
    color: colors.primaryDark,
  },
  optionSavings: {
    ...typography.caption,
    color: colors.success,
  },
});

export default memo(AlternativesSection);

import { memo } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import SuggestionCard from "./SuggestionCard";
import Badge from "../common/Badge";
import { formatCurrency } from "../../utils/currency";
import { colors, spacing, typography } from "../../constants/theme";

/**
 * Smart Suggestions strip: items that still fit inside the remaining budget.
 * Renders nothing at all when there is no budget left or nothing to suggest,
 * so it never occupies space with an empty shell.
 */
const SuggestionsSection = ({
  suggestions,
  remainingBudget,
  isLoading,
  usedFallback,
  onAdd,
}) => {
  if (remainingBudget <= 0) {
    return null;
  }

  if (!isLoading && suggestions.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleGroup}>
          <Text style={styles.title}>Fits your remaining budget</Text>
          <Text style={styles.subtitle}>
            {formatCurrency(remainingBudget)} left to spend
          </Text>
        </View>

        {isLoading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : usedFallback ? (
          <Badge label="Offline picks" tone="neutral" iconName="cloud-offline-outline" />
        ) : null}
      </View>

      {suggestions.length > 0 ? (
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SuggestionCard food={item} onAdd={onAdd} />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.list}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  titleGroup: {
    flex: 1,
  },
  title: {
    ...typography.subheading,
    color: colors.text,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  list: {
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
});

export default memo(SuggestionsSection);

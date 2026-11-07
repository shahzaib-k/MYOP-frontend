import { memo, useMemo } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { radii, spacing, typography } from "../../constants/theme";
import { formatCurrency } from "../../utils/currency";
import useTheme from "../../hooks/useTheme";

const StatTile = ({ label, value, isLoading }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.tile}>
      {isLoading ? (
        <ActivityIndicator size="small" color={colors.primary} />
      ) : (
        <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit>
          {value}
        </Text>
      )}
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

/** Three headline numbers: orders placed, orders in progress, total spent. */
const ProfileStats = ({ stats, isLoading }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.row}>
      <StatTile label="Orders" value={stats.totalOrders} isLoading={isLoading} />
      <StatTile label="Active" value={stats.activeOrders} isLoading={isLoading} />
      <StatTile
        label="Spent"
        value={formatCurrency(stats.totalSpent)}
        isLoading={isLoading}
      />
    </View>
  );
};

const createStyles = (colors) => StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: spacing.md,
  },
  tile: {
    flex: 1,
    minHeight: 76,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  value: {
    ...typography.subheading,
    color: colors.text,
  },
  label: {
    ...typography.caption,
    color: colors.textMuted,
  },
});

export default memo(ProfileStats);

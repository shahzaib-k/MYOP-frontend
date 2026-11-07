import { memo, useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { radii, spacing, typography } from "../../constants/theme";
import useTheme from "../../hooks/useTheme";

/** One tappable row in the profile menu. `danger` styles destructive actions. */
const ProfileMenuItem = ({ iconName, label, value, onPress, danger = false }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const tint = danger ? colors.danger : colors.primary;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
    >
      <View style={[styles.iconWrap, danger && styles.iconWrapDanger]}>
        <Ionicons name={iconName} size={18} color={tint} />
      </View>

      <Text style={[styles.label, danger && styles.labelDanger]}>{label}</Text>

      {value ? (
        <Text style={styles.value} numberOfLines={1}>
          {value}
        </Text>
      ) : null}

      {danger ? null : (
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      )}
    </Pressable>
  );
};

const createStyles = (colors) => StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.lg,
  },
  rowPressed: {
    backgroundColor: colors.surfaceAlt,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: radii.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primarySoft,
  },
  iconWrapDanger: {
    backgroundColor: colors.dangerSoft,
  },
  label: {
    ...typography.bodyStrong,
    flex: 1,
    color: colors.text,
  },
  labelDanger: {
    color: colors.danger,
  },
  value: {
    ...typography.caption,
    maxWidth: "40%",
    color: colors.textMuted,
  },
});

export default memo(ProfileMenuItem);

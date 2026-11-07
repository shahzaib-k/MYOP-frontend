import { memo, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { radii, spacing, typography } from "../../constants/theme";
import useTheme from "../../hooks/useTheme";

const getTones = (colors) => ({
  neutral: { background: colors.surfaceSunken, text: colors.textSecondary },
  primary: { background: colors.primarySoft, text: colors.primaryDark },
  success: { background: colors.successSoft, text: colors.success },
  warning: { background: colors.warningSoft, text: colors.warning },
  danger: { background: colors.dangerSoft, text: colors.danger },
  info: { background: colors.infoSoft, text: colors.info },
});

/** Small pill label — category tags, budget status, item counts. */
const Badge = ({ label, tone = "neutral", iconName = null, style }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const tones = useMemo(() => getTones(colors), [colors]);
  const palette = tones[tone] || tones.neutral;

  return (
    <View style={[styles.badge, { backgroundColor: palette.background }, style]}>
      {iconName ? (
        <Ionicons name={iconName} size={12} color={palette.text} />
      ) : null}
      <Text style={[styles.label, { color: palette.text }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
};

const createStyles = (colors) => StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
  },
  label: {
    ...typography.captionStrong,
    fontSize: 11,
    lineHeight: 15,
  },
});

export default memo(Badge);

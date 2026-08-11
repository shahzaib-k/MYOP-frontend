import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radii, spacing, typography } from "../../constants/theme";

const TONES = {
  neutral: { background: colors.surfaceSunken, text: colors.textSecondary },
  primary: { background: colors.primarySoft, text: colors.primaryDark },
  success: { background: colors.successSoft, text: colors.success },
  warning: { background: colors.warningSoft, text: colors.warning },
  danger: { background: colors.dangerSoft, text: colors.danger },
  info: { background: colors.infoSoft, text: colors.info },
};

/** Small pill label — category tags, budget status, item counts. */
const Badge = ({ label, tone = "neutral", iconName = null, style }) => {
  const palette = TONES[tone] || TONES.neutral;

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

const styles = StyleSheet.create({
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

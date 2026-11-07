import { memo, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ChipGroup from "../common/ChipGroup";
import { radii, spacing, typography } from "../../constants/theme";
import useTheme from "../../hooks/useTheme";

const OPTIONS = [
  { label: "System", value: "system" },
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
];

const HELP_TEXT = {
  system: "Matches your phone's light or dark setting.",
  light: "Always use the light theme.",
  dark: "Always use the dark theme.",
};

/** Theme picker on the Profile screen: follow the phone, or force light/dark. */
const AppearanceSelector = () => {
  const { colors, isDark, mode, setMode } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <Ionicons
            name={isDark ? "moon-outline" : "sunny-outline"}
            size={18}
            color={colors.primary}
          />
        </View>
        <View style={styles.titleGroup}>
          <Text style={styles.title}>Appearance</Text>
          <Text style={styles.help}>{HELP_TEXT[mode]}</Text>
        </View>
      </View>

      <ChipGroup options={OPTIONS} selectedValue={mode} onSelect={setMode} />
    </View>
  );
};

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      gap: spacing.md,
      padding: spacing.lg,
      borderRadius: radii.xl,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
    },
    iconWrap: {
      width: 36,
      height: 36,
      borderRadius: radii.pill,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primarySoft,
    },
    titleGroup: {
      flex: 1,
    },
    title: {
      ...typography.bodyStrong,
      color: colors.text,
    },
    help: {
      ...typography.caption,
      color: colors.textMuted,
    },
  });

export default memo(AppearanceSelector);

import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PrimaryButton from "./PrimaryButton";
import { colors, radii, spacing, typography } from "../../constants/theme";

/**
 * Error surface with two shapes:
 *  - `variant="inline"` (default): a compact banner above a form
 *  - `variant="block"`: a centred full-area state with a Try again button
 *
 * `details` renders backend validation hints such as "Missing fields: items".
 */
const ErrorMessage = ({
  message,
  details = [],
  onRetry,
  retryLabel = "Try again",
  variant = "inline",
  style,
}) => {
  if (!message) {
    return null;
  }

  const isBlock = variant === "block";

  return (
    <View style={[isBlock ? styles.block : styles.inline, style]}>
      <View style={isBlock ? styles.blockIcon : styles.inlineIconRow}>
        <Ionicons
          name="alert-circle"
          size={isBlock ? 30 : 18}
          color={colors.danger}
        />
        {!isBlock ? (
          <Text style={styles.inlineText}>{message}</Text>
        ) : null}
      </View>

      {isBlock ? <Text style={styles.blockText}>{message}</Text> : null}

      {details.length > 0 ? (
        <View style={styles.details}>
          {details.map((detail) => (
            <Text key={detail} style={styles.detailText}>
              • {detail}
            </Text>
          ))}
        </View>
      ) : null}

      {onRetry ? (
        <PrimaryButton
          label={retryLabel}
          onPress={onRetry}
          variant={isBlock ? "secondary" : "ghost"}
          size="small"
          fullWidth={false}
          iconName="refresh"
          style={styles.retry}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  inline: {
    backgroundColor: colors.dangerSoft,
    borderRadius: radii.md,
    padding: spacing.md,
    gap: spacing.xs,
  },
  inlineIconRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  inlineText: {
    ...typography.caption,
    color: colors.danger,
    flex: 1,
  },
  block: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.huge,
    gap: spacing.sm,
  },
  blockIcon: {
    width: 68,
    height: 68,
    borderRadius: radii.pill,
    backgroundColor: colors.dangerSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
  },
  blockText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
    maxWidth: 320,
  },
  details: {
    gap: 2,
    alignSelf: "stretch",
    paddingLeft: spacing.xs,
  },
  detailText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  retry: {
    marginTop: spacing.sm,
  },
});

export default memo(ErrorMessage);

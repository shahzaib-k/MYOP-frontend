import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, radii, spacing, typography } from "../../constants/theme";
import { formatMemberSince, getInitials } from "../../utils/profile";

/** Avatar with initials, plus the account's name, email and join date. */
const ProfileHeaderCard = ({ user }) => {
  const memberSince = formatMemberSince(user?.createdAt);

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.initials}>{getInitials(user?.name)}</Text>
      </View>

      <View style={styles.details}>
        <Text style={styles.name} numberOfLines={1}>
          {user?.name || "Customer"}
        </Text>
        <Text style={styles.email} numberOfLines={1}>
          {user?.email}
        </Text>
        {memberSince ? (
          <Text style={styles.since}>Member since {memberSince}</Text>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
    padding: spacing.lg,
    borderRadius: radii.xl,
    backgroundColor: colors.surfaceAlt,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: radii.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },
  initials: {
    ...typography.title,
    color: colors.textInverse,
  },
  details: {
    flex: 1,
    gap: spacing.xxs,
  },
  name: {
    ...typography.subheading,
    color: colors.text,
  },
  email: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  since: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xxs,
  },
});

export default memo(ProfileHeaderCard);

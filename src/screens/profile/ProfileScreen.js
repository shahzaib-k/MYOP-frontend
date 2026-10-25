import { useCallback } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import ScreenContainer from "../../components/common/ScreenContainer";
import AppHeader from "../../components/common/AppHeader";
import ProfileHeaderCard from "../../components/profile/ProfileHeaderCard";
import ProfileStats from "../../components/profile/ProfileStats";
import ProfileMenuItem from "../../components/profile/ProfileMenuItem";
import useAuth from "../../hooks/useAuth";
import useProfileStats from "../../hooks/useProfileStats";
import ROUTES, { TABS } from "../../navigation/routes";
import { colors, radii, spacing } from "../../constants/theme";

/** Account hub: who you are, your order numbers, and account actions. */
const ProfileScreen = ({ navigation }) => {
  const { user, signOut } = useAuth();
  const { stats, isLoading, refetch } = useProfileStats();

  // Order numbers change while the user is elsewhere in the app.
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const handleEditProfile = useCallback(
    () => navigation.navigate(ROUTES.editProfile),
    [navigation]
  );

  // `initial: false` keeps Budget at the bottom of the Order stack, so Back
  // from Favourites lands somewhere sensible even if the tab was never opened.
  const handleOpenFavourites = useCallback(
    () =>
      navigation.navigate(TABS.order, {
        screen: ROUTES.favourites,
        initial: false,
      }),
    [navigation]
  );

  const handleChangePassword = useCallback(
    () => navigation.navigate(ROUTES.changePassword),
    [navigation]
  );

  const handleSignOut = useCallback(() => {
    Alert.alert("Sign out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign out", style: "destructive", onPress: signOut },
    ]);
  }, [signOut]);

  return (
    <ScreenContainer>
      <AppHeader title="Profile" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeaderCard user={user} />
        <ProfileStats stats={stats} isLoading={isLoading} />

        <View style={styles.menu}>
          <ProfileMenuItem
            iconName="heart-outline"
            label="My favourites"
            onPress={handleOpenFavourites}
          />
          <ProfileMenuItem
            iconName="person-outline"
            label="Edit profile"
            value={user?.phone}
            onPress={handleEditProfile}
          />
          <ProfileMenuItem
            iconName="lock-closed-outline"
            label="Change password"
            onPress={handleChangePassword}
          />
        </View>

        <View style={styles.menu}>
          <ProfileMenuItem
            iconName="log-out-outline"
            label="Sign out"
            onPress={handleSignOut}
            danger
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
    gap: spacing.xl,
  },
  menu: {
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.xs,
  },
});

export default ProfileScreen;

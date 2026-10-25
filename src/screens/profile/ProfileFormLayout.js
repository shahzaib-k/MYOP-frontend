import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import ScreenContainer from "../../components/common/ScreenContainer";
import AppHeader from "../../components/common/AppHeader";
import PrimaryButton from "../../components/common/PrimaryButton";
import ErrorMessage from "../../components/common/ErrorMessage";
import { colors, spacing } from "../../constants/theme";

/**
 * Shared shell for the profile form screens: a header with a back button,
 * scrollable fields, an inline error banner and a docked submit button.
 */
const ProfileFormLayout = ({
  title,
  subtitle,
  onBack,
  error,
  errorDetails,
  submitLabel,
  onSubmit,
  isSubmitting,
  children,
}) => (
  <ScreenContainer>
    <AppHeader title={title} subtitle={subtitle} onBack={onBack} />

    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <ErrorMessage message={error} details={errorDetails} />
        {children}
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          label={submitLabel}
          onPress={onSubmit}
          isLoading={isSubmitting}
        />
      </View>
    </KeyboardAvoidingView>
  </ScreenContainer>
);

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    backgroundColor: colors.background,
  },
});

export default ProfileFormLayout;

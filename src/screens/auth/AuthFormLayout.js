import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ScreenContainer from "../../components/common/ScreenContainer";
import { colors, radii, spacing, typography } from "../../constants/theme";

/**
 * Shared chrome for Login and Register: branded header, keyboard handling,
 * scrollable body and a footer link to the other screen. Keeps both auth
 * screens focused on their fields and validation.
 */
const AuthFormLayout = ({
  title,
  subtitle,
  children,
  footerText,
  footerActionLabel,
  onFooterAction,
}) => (
  <ScreenContainer>
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.logo}>
            <Ionicons name="restaurant" size={26} color={colors.textInverse} />
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        <View style={styles.body}>{children}</View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{footerText}</Text>
          <Pressable
            onPress={onFooterAction}
            hitSlop={8}
            accessibilityRole="button"
          >
            <Text style={styles.footerAction}>{footerActionLabel}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  </ScreenContainer>
);

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxxl,
  },
  header: {
    gap: spacing.xs,
    marginBottom: spacing.xxl,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: radii.lg,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.display,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
  },
  body: {
    flex: 1,
    gap: spacing.lg,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    marginTop: spacing.xxl,
  },
  footerText: {
    ...typography.body,
    color: colors.textMuted,
  },
  footerAction: {
    ...typography.bodyStrong,
    color: colors.primary,
  },
});

export default AuthFormLayout;

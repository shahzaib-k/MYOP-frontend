import { useCallback, useEffect, useState } from "react";
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
import TextField from "../../components/common/TextField";
import PrimaryButton from "../../components/common/PrimaryButton";
import ChipGroup from "../../components/common/ChipGroup";
import { CURRENCY_SYMBOL } from "../../constants/config";
import { colors, radii, spacing, typography } from "../../constants/theme";
import { sanitizeNumericInput } from "../../utils/currency";
import { validateBudget } from "../../validations/budgetValidation";
import usePlatter from "../../hooks/usePlatter";
import useAuth from "../../hooks/useAuth";
import ROUTES from "../../navigation/routes";

const QUICK_AMOUNTS = [500, 1000, 1500, 2500].map((amount) => ({
  label: `${CURRENCY_SYMBOL} ${amount}`,
  value: String(amount),
}));

/**
 * Step 1 of the flow. Purely local — no backend call. The value is kept in
 * PlatterContext (and persisted) so every later screen can price against it.
 */
const BudgetScreen = ({ navigation }) => {
  const { budget, setBudget } = usePlatter();
  const { user, signOut } = useAuth();

  const [value, setValue] = useState("");
  const [error, setError] = useState(null);

  // Prefill with the budget from a previous session once it has been restored.
  useEffect(() => {
    if (budget > 0) {
      setValue(String(budget));
    }
  }, [budget]);

  const handleChange = useCallback((text) => {
    setValue(sanitizeNumericInput(text));
    setError(null);
  }, []);

  const handleContinue = useCallback(() => {
    const validationError = validateBudget(value);

    if (validationError) {
      setError(validationError);
      return;
    }

    setBudget(Number(value));
    navigation.navigate(ROUTES.categories);
  }, [value, setBudget, navigation]);

  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topBar}>
            <View style={styles.greetingGroup}>
              <Text style={styles.greeting}>Hi {firstName} 👋</Text>
              <Text style={styles.greetingSub}>Let's build your platter</Text>
            </View>

            <Pressable
              onPress={signOut}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Sign out"
              style={styles.signOutButton}
            >
              <Ionicons name="log-out-outline" size={20} color={colors.textSecondary} />
            </Pressable>
          </View>

          <View style={styles.hero}>
            <Text style={styles.title}>What's your budget?</Text>
            <Text style={styles.subtitle}>
              Pick any amount and we'll help you fill it with the food you want —
              no fixed deals, no leftovers.
            </Text>
          </View>

          <TextField
            label="Maximum budget"
            value={value}
            onChangeText={handleChange}
            error={error}
            placeholder="0"
            prefix={CURRENCY_SYMBOL}
            keyboardType="numeric"
            returnKeyType="done"
            onSubmitEditing={handleContinue}
            inputStyle={styles.budgetInput}
          />

          <View style={styles.quickPick}>
            <Text style={styles.quickPickLabel}>Quick pick</Text>
            <ChipGroup
              options={QUICK_AMOUNTS}
              selectedValue={value}
              onSelect={handleChange}
            />
          </View>

          <View style={styles.steps}>
            {[
              { icon: "grid-outline", text: "Browse categories" },
              { icon: "add-circle-outline", text: "Add what you like" },
              { icon: "wallet-outline", text: "Stay inside your budget" },
            ].map((step) => (
              <View key={step.text} style={styles.step}>
                <View style={styles.stepIcon}>
                  <Ionicons name={step.icon} size={16} color={colors.primary} />
                </View>
                <Text style={styles.stepText}>{step.text}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <PrimaryButton
            label="Continue"
            onPress={handleContinue}
            iconName="arrow-forward"
            iconPosition="right"
          />
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    gap: spacing.xl,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    paddingTop: spacing.md,
  },
  greetingGroup: {
    flex: 1,
  },
  greeting: {
    ...typography.subheading,
    color: colors.text,
  },
  greetingSub: {
    ...typography.caption,
    color: colors.textMuted,
  },
  signOutButton: {
    width: 38,
    height: 38,
    borderRadius: radii.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceAlt,
  },
  hero: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  title: {
    ...typography.display,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
  },
  budgetInput: {
    ...typography.title,
    paddingVertical: spacing.md,
  },
  quickPick: {
    gap: spacing.md,
  },
  quickPickLabel: {
    ...typography.captionStrong,
    color: colors.textSecondary,
  },
  steps: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.md,
  },
  step: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  stepIcon: {
    width: 30,
    height: 30,
    borderRadius: radii.pill,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  stepText: {
    ...typography.body,
    color: colors.textSecondary,
    flex: 1,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    backgroundColor: colors.background,
  },
});

export default BudgetScreen;

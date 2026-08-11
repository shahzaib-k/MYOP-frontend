import { useCallback, useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import AuthFormLayout from "./AuthFormLayout";
import TextField from "../../components/common/TextField";
import PrimaryButton from "../../components/common/PrimaryButton";
import ErrorMessage from "../../components/common/ErrorMessage";
import useAuth from "../../hooks/useAuth";
import useForm from "../../hooks/useForm";
import { validateLoginForm } from "../../validations/authValidation";
import ROUTES from "../../navigation/routes";
import { spacing } from "../../constants/theme";

const INITIAL_VALUES = { email: "", password: "" };

/**
 * Sign in. On success AuthContext stores the token and RootNavigator swaps to
 * the ordering flow — this screen never navigates by hand.
 */
const LoginScreen = ({ navigation }) => {
  const { signIn, isSubmitting, error, clearError } = useAuth();
  const { values, errors, setValue, handleSubmit } = useForm(
    INITIAL_VALUES,
    validateLoginForm
  );

  const passwordRef = useRef(null);

  // Don't carry a failed attempt over to the register screen and back.
  useEffect(() => clearError, [clearError]);

  const onSubmit = useCallback(
    () => handleSubmit((formValues) => signIn(formValues)),
    [handleSubmit, signIn]
  );

  return (
    <AuthFormLayout
      title="Welcome back"
      subtitle="Sign in to build your platter and place orders."
      footerText="New here?"
      footerActionLabel="Create an account"
      onFooterAction={() => navigation.navigate(ROUTES.register)}
    >
      {error ? <ErrorMessage message={error} /> : null}

      <TextField
        label="Email"
        value={values.email}
        onChangeText={(text) => setValue("email", text)}
        error={errors.email}
        placeholder="you@example.com"
        iconName="mail-outline"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current?.focus()}
      />

      <TextField
        ref={passwordRef}
        label="Password"
        value={values.password}
        onChangeText={(text) => setValue("password", text)}
        error={errors.password}
        placeholder="Your password"
        iconName="lock-closed-outline"
        secureTextEntry
        autoCapitalize="none"
        returnKeyType="done"
        onSubmitEditing={onSubmit}
      />

      <View style={styles.action}>
        <PrimaryButton
          label="Sign in"
          onPress={onSubmit}
          isLoading={isSubmitting}
        />
      </View>
    </AuthFormLayout>
  );
};

const styles = StyleSheet.create({
  action: {
    marginTop: spacing.sm,
  },
});

export default LoginScreen;

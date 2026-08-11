import { useCallback, useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import AuthFormLayout from "./AuthFormLayout";
import TextField from "../../components/common/TextField";
import PrimaryButton from "../../components/common/PrimaryButton";
import ErrorMessage from "../../components/common/ErrorMessage";
import useAuth from "../../hooks/useAuth";
import useForm from "../../hooks/useForm";
import { validateRegisterForm } from "../../validations/authValidation";
import { MIN_PASSWORD_LENGTH } from "../../constants/config";
import ROUTES from "../../navigation/routes";
import { spacing } from "../../constants/theme";

const INITIAL_VALUES = { name: "", email: "", phone: "", password: "" };

/** Registration always creates a customer account on the backend. */
const RegisterScreen = ({ navigation }) => {
  const { signUp, isSubmitting, error, clearError } = useAuth();
  const { values, errors, setValue, handleSubmit } = useForm(
    INITIAL_VALUES,
    validateRegisterForm
  );

  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const passwordRef = useRef(null);

  useEffect(() => clearError, [clearError]);

  const onSubmit = useCallback(
    () => handleSubmit((formValues) => signUp(formValues)),
    [handleSubmit, signUp]
  );

  return (
    <AuthFormLayout
      title="Create account"
      subtitle="It takes a minute — then you can start building platters."
      footerText="Already have an account?"
      footerActionLabel="Sign in"
      onFooterAction={() => navigation.navigate(ROUTES.login)}
    >
      {error ? <ErrorMessage message={error} /> : null}

      <TextField
        label="Full name"
        value={values.name}
        onChangeText={(text) => setValue("name", text)}
        error={errors.name}
        placeholder="Your name"
        iconName="person-outline"
        autoCapitalize="words"
        returnKeyType="next"
        onSubmitEditing={() => emailRef.current?.focus()}
      />

      <TextField
        ref={emailRef}
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
        onSubmitEditing={() => phoneRef.current?.focus()}
      />

      <TextField
        ref={phoneRef}
        label="Phone (optional)"
        value={values.phone}
        onChangeText={(text) => setValue("phone", text)}
        error={errors.phone}
        placeholder="03xx xxxxxxx"
        iconName="call-outline"
        keyboardType="phone-pad"
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current?.focus()}
      />

      <TextField
        ref={passwordRef}
        label="Password"
        value={values.password}
        onChangeText={(text) => setValue("password", text)}
        error={errors.password}
        placeholder="Choose a password"
        helperText={`At least ${MIN_PASSWORD_LENGTH} characters`}
        iconName="lock-closed-outline"
        secureTextEntry
        autoCapitalize="none"
        returnKeyType="done"
        onSubmitEditing={onSubmit}
      />

      <View style={styles.action}>
        <PrimaryButton
          label="Create account"
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

export default RegisterScreen;

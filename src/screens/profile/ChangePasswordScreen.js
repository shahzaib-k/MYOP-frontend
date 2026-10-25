import { useCallback, useRef } from "react";
import { Alert } from "react-native";
import ProfileFormLayout from "./ProfileFormLayout";
import TextField from "../../components/common/TextField";
import useForm from "../../hooks/useForm";
import useSubmit from "../../hooks/useSubmit";
import { changePassword } from "../../services/authService";
import { validatePasswordForm } from "../../validations/profileValidation";
import { MIN_PASSWORD_LENGTH } from "../../constants/config";

const INITIAL_VALUES = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

/** Change password. The backend verifies the current password server-side. */
const ChangePasswordScreen = ({ navigation }) => {
  const { values, errors, setValue, handleSubmit, reset } = useForm(
    INITIAL_VALUES,
    validatePasswordForm
  );
  const { submit, isSubmitting, error, errorDetails } = useSubmit(changePassword);

  const newPasswordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const goBack = useCallback(() => navigation.goBack(), [navigation]);

  const onSubmit = useCallback(
    () =>
      handleSubmit(async ({ currentPassword, newPassword }) => {
        const result = await submit({ currentPassword, newPassword });

        if (result.success) {
          reset();
          Alert.alert("Password updated", "Use your new password next time you sign in.", [
            { text: "OK", onPress: goBack },
          ]);
        }
      }),
    [handleSubmit, submit, reset, goBack]
  );

  return (
    <ProfileFormLayout
      title="Change password"
      onBack={goBack}
      error={error}
      errorDetails={errorDetails}
      submitLabel="Update password"
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
    >
      <TextField
        label="Current password"
        value={values.currentPassword}
        onChangeText={(text) => setValue("currentPassword", text)}
        error={errors.currentPassword}
        placeholder="Your current password"
        iconName="lock-closed-outline"
        secureTextEntry
        autoCapitalize="none"
        returnKeyType="next"
        onSubmitEditing={() => newPasswordRef.current?.focus()}
      />

      <TextField
        ref={newPasswordRef}
        label="New password"
        value={values.newPassword}
        onChangeText={(text) => setValue("newPassword", text)}
        error={errors.newPassword}
        placeholder="Choose a new password"
        helperText={`At least ${MIN_PASSWORD_LENGTH} characters`}
        iconName="key-outline"
        secureTextEntry
        autoCapitalize="none"
        returnKeyType="next"
        onSubmitEditing={() => confirmPasswordRef.current?.focus()}
      />

      <TextField
        ref={confirmPasswordRef}
        label="Confirm new password"
        value={values.confirmPassword}
        onChangeText={(text) => setValue("confirmPassword", text)}
        error={errors.confirmPassword}
        placeholder="Repeat the new password"
        iconName="key-outline"
        secureTextEntry
        autoCapitalize="none"
        returnKeyType="done"
        onSubmitEditing={onSubmit}
      />
    </ProfileFormLayout>
  );
};

export default ChangePasswordScreen;

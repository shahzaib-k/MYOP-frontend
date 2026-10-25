import { useCallback, useMemo, useRef } from "react";
import { Alert } from "react-native";
import ProfileFormLayout from "./ProfileFormLayout";
import TextField from "../../components/common/TextField";
import useAuth from "../../hooks/useAuth";
import useForm from "../../hooks/useForm";
import useSubmit from "../../hooks/useSubmit";
import { createProfileValidator } from "../../validations/profileValidation";

/**
 * Edit name and phone. Email is the login identity and cannot be changed
 * (the backend only accepts `name` and `phone`), so it is shown read-only.
 */
const EditProfileScreen = ({ navigation }) => {
  const { user, updateProfile } = useAuth();

  const validate = useMemo(
    () => createProfileValidator(user?.phone),
    [user?.phone]
  );

  const initialValues = useMemo(
    () => ({ name: user?.name || "", phone: user?.phone || "" }),
    [user?.name, user?.phone]
  );

  const { values, errors, setValue, handleSubmit } = useForm(
    initialValues,
    validate
  );
  const { submit, isSubmitting, error, errorDetails } = useSubmit(updateProfile);

  const phoneRef = useRef(null);

  const goBack = useCallback(() => navigation.goBack(), [navigation]);

  const onSubmit = useCallback(
    () =>
      handleSubmit(async (formValues) => {
        // Send only what changed; the backend rejects empty fields.
        const updates = {};
        const name = formValues.name.trim();
        const phone = formValues.phone.trim();

        if (name !== (user?.name || "")) {
          updates.name = name;
        }

        if (phone !== "" && phone !== (user?.phone || "")) {
          updates.phone = phone;
        }

        if (Object.keys(updates).length === 0) {
          goBack();
          return;
        }

        const result = await submit(updates);

        if (result.success) {
          Alert.alert("Profile updated", "Your changes have been saved.", [
            { text: "OK", onPress: goBack },
          ]);
        }
      }),
    [handleSubmit, submit, user, goBack]
  );

  return (
    <ProfileFormLayout
      title="Edit profile"
      onBack={goBack}
      error={error}
      errorDetails={errorDetails}
      submitLabel="Save changes"
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
    >
      <TextField
        label="Full name"
        value={values.name}
        onChangeText={(text) => setValue("name", text)}
        error={errors.name}
        placeholder="Your name"
        iconName="person-outline"
        autoCapitalize="words"
        returnKeyType="next"
        onSubmitEditing={() => phoneRef.current?.focus()}
      />

      <TextField
        label="Email"
        value={user?.email || ""}
        iconName="mail-outline"
        editable={false}
        helperText="Your email is your login and can't be changed."
      />

      <TextField
        ref={phoneRef}
        label="Phone"
        value={values.phone}
        onChangeText={(text) => setValue("phone", text)}
        error={errors.phone}
        placeholder="03xx xxxxxxx"
        iconName="call-outline"
        keyboardType="phone-pad"
        returnKeyType="done"
        onSubmitEditing={onSubmit}
      />
    </ProfileFormLayout>
  );
};

export default EditProfileScreen;

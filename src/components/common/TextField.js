import { forwardRef, memo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radii, spacing, typography } from "../../constants/theme";

/**
 * Labelled text input with focus and error states, an optional leading icon,
 * a prefix (for currency) and a built-in show/hide toggle for passwords.
 *
 * Forwards its ref so forms can move focus to the next field on submit.
 */
const TextField = forwardRef(
  (
    {
      label,
      value,
      onChangeText,
      error,
      placeholder,
      iconName,
      prefix,
      secureTextEntry = false,
      helperText,
      containerStyle,
      inputStyle,
      ...inputProps
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isSecureVisible, setIsSecureVisible] = useState(false);

    const hasError = Boolean(error);
    const isPassword = secureTextEntry;

    return (
      <View style={[styles.container, containerStyle]}>
        {label ? <Text style={styles.label}>{label}</Text> : null}

        <View
          style={[
            styles.inputWrapper,
            isFocused && styles.inputWrapperFocused,
            hasError && styles.inputWrapperError,
          ]}
        >
          {iconName ? (
            <Ionicons
              name={iconName}
              size={18}
              color={hasError ? colors.danger : colors.textMuted}
            />
          ) : null}

          {prefix ? <Text style={styles.prefix}>{prefix}</Text> : null}

          <TextInput
            ref={ref}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={colors.textMuted}
            secureTextEntry={isPassword && !isSecureVisible}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={[styles.input, inputStyle]}
            accessibilityLabel={label}
            {...inputProps}
          />

          {isPassword ? (
            <Pressable
              onPress={() => setIsSecureVisible((visible) => !visible)}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={
                isSecureVisible ? "Hide password" : "Show password"
              }
            >
              <Ionicons
                name={isSecureVisible ? "eye-off-outline" : "eye-outline"}
                size={18}
                color={colors.textMuted}
              />
            </Pressable>
          ) : null}
        </View>

        {hasError ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : helperText ? (
          <Text style={styles.helperText}>{helperText}</Text>
        ) : null}
      </View>
    );
  }
);

TextField.displayName = "TextField";

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  label: {
    ...typography.captionStrong,
    color: colors.textSecondary,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    minHeight: 52,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
  },
  inputWrapperFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  inputWrapperError: {
    borderColor: colors.danger,
    backgroundColor: colors.dangerSoft,
  },
  prefix: {
    ...typography.bodyStrong,
    color: colors.textSecondary,
  },
  input: {
    ...typography.body,
    flex: 1,
    color: colors.text,
    paddingVertical: spacing.md,
  },
  errorText: {
    ...typography.caption,
    color: colors.danger,
  },
  helperText: {
    ...typography.caption,
    color: colors.textMuted,
  },
});

export default memo(TextField);

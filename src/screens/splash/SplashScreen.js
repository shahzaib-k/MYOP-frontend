import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radii, shadows, spacing, typography } from "../../constants/theme";

/**
 * Branded launch screen. Rendered by RootNavigator (not as a stack route)
 * while the persisted session and budget are read back from storage, so there
 * is no flash of the wrong screen on cold start.
 */
const SplashScreen = () => {
  const fade = useRef(new Animated.Value(0)).current;
  const lift = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 450,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(lift, {
        toValue: 0,
        duration: 450,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fade, lift]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          { opacity: fade, transform: [{ translateY: lift }] },
        ]}
      >
        <View style={styles.logo}>
          <Ionicons name="restaurant" size={44} color={colors.textInverse} />
        </View>

        <Text style={styles.name}>Make Your Own Platter</Text>
        <Text style={styles.tagline}>Build a meal that fits your budget</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    padding: spacing.xxl,
  },
  content: {
    alignItems: "center",
    gap: spacing.md,
  },
  logo: {
    width: 96,
    height: 96,
    borderRadius: radii.xxl,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
    ...shadows.medium,
  },
  name: {
    ...typography.title,
    color: colors.text,
    textAlign: "center",
  },
  tagline: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: "center",
  },
});

export default SplashScreen;

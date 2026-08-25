import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radii, shadows, spacing, typography } from "../../constants/theme";

const DOT_COUNT = 3;

/** One dot of the loading indicator, pulsing on a delay from its neighbours. */
const LoadingDot = ({ delay }) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 450,
          delay,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 450,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();

    return () => loop.stop();
  }, [opacity, delay]);

  return <Animated.View style={[styles.dot, { opacity }]} />;
};

/**
 * Branded launch screen. Rendered by RootNavigator (not as a stack route)
 * while the persisted session and budget are read back from storage, so there
 * is no flash of the wrong screen on cold start.
 */
const SplashScreen = () => {
  const fade = useRef(new Animated.Value(0)).current;
  const lift = useRef(new Animated.Value(16)).current;
  const ringScale = useRef(new Animated.Value(0.85)).current;

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
      Animated.timing(ringScale, {
        toValue: 1,
        duration: 650,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fade, lift, ringScale]);

  return (
    <View style={styles.container}>
      {/* Decorative backdrop rings — purely cosmetic, echoes the primary brand colour. */}
      <View style={styles.backdrop} pointerEvents="none">
        <View style={[styles.ring, styles.ringOuter]} />
        <View style={[styles.ring, styles.ringInner]} />
      </View>

      <Animated.View
        style={[
          styles.content,
          { opacity: fade, transform: [{ translateY: lift }] },
        ]}
      >
        <Animated.View style={[styles.logo, { transform: [{ scale: ringScale }] }]}>
          <Ionicons name="restaurant" size={44} color={colors.textInverse} />
        </Animated.View>

        <Text style={styles.name}>Make Your Own Platter</Text>
        <Text style={styles.tagline}>Build a meal that fits your budget</Text>

        <View style={styles.dots}>
          {Array.from({ length: DOT_COUNT }).map((_, index) => (
            <LoadingDot key={index} delay={index * 150} />
          ))}
        </View>
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
    overflow: "hidden",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    position: "absolute",
    borderRadius: radii.pill,
    backgroundColor: colors.primarySoft,
  },
  ringOuter: {
    width: 420,
    height: 420,
    opacity: 0.5,
  },
  ringInner: {
    width: 280,
    height: 280,
    opacity: 0.7,
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
  dots: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
  },
});

export default SplashScreen;

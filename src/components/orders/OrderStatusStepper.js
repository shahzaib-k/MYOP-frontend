import { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radii, spacing, typography } from "../../constants/theme";

const CIRCLE_SIZE = 34;

const STEPS = [
  { key: "pending", label: "Placed", iconName: "receipt-outline" },
  { key: "preparing", label: "Preparing", iconName: "flame-outline" },
  { key: "completed", label: "Ready", iconName: "checkmark-done-outline" },
];

/**
 * At-a-glance order progress. Cancelled is not a point on this line — it's a
 * dead end from either pending or preparing, so it gets its own banner
 * instead of forcing a fourth step into a "pending → preparing → completed"
 * timeline that no longer applies.
 */
const OrderStatusStepper = ({ status }) => {
  const currentIndex = Math.max(
    STEPS.findIndex((step) => step.key === status),
    0
  );
  const [trackWidth, setTrackWidth] = useState(0);
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: currentIndex,
      duration: 500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [currentIndex, progress]);

  if (status === "cancelled") {
    return (
      <View style={styles.cancelledBanner}>
        <Ionicons name="close-circle" size={18} color={colors.danger} />
        <Text style={styles.cancelledText}>This order was cancelled</Text>
      </View>
    );
  }

  const fillableWidth = Math.max(trackWidth - CIRCLE_SIZE, 0);
  const segmentWidth = fillableWidth / (STEPS.length - 1);

  const animatedWidth = progress.interpolate({
    inputRange: STEPS.map((_, index) => index),
    outputRange: STEPS.map((_, index) => index * segmentWidth),
  });

  return (
    <View style={styles.container}>
      <View
        style={styles.trackRow}
        onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}
      >
        <View
          style={[styles.trackBase, { left: CIRCLE_SIZE / 2, right: CIRCLE_SIZE / 2 }]}
        />

        {trackWidth > 0 ? (
          <Animated.View
            style={[styles.trackFill, { left: CIRCLE_SIZE / 2, width: animatedWidth }]}
          />
        ) : null}

        {STEPS.map((step, index) => {
          const isDone = index <= currentIndex;

          return (
            <View key={step.key} style={[styles.circle, isDone && styles.circleDone]}>
              <Ionicons
                name={step.iconName}
                size={16}
                color={isDone ? colors.textInverse : colors.textMuted}
              />
            </View>
          );
        })}
      </View>

      <View style={styles.labelsRow}>
        {STEPS.map((step, index) => (
          <Text
            key={step.key}
            style={[styles.stepLabel, index <= currentIndex && styles.stepLabelDone]}
            numberOfLines={1}
          >
            {step.label}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  trackRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: CIRCLE_SIZE,
  },
  trackBase: {
    position: "absolute",
    height: 3,
    borderRadius: radii.pill,
    backgroundColor: colors.border,
    top: CIRCLE_SIZE / 2 - 1.5,
  },
  trackFill: {
    position: "absolute",
    height: 3,
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
    top: CIRCLE_SIZE / 2 - 1.5,
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: radii.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceSunken,
    borderWidth: 2,
    borderColor: colors.surfaceAlt,
    zIndex: 1,
  },
  circleDone: {
    backgroundColor: colors.primary,
    borderColor: colors.surfaceAlt,
  },
  labelsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  stepLabel: {
    ...typography.caption,
    color: colors.textMuted,
    width: CIRCLE_SIZE + 24,
    textAlign: "center",
  },
  stepLabelDone: {
    ...typography.captionStrong,
    color: colors.text,
  },
  cancelledBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.dangerSoft,
    padding: spacing.md,
    borderRadius: radii.lg,
  },
  cancelledText: {
    ...typography.bodyStrong,
    color: colors.danger,
  },
});

export default OrderStatusStepper;

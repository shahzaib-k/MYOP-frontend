import { useCallback, useEffect, useRef } from "react";
import { Animated, Easing, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ScreenContainer from "../../components/common/ScreenContainer";
import PrimaryButton from "../../components/common/PrimaryButton";
import Badge from "../../components/common/Badge";
import usePlatter from "../../hooks/usePlatter";
import { formatCurrency } from "../../utils/currency";
import ROUTES from "../../navigation/routes";
import { colors, radii, shadows, spacing, typography } from "../../constants/theme";

/**
 * Step 5: confirmation. The order object comes straight from the API response,
 * so the order number and totals shown here are the server's, not ours.
 */
const OrderSuccessScreen = ({ navigation, route }) => {
  const { order, message } = route.params || {};
  const { resetPlatter } = usePlatter();

  const scale = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 5,
      tension: 80,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  /**
   * Rebuilds the stack as Budget → Categories rather than just navigating, so
   * the placed order is gone from history and Categories still has somewhere
   * to go back to.
   */
  const handleBackToHome = useCallback(() => {
    navigation.reset({
      index: 1,
      routes: [{ name: ROUTES.budget }, { name: ROUTES.categories }],
    });
  }, [navigation]);

  /** A new platter means a fresh budget too, so send the user back to step 1. */
  const handleNewPlatter = useCallback(() => {
    resetPlatter();
    navigation.reset({ index: 0, routes: [{ name: ROUTES.budget }] });
  }, [resetPlatter, navigation]);

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.iconCircle, { transform: [{ scale }] }]}>
          <Ionicons name="checkmark" size={48} color={colors.textInverse} />
        </Animated.View>

        <Text style={styles.title}>Order placed successfully</Text>
        <Text style={styles.subtitle}>
          {message || "Thank you! Your platter is on its way to the kitchen."}
        </Text>

        {order ? (
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <Text style={styles.cardLabel}>Order number</Text>
              <Text style={styles.orderId} numberOfLines={1}>
                {order.orderId}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.cardRow}>
              <Text style={styles.cardLabel}>Items</Text>
              <Text style={styles.cardValue}>{order.items?.length || 0}</Text>
            </View>

            <View style={styles.cardRow}>
              <Text style={styles.cardLabel}>Total paid</Text>
              <Text style={styles.cardValue}>
                {formatCurrency(order.totalPrice)}
              </Text>
            </View>

            {order.budget ? (
              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>Saved from budget</Text>
                <Text style={[styles.cardValue, styles.savedValue]}>
                  {formatCurrency(order.remainingBudget)}
                </Text>
              </View>
            ) : null}

            <View style={styles.statusRow}>
              <Badge
                label={order.status || "pending"}
                tone="warning"
                iconName="time-outline"
              />
            </View>
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.actions}>
        <PrimaryButton
          label="Create new platter"
          onPress={handleNewPlatter}
          iconName="add-circle-outline"
        />
        <PrimaryButton
          label="Back to home"
          onPress={handleBackToHome}
          variant="outline"
          size="medium"
        />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxxl,
    gap: spacing.md,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: radii.pill,
    backgroundColor: colors.success,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
    ...shadows.medium,
  },
  title: {
    ...typography.title,
    color: colors.text,
    textAlign: "center",
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: "center",
    maxWidth: 320,
  },
  card: {
    alignSelf: "stretch",
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.xl,
    padding: spacing.lg,
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  cardLabel: {
    ...typography.body,
    color: colors.textSecondary,
    flex: 1,
  },
  cardValue: {
    ...typography.bodyStrong,
    color: colors.text,
  },
  savedValue: {
    color: colors.success,
  },
  orderId: {
    ...typography.captionStrong,
    color: colors.text,
    flexShrink: 1,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.borderStrong,
  },
  statusRow: {
    alignItems: "flex-start",
  },
  actions: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
    gap: spacing.md,
  },
});

export default OrderSuccessScreen;

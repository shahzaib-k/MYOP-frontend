import { memo, useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Badge from "../common/Badge";
import { formatCurrency } from "../../utils/currency";
import { getStatusMeta, isActiveOrder } from "../../constants/orderStatus";
import { colors, radii, shadows, spacing, typography } from "../../constants/theme";

const ACCENT_BY_TONE = {
  neutral: colors.textMuted,
  success: colors.success,
  warning: colors.warning,
  danger: colors.danger,
  info: colors.info,
};

const formatDate = (isoString) => {
  const date = new Date(isoString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
};

const summarizeItems = (items = []) => {
  if (items.length === 0) {
    return "";
  }

  const names = items.map((item) => item.name);

  if (names.length <= 2) {
    return names.join(", ");
  }

  return `${names.slice(0, 2).join(", ")} +${names.length - 2} more`;
};

/** Small "this order is live" indicator — pulses for pending/preparing orders. */
const PulsingDot = ({ color }) => {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.7, duration: 700, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    );

    loop.start();

    return () => loop.stop();
  }, [scale]);

  return (
    <Animated.View style={[styles.pulsingDot, { backgroundColor: color, transform: [{ scale }] }]} />
  );
};

/** One row in the order history list. Tapping opens OrderDetailScreen. */
const OrderCard = ({ order, onPress, onReorder }) => {
  const status = getStatusMeta(order.status);
  const accentColor = ACCENT_BY_TONE[status.tone] || colors.textMuted;
  const itemCount = order.items?.length || 0;

  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (value) =>
    Animated.spring(scale, { toValue: value, useNativeDriver: true, speed: 40, bounciness: 6 }).start();

  return (
    <Animated.View style={[styles.wrapper, { transform: [{ scale }] }]}>
      <Pressable
        onPress={() => onPress(order)}
        onPressIn={() => animateTo(0.97)}
        onPressOut={() => animateTo(1)}
        style={styles.card}
        accessibilityRole="button"
      >
        <View style={[styles.accentBar, { backgroundColor: accentColor }]} />

        <View style={styles.content}>
          <View style={styles.row}>
            <Text style={styles.orderId} numberOfLines={1}>
              Order #{order.orderId?.slice(-6).toUpperCase()}
            </Text>

            <View style={styles.statusGroup}>
              {isActiveOrder(order.status) ? <PulsingDot color={accentColor} /> : null}
              <Badge label={status.label} tone={status.tone} iconName={status.iconName} />
            </View>
          </View>

          <Text style={styles.date}>{formatDate(order.createdAt)}</Text>

          {itemCount > 0 ? (
            <Text style={styles.itemSummary} numberOfLines={1}>
              {summarizeItems(order.items)}
            </Text>
          ) : null}

          <View style={styles.footer}>
            <View style={styles.itemCountGroup}>
              <Ionicons name="fast-food-outline" size={14} color={colors.textMuted} />
              <Text style={styles.itemCount}>
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </Text>
            </View>

            {onReorder ? (
              <Pressable
                onPress={() => onReorder(order)}
                hitSlop={6}
                accessibilityRole="button"
                accessibilityLabel="Reorder this order"
                style={({ pressed }) => [
                  styles.reorderButton,
                  pressed && styles.reorderButtonPressed,
                ]}
              >
                <Ionicons name="repeat-outline" size={14} color={colors.primaryDark} />
                <Text style={styles.reorderLabel}>Reorder</Text>
              </Pressable>
            ) : null}

            <View style={styles.totalGroup}>
              <Text style={styles.total}>{formatCurrency(order.totalPrice)}</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.md,
  },
  card: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    overflow: "hidden",
    ...shadows.soft,
  },
  accentBar: {
    width: 5,
  },
  content: {
    flex: 1,
    padding: spacing.md,
    gap: spacing.xxs,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  orderId: {
    ...typography.subheading,
    color: colors.text,
    flex: 1,
  },
  statusGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  pulsingDot: {
    width: 7,
    height: 7,
    borderRadius: radii.pill,
  },
  date: {
    ...typography.caption,
    color: colors.textMuted,
  },
  itemSummary: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.xs,
  },
  itemCountGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xxs,
  },
  itemCount: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  reorderButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xxs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
    backgroundColor: colors.primarySoft,
  },
  reorderButtonPressed: {
    backgroundColor: colors.primarySoftPressed,
  },
  reorderLabel: {
    ...typography.captionStrong,
    color: colors.primaryDark,
  },
  totalGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xxs,
  },
  total: {
    ...typography.bodyStrong,
    color: colors.primaryDark,
  },
});

export default memo(OrderCard);

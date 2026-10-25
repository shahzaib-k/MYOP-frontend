import { useCallback, useEffect, useRef } from "react";
import { Alert, Animated, ScrollView, StyleSheet, Text, View } from "react-native";
import ScreenContainer from "../../components/common/ScreenContainer";
import AppHeader from "../../components/common/AppHeader";
import Badge from "../../components/common/Badge";
import PrimaryButton from "../../components/common/PrimaryButton";
import ErrorMessage from "../../components/common/ErrorMessage";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import OrderItemRow from "../../components/orders/OrderItemRow";
import OrderStatusStepper from "../../components/orders/OrderStatusStepper";
import useFetch from "../../hooks/useFetch";
import useSubmit from "../../hooks/useSubmit";
import useReorder from "../../hooks/useReorder";
import { cancelOrder, fetchOrderById } from "../../services/orderService";
import { formatCurrency } from "../../utils/currency";
import { canCancelOrder, getStatusMeta } from "../../constants/orderStatus";
import { colors, radii, spacing, typography } from "../../constants/theme";

const formatDateTime = (isoString) => {
  const date = new Date(isoString);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
};

/**
 * Full detail for one order. Reached two ways:
 *  - from OrdersScreen, with the full `order` object already in params (GET
 *    /api/orders already returns every item, so no extra fetch is needed);
 *  - from a tapped push notification, with only an `orderId` — this fetches
 *    it via GET /api/orders/:id instead.
 */
const OrderDetailScreen = ({ navigation, route }) => {
  const { order: initialOrder, orderId } = route.params || {};

  const request = useCallback(
    () => (orderId ? fetchOrderById(orderId) : Promise.resolve(initialOrder)),
    [orderId, initialOrder]
  );

  const {
    data: order,
    isLoading,
    error: loadError,
    setData: setOrder,
  } = useFetch(request, { immediate: !initialOrder, initialData: initialOrder || null });

  const submitCancel = useCallback(() => cancelOrder(order.orderId), [order]);
  const { submit, isSubmitting, error, reset } = useSubmit(submitCancel);
  const { reorder, isReordering } = useReorder(navigation);

  const handleReorder = useCallback(() => reorder(order), [reorder, order]);

  const fade = useRef(new Animated.Value(0)).current;
  const lift = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    if (!order) {
      return;
    }

    fade.setValue(0);
    lift.setValue(12);

    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.timing(lift, { toValue: 0, duration: 350, useNativeDriver: true }),
    ]).start();
  }, [order?.orderId, fade, lift]);

  const handleCancel = useCallback(() => {
    Alert.alert(
      "Cancel this order?",
      "This can't be undone — the kitchen will be notified immediately.",
      [
        { text: "Keep order", style: "cancel" },
        {
          text: "Cancel order",
          style: "destructive",
          onPress: async () => {
            const { success, data } = await submit();

            if (success && data) {
              setOrder(data);
            }
          },
        },
      ]
    );
  }, [submit, setOrder]);

  if (isLoading) {
    return (
      <ScreenContainer>
        <AppHeader title="Order" onBack={() => navigation.goBack()} />
        <LoadingSpinner label="Loading order…" />
      </ScreenContainer>
    );
  }

  if (loadError || !order) {
    return (
      <ScreenContainer>
        <AppHeader title="Order" onBack={() => navigation.goBack()} />
        <ErrorMessage
          message={loadError || "This order couldn't be found."}
          variant="block"
        />
      </ScreenContainer>
    );
  }

  const status = getStatusMeta(order.status);

  return (
    <ScreenContainer>
      <AppHeader
        title={`Order #${order.orderId?.slice(-6).toUpperCase()}`}
        subtitle={formatDateTime(order.createdAt)}
        onBack={() => navigation.goBack()}
        rightSlot={
          <Badge label={status.label} tone={status.tone} iconName={status.iconName} />
        }
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={[styles.animatedContent, { opacity: fade, transform: [{ translateY: lift }] }]}
        >
        <View style={styles.card}>
          <OrderStatusStepper status={order.status} />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Items</Text>

          {order.items?.map((item) => (
            <OrderItemRow key={item.foodId} item={item} />
          ))}
        </View>

        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatCurrency(order.totalPrice)}</Text>
          </View>

          {order.budget ? (
            <>
              <View style={styles.row}>
                <Text style={styles.label}>Budget</Text>
                <Text style={styles.value}>{formatCurrency(order.budget)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Remaining from budget</Text>
                <Text style={[styles.value, styles.successValue]}>
                  {formatCurrency(order.remainingBudget)}
                </Text>
              </View>
            </>
          ) : null}
        </View>

        {order.statusHistory?.length ? (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Status history</Text>

            {order.statusHistory.map((entry) => (
              <View key={`${entry.status}-${entry.changedAt}`} style={styles.historyRow}>
                <View style={styles.historyDot} />
                <View style={styles.historyDetails}>
                  <Text style={styles.historyStatus}>
                    {getStatusMeta(entry.status).label}
                  </Text>
                  <Text style={styles.historyDate}>{formatDateTime(entry.changedAt)}</Text>
                </View>
              </View>
            ))}
          </View>
        ) : null}

        {error ? <ErrorMessage message={error} onRetry={reset} /> : null}
        </Animated.View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          label="Reorder"
          onPress={handleReorder}
          size="medium"
          isLoading={isReordering}
          iconName="repeat-outline"
        />

        {canCancelOrder(order.status) ? (
          <PrimaryButton
            label="Cancel order"
            onPress={handleCancel}
            variant="danger"
            size="medium"
            isLoading={isSubmitting}
            iconName="close-circle-outline"
          />
        ) : null}
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  animatedContent: {
    gap: spacing.lg,
  },
  card: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  sectionTitle: {
    ...typography.subheading,
    color: colors.text,
    marginBottom: spacing.xxs,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    paddingVertical: spacing.xxs,
  },
  label: {
    ...typography.body,
    color: colors.textSecondary,
  },
  value: {
    ...typography.bodyStrong,
    color: colors.text,
  },
  successValue: {
    color: colors.success,
  },
  totalLabel: {
    ...typography.heading,
    color: colors.text,
  },
  totalValue: {
    ...typography.heading,
    color: colors.primaryDark,
  },
  historyRow: {
    flexDirection: "row",
    gap: spacing.md,
    paddingVertical: spacing.xs,
  },
  historyDot: {
    width: 8,
    height: 8,
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
    marginTop: 6,
  },
  historyDetails: {
    flex: 1,
  },
  historyStatus: {
    ...typography.bodyStrong,
    color: colors.text,
  },
  historyDate: {
    ...typography.caption,
    color: colors.textMuted,
  },
  footer: {
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
});

export default OrderDetailScreen;

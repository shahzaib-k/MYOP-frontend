import { useCallback } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import ScreenContainer from "../../components/common/ScreenContainer";
import AppHeader from "../../components/common/AppHeader";
import EmptyState from "../../components/common/EmptyState";
import ErrorMessage from "../../components/common/ErrorMessage";
import Badge from "../../components/common/Badge";
import PlatterItemRow from "../../components/platter/PlatterItemRow";
import OrderTotals from "../../components/platter/OrderTotals";
import AlternativesSection from "../../components/platter/AlternativesSection";
import OrderSummaryFooter from "./OrderSummaryFooter";
import usePlatter from "../../hooks/usePlatter";
import useSubmit from "../../hooks/useSubmit";
import useSuggestions from "../../hooks/useSuggestions";
import { placeOrder } from "../../services/orderService";
import MESSAGES from "../../constants/messages";
import ROUTES from "../../navigation/routes";
import { spacing } from "../../constants/theme";

/**
 * Step 4: review the platter, adjust it and place the order.
 *
 * The order is sent as { items, totalPrice, budget } — POST /api/orders
 * rejects any other field and derives userId and status itself.
 */
const OrderSummaryScreen = ({ navigation }) => {
  const {
    items,
    summary,
    incrementItem,
    decrementItem,
    removeFromPlatter,
    addItem,
    clearPlatter,
  } = usePlatter();

  const { alternatives } = useSuggestions();

  const submitOrder = useCallback(async () => {
    const { data: order, message } = await placeOrder({
      items,
      totalPrice: summary.total,
      budget: summary.budget,
    });

    return { order, message };
  }, [items, summary.total, summary.budget]);

  const { submit, isSubmitting, error, errorDetails, reset } =
    useSubmit(submitOrder);

  const handlePlaceOrder = useCallback(async () => {
    const { success, data } = await submit();

    if (!success) {
      return;
    }

    clearPlatter();

    // Success replaces the summary in the stack so back never returns to an
    // order that has already been placed.
    navigation.reset({
      index: 2,
      routes: [
        { name: ROUTES.budget },
        { name: ROUTES.categories },
        {
          name: ROUTES.orderSuccess,
          params: { order: data.order, message: data.message },
        },
      ],
    });
  }, [submit, clearPlatter, navigation]);

  /** Swap an over-budget item for a cheaper one, keeping the same quantity. */
  const handleSwap = useCallback(
    (replaceFoodId, option) => {
      const existing = items.find((item) => item.foodId === replaceFoodId);
      const quantity = existing?.quantity || 1;

      removeFromPlatter(replaceFoodId);
      addItem(
        {
          id: option.foodId,
          name: option.name,
          price: option.price,
          category: option.category,
          image: option.image,
          description: "",
        },
        quantity
      );
    },
    [items, removeFromPlatter, addItem]
  );

  const renderItem = useCallback(
    ({ item }) => (
      <PlatterItemRow
        item={item}
        onIncrement={incrementItem}
        onDecrement={decrementItem}
        onRemove={removeFromPlatter}
      />
    ),
    [incrementItem, decrementItem, removeFromPlatter]
  );

  const listFooter = (
    <View style={styles.footerContent}>
      {summary.isOverBudget ? (
        <AlternativesSection alternatives={alternatives} onSwap={handleSwap} />
      ) : null}

      <OrderTotals summary={summary} />

      {error ? (
        <ErrorMessage
          message={error}
          details={errorDetails}
          onRetry={reset}
          retryLabel="Dismiss"
        />
      ) : null}
    </View>
  );

  const isEmpty = items.length === 0;

  return (
    <ScreenContainer>
      <AppHeader
        title="Your platter"
        subtitle={`${summary.itemCount} ${summary.itemCount === 1 ? "item" : "items"}`}
        onBack={() => navigation.goBack()}
        rightSlot={
          summary.isOverBudget ? (
            <Badge label="Over budget" tone="danger" iconName="warning" />
          ) : null
        }
      />

      {isEmpty ? (
        <EmptyState
          iconName="basket-outline"
          title={MESSAGES.emptyCart.title}
          description={MESSAGES.emptyCart.description}
          actionLabel="Browse categories"
          onAction={() => navigation.navigate(ROUTES.categories)}
        />
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.foodId}
            renderItem={renderItem}
            ListFooterComponent={listFooter}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />

          <OrderSummaryFooter
            isOverBudget={summary.isOverBudget}
            isEmpty={isEmpty}
            isSubmitting={isSubmitting}
            onPlaceOrder={handlePlaceOrder}
            onAddMore={() => navigation.goBack()}
          />
        </>
      )}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  footerContent: {
    gap: spacing.lg,
    marginTop: spacing.sm,
  },
});

export default OrderSummaryScreen;

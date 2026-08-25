import { useCallback } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import ScreenContainer from "../common/ScreenContainer";
import AppHeader from "../common/AppHeader";
import EmptyState from "../common/EmptyState";
import ErrorMessage from "../common/ErrorMessage";
import Badge from "../common/Badge";
import PlatterItemRow from "./PlatterItemRow";
import OrderTotals from "./OrderTotals";
import AlternativesSection from "./AlternativesSection";
import OrderSummaryFooter from "./OrderSummaryFooter";
import usePlatter from "../../hooks/usePlatter";
import useSubmit from "../../hooks/useSubmit";
import useSuggestions from "../../hooks/useSuggestions";
import { placeOrder } from "../../services/orderService";
import MESSAGES from "../../constants/messages";
import { spacing } from "../../constants/theme";

/**
 * The platter review UI, shared by two screens:
 *  - OrderSummaryScreen, reached from "View platter" while browsing (part of
 *    the Order tab's own stack — back/empty-state/success stay inside it).
 *  - PlatterScreen, the standalone "Platter" tab, always reachable even with
 *    nothing selected yet — cross-tab navigation, so its callbacks jump into
 *    the Order tab instead.
 *
 * Navigation is fully delegated via props so this component has no opinion on
 * which stack or tab it's rendered inside.
 */
const PlatterView = ({ onBack, onBrowseCategories, onAddMore, onOrderPlaced }) => {
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

  const { submit, isSubmitting, error, errorDetails, reset } = useSubmit(submitOrder);

  const handlePlaceOrder = useCallback(async () => {
    const { success, data } = await submit();

    if (!success) {
      return;
    }

    clearPlatter();
    onOrderPlaced(data.order, data.message);
  }, [submit, clearPlatter, onOrderPlaced]);

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
        onBack={onBack}
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
          onAction={onBrowseCategories}
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
            onAddMore={onAddMore}
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

export default PlatterView;

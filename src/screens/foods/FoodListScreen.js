import { useCallback } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import ScreenContainer from "../../components/common/ScreenContainer";
import AppHeader from "../../components/common/AppHeader";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";
import Badge from "../../components/common/Badge";
import FoodCard from "../../components/food/FoodCard";
import SuggestionsSection from "../../components/food/SuggestionsSection";
import BudgetSummary from "../../components/platter/BudgetSummary";
import CartButton from "../../components/platter/CartButton";
import useFoods from "../../hooks/useFoods";
import useFavourites from "../../hooks/useFavourites";
import usePlatter from "../../hooks/usePlatter";
import useSuggestions from "../../hooks/useSuggestions";
import { formatCurrency } from "../../utils/currency";
import MESSAGES from "../../constants/messages";
import ROUTES from "../../navigation/routes";
import { colors, spacing } from "../../constants/theme";

/**
 * Step 3: browse a category and build the platter.
 *
 * Every quantity change flows through PlatterContext, so the budget summary,
 * the suggestions strip and the floating cart all update from one source.
 */
const FoodListScreen = ({ navigation, route }) => {
  const { categoryName } = route.params;

  const { foods, isLoading, isRefreshing, error, refetch, refresh } =
    useFoods(categoryName);

  const {
    summary,
    quantityByFoodId,
    addItem,
    incrementItem,
    decrementItem,
    removeFromPlatter,
  } = usePlatter();

  const { favouriteSet, toggleFavourite } = useFavourites();

  const { suggestions, isLoading: isLoadingSuggestions, usedFallback } =
    useSuggestions(foods);

  // The list itself is full-bleed so the suggestions strip can scroll edge to
  // edge; rows get their horizontal padding here instead.
  const renderItem = useCallback(
    ({ item }) => (
      <View style={styles.row}>
        <FoodCard
          food={item}
          quantity={quantityByFoodId[item.id] || 0}
          remainingBudget={summary.remaining}
          isFavourite={favouriteSet.has(item.id)}
          onAdd={addItem}
          onIncrement={incrementItem}
          onDecrement={decrementItem}
          onRemove={removeFromPlatter}
          onToggleFavourite={toggleFavourite}
        />
      </View>
    ),
    [
      quantityByFoodId,
      summary.remaining,
      favouriteSet,
      addItem,
      incrementItem,
      decrementItem,
      removeFromPlatter,
      toggleFavourite,
    ]
  );

  const listHeader = (
    <View style={styles.header}>
      <BudgetSummary summary={summary} style={styles.budget} />

      <SuggestionsSection
        suggestions={suggestions}
        remainingBudget={summary.remaining}
        isLoading={isLoadingSuggestions}
        usedFallback={usedFallback}
        onAdd={addItem}
      />
    </View>
  );

  const renderBody = () => {
    if (isLoading) {
      return <LoadingSpinner label={`Loading ${categoryName}…`} />;
    }

    if (error && foods.length === 0) {
      return <ErrorMessage message={error} variant="block" onRetry={refetch} />;
    }

    return (
      <FlatList
        data={foods}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={
          <EmptyState
            iconName="fast-food-outline"
            title={MESSAGES.emptyFoods.title}
            description={MESSAGES.emptyFoods.description}
            actionLabel="Back to categories"
            onAction={() => navigation.goBack()}
          />
        }
        contentContainerStyle={[
          styles.list,
          foods.length === 0 && styles.listEmpty,
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        removeClippedSubviews
        initialNumToRender={8}
        windowSize={10}
      />
    );
  };

  return (
    <ScreenContainer>
      <AppHeader
        title={categoryName}
        subtitle={`${formatCurrency(summary.remaining)} left`}
        onBack={() => navigation.goBack()}
        rightSlot={
          summary.isOverBudget ? (
            <Badge label="Over budget" tone="danger" iconName="warning" />
          ) : (
            <Badge
              label={formatCurrency(summary.total)}
              tone="primary"
              iconName="pricetag-outline"
            />
          )
        }
      />

      <View style={styles.body}>{renderBody()}</View>

      <CartButton
        itemCount={summary.itemCount}
        total={summary.total}
        isOverBudget={summary.isOverBudget}
        onPress={() => navigation.navigate(ROUTES.orderSummary)}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  header: {
    marginBottom: spacing.xs,
  },
  budget: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  row: {
    paddingHorizontal: spacing.xl,
  },
  list: {
    paddingBottom: 120,
  },
  listEmpty: {
    flexGrow: 1,
  },
});

export default FoodListScreen;

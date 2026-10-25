import { useCallback } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import ScreenContainer from "../../components/common/ScreenContainer";
import AppHeader from "../../components/common/AppHeader";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";
import FoodCard from "../../components/food/FoodCard";
import CartButton from "../../components/platter/CartButton";
import useFavouriteFoods from "../../hooks/useFavouriteFoods";
import useFavourites from "../../hooks/useFavourites";
import usePlatter from "../../hooks/usePlatter";
import ROUTES from "../../navigation/routes";
import { colors, spacing } from "../../constants/theme";

/**
 * Every food the customer has hearted, across all categories, with the same
 * add-to-platter controls as the category lists.
 */
const FavouritesScreen = ({ navigation }) => {
  const { foods, isLoading, isRefreshing, error, refetch, refresh } =
    useFavouriteFoods();
  const { toggleFavourite } = useFavourites();

  const {
    summary,
    hasBudget,
    quantityByFoodId,
    addItem,
    incrementItem,
    decrementItem,
    removeFromPlatter,
  } = usePlatter();

  const goBack = useCallback(() => navigation.goBack(), [navigation]);

  // The "over budget" warning only means something once a budget is set.
  const remainingBudget = hasBudget ? summary.remaining : Number.MAX_SAFE_INTEGER;

  const renderItem = useCallback(
    ({ item }) => (
      <View style={styles.row}>
        <FoodCard
          food={item}
          quantity={quantityByFoodId[item.id] || 0}
          remainingBudget={remainingBudget}
          isFavourite
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
      remainingBudget,
      addItem,
      incrementItem,
      decrementItem,
      removeFromPlatter,
      toggleFavourite,
    ]
  );

  const renderBody = () => {
    if (isLoading) {
      return <LoadingSpinner label="Loading favourites…" />;
    }

    if (error && foods.length === 0) {
      return <ErrorMessage message={error} variant="block" onRetry={refetch} />;
    }

    return (
      <FlatList
        data={foods}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <EmptyState
            iconName="heart-outline"
            title="No favourites yet"
            description="Tap the heart on any food to keep it here for next time."
            actionLabel="Browse food"
            onAction={goBack}
          />
        }
        contentContainerStyle={[styles.list, foods.length === 0 && styles.listEmpty]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      />
    );
  };

  return (
    <ScreenContainer>
      <AppHeader
        title="Favourites"
        subtitle={
          foods.length > 0
            ? `${foods.length} saved ${foods.length === 1 ? "item" : "items"}`
            : undefined
        }
        onBack={goBack}
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

export default FavouritesScreen;

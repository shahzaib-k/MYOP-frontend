import { useCallback, useMemo } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ScreenContainer from "../../components/common/ScreenContainer";
import AppHeader from "../../components/common/AppHeader";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";
import Badge from "../../components/common/Badge";
import CategoryCard from "../../components/food/CategoryCard";
import BudgetSummary from "../../components/platter/BudgetSummary";
import CartButton from "../../components/platter/CartButton";
import useCategories from "../../hooks/useCategories";
import usePlatter from "../../hooks/usePlatter";
import { formatCurrency } from "../../utils/currency";
import { getColumnCount } from "../../utils/responsive";
import MESSAGES from "../../constants/messages";
import ROUTES from "../../navigation/routes";
import { colors, radii, spacing } from "../../constants/theme";

const MIN_TILE_WIDTH = 168;
const GRID_PADDING = spacing.xl * 2;

/** Step 2: pick a category to browse. */
const CategoriesScreen = ({ navigation }) => {
  const { categories, isLoading, isRefreshing, error, refetch, refresh } =
    useCategories();
  const { summary, budget } = usePlatter();

  const { width } = useWindowDimensions();
  const numColumns = useMemo(
    () => getColumnCount(width, MIN_TILE_WIDTH, GRID_PADDING),
    [width]
  );

  const handleSelectCategory = useCallback(
    (category) => {
      navigation.navigate(ROUTES.foodList, {
        categoryId: category.id,
        categoryName: category.name,
      });
    },
    [navigation]
  );

  const renderItem = useCallback(
    ({ item }) => (
      <CategoryCard
        category={item}
        onPress={handleSelectCategory}
        style={styles.card}
      />
    ),
    [handleSelectCategory]
  );

  const renderBody = () => {
    if (isLoading) {
      return <LoadingSpinner label="Loading categories…" />;
    }

    if (error && categories.length === 0) {
      return (
        <ErrorMessage message={error} variant="block" onRetry={refetch} />
      );
    }

    return (
      <FlatList
        key={numColumns}
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={numColumns}
        columnWrapperStyle={numColumns > 1 ? styles.column : undefined}
        contentContainerStyle={[
          styles.list,
          categories.length === 0 && styles.listEmpty,
        ]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <BudgetSummary summary={summary} style={styles.budget} />
        }
        ListEmptyComponent={
          <EmptyState
            iconName="grid-outline"
            title={MESSAGES.emptyCategories.title}
            description={MESSAGES.emptyCategories.description}
            actionLabel="Refresh"
            onAction={refetch}
          />
        }
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
        title="Choose a category"
        subtitle="Pick where you want to start"
        onBack={() => navigation.goBack()}
        rightSlot={
          <View style={styles.headerActions}>
            <Pressable
              onPress={() => navigation.navigate(ROUTES.favourites)}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Open favourites"
              style={styles.favouritesButton}
            >
              <Ionicons name="heart" size={18} color={colors.danger} />
            </Pressable>
            <Badge
              label={formatCurrency(budget)}
              tone="primary"
              iconName="wallet-outline"
            />
          </View>
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
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  favouritesButton: {
    width: 34,
    height: 34,
    borderRadius: radii.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.dangerSoft,
  },
  list: {
    paddingHorizontal: spacing.xl,
    paddingBottom: 120,
  },
  listEmpty: {
    flexGrow: 1,
  },
  column: {
    gap: spacing.md,
  },
  card: {
    flex: 1,
    marginBottom: spacing.md,
  },
  budget: {
    marginBottom: spacing.lg,
  },
});

export default CategoriesScreen;

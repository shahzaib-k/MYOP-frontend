import { useCallback, useMemo, useState } from "react";
import { FlatList, LayoutAnimation, Platform, RefreshControl, StyleSheet, UIManager, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import ScreenContainer from "../../components/common/ScreenContainer";
import AppHeader from "../../components/common/AppHeader";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";
import OrderCard from "../../components/orders/OrderCard";
import OrderFilterTabs from "../../components/orders/OrderFilterTabs";
import useOrders from "../../hooks/useOrders";
import useReorder from "../../hooks/useReorder";
import { isActiveOrder } from "../../constants/orderStatus";
import ROUTES from "../../navigation/routes";
import { colors, spacing } from "../../constants/theme";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimentalAndroid) {
  UIManager.setLayoutAnimationEnabledExperimentalAndroid(true);
}

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
];

const EMPTY_COPY = {
  all: {
    title: "No orders yet",
    description: "Orders you place will show up here.",
  },
  active: {
    title: "No active orders",
    description: "Orders that are pending or being prepared will show up here.",
  },
  completed: {
    title: "No completed orders yet",
    description: "Orders you've received will show up here.",
  },
};

/** Order history: All / Active (pending + preparing) / Completed. */
const OrdersScreen = ({ navigation }) => {
  const { orders, isLoading, isRefreshing, error, refetch, refresh } = useOrders();
  const [filter, setFilter] = useState("all");

  // Picking up a status change (e.g. a cancel) made on the detail screen.
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const counts = useMemo(
    () => ({
      all: orders.length,
      active: orders.filter((order) => isActiveOrder(order.status)).length,
      completed: orders.filter((order) => order.status === "completed").length,
    }),
    [orders]
  );

  const filterOptions = useMemo(
    () => FILTERS.map((option) => ({ ...option, count: counts[option.value] })),
    [counts]
  );

  const filteredOrders = useMemo(() => {
    if (filter === "active") {
      return orders.filter((order) => isActiveOrder(order.status));
    }

    if (filter === "completed") {
      return orders.filter((order) => order.status === "completed");
    }

    return orders;
  }, [orders, filter]);

  const handleSelectFilter = useCallback((value) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setFilter(value);
  }, []);

  const handleOpenOrder = useCallback(
    (order) => navigation.navigate(ROUTES.orderDetail, { order }),
    [navigation]
  );

  const { reorder } = useReorder(navigation);

  const renderItem = useCallback(
    ({ item }) => (
      <OrderCard order={item} onPress={handleOpenOrder} onReorder={reorder} />
    ),
    [handleOpenOrder, reorder]
  );

  const renderBody = () => {
    if (isLoading) {
      return <LoadingSpinner label="Loading your orders…" />;
    }

    if (error && orders.length === 0) {
      return <ErrorMessage message={error} variant="block" onRetry={refetch} />;
    }

    const emptyCopy = EMPTY_COPY[filter];

    return (
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.orderId}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.list,
          filteredOrders.length === 0 && styles.listEmpty,
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            iconName="receipt-outline"
            title={emptyCopy.title}
            description={emptyCopy.description}
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
      <AppHeader title="My Orders" subtitle="Track past and current orders" />

      <View style={styles.filters}>
        <OrderFilterTabs
          options={filterOptions}
          selectedValue={filter}
          onSelect={handleSelectFilter}
        />
      </View>

      <View style={styles.body}>{renderBody()}</View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  filters: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  body: {
    flex: 1,
  },
  list: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  listEmpty: {
    flexGrow: 1,
  },
});

export default OrdersScreen;

import { useCallback } from "react";
import PlatterView from "../../components/platter/PlatterView";
import ROUTES from "../../navigation/routes";

/**
 * Step 4 of the Order tab's flow: review the platter, adjust it and place the
 * order. All the actual UI and submit logic lives in PlatterView — this just
 * wires it to the Order stack's own navigation.
 */
const OrderSummaryScreen = ({ navigation }) => {
  const handleOrderPlaced = useCallback(
    (order, message) => {
      // Success replaces the summary in the stack so back never returns to an
      // order that has already been placed.
      navigation.reset({
        index: 2,
        routes: [
          { name: ROUTES.budget },
          { name: ROUTES.categories },
          { name: ROUTES.orderSuccess, params: { order, message } },
        ],
      });
    },
    [navigation]
  );

  return (
    <PlatterView
      onBack={() => navigation.goBack()}
      onBrowseCategories={() => navigation.navigate(ROUTES.categories)}
      onAddMore={() => navigation.goBack()}
      onOrderPlaced={handleOrderPlaced}
    />
  );
};

export default OrderSummaryScreen;

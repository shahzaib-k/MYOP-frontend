import { useCallback } from "react";
import PlatterView from "../../components/platter/PlatterView";
import ROUTES, { TABS } from "../../navigation/routes";

/**
 * The "Platter" tab: the same review UI as OrderSummaryScreen, but always
 * reachable from the bottom bar instead of only after adding an item while
 * browsing. It has no back stack of its own, so every action that needs a
 * screen from the ordering flow jumps into the Order tab explicitly.
 */
const PlatterScreen = ({ navigation }) => {
  const goToOrderTab = useCallback(
    (screen, params) => navigation.navigate(TABS.order, { screen, params }),
    [navigation]
  );

  const handleOrderPlaced = useCallback(
    (order, message) => {
      goToOrderTab(ROUTES.orderSuccess, { order, message });
    },
    [goToOrderTab]
  );

  return (
    <PlatterView
      onBrowseCategories={() => goToOrderTab(ROUTES.categories)}
      onAddMore={() => goToOrderTab(ROUTES.categories)}
      onOrderPlaced={handleOrderPlaced}
    />
  );
};

export default PlatterScreen;

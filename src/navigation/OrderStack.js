import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BudgetScreen from "../screens/budget/BudgetScreen";
import CategoriesScreen from "../screens/categories/CategoriesScreen";
import FoodListScreen from "../screens/foods/FoodListScreen";
import OrderSummaryScreen from "../screens/summary/OrderSummaryScreen";
import OrderSuccessScreen from "../screens/success/OrderSuccessScreen";
import ROUTES from "./routes";

const Stack = createNativeStackNavigator();

/**
 * The ordering flow, nested inside the "Order" tab:
 *   Budget → Categories → Food list → Order summary → Success
 *
 * Headers are disabled because every screen renders its own AppHeader, which
 * carries budget context the native header can't.
 */
const OrderStack = () => (
  <Stack.Navigator
    initialRouteName={ROUTES.budget}
    screenOptions={{ headerShown: false, animation: "slide_from_right" }}
  >
    <Stack.Screen name={ROUTES.budget} component={BudgetScreen} />
    <Stack.Screen name={ROUTES.categories} component={CategoriesScreen} />
    <Stack.Screen name={ROUTES.foodList} component={FoodListScreen} />
    <Stack.Screen name={ROUTES.orderSummary} component={OrderSummaryScreen} />
    <Stack.Screen
      name={ROUTES.orderSuccess}
      component={OrderSuccessScreen}
      options={{ gestureEnabled: false }}
    />
  </Stack.Navigator>
);

export default OrderStack;

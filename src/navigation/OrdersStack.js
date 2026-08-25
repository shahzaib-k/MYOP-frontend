import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OrdersScreen from "../screens/orders/OrdersScreen";
import OrderDetailScreen from "../screens/orders/OrderDetailScreen";
import ROUTES from "./routes";

const Stack = createNativeStackNavigator();

/** Order history tab: the list, then a detail screen for one order. */
const OrdersStack = () => (
  <Stack.Navigator
    initialRouteName={ROUTES.orders}
    screenOptions={{ headerShown: false, animation: "slide_from_right" }}
  >
    <Stack.Screen name={ROUTES.orders} component={OrdersScreen} />
    <Stack.Screen name={ROUTES.orderDetail} component={OrderDetailScreen} />
  </Stack.Navigator>
);

export default OrdersStack;

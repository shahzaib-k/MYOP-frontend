import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import ROUTES from "./routes";

const Stack = createNativeStackNavigator();

/**
 * Shown while there is no session. Orders are a protected endpoint, so the
 * ordering flow is only reachable once a customer is signed in.
 */
const AuthNavigator = () => (
  <Stack.Navigator
    initialRouteName={ROUTES.login}
    screenOptions={{ headerShown: false, animation: "slide_from_right" }}
  >
    <Stack.Screen name={ROUTES.login} component={LoginScreen} />
    <Stack.Screen name={ROUTES.register} component={RegisterScreen} />
  </Stack.Navigator>
);

export default AuthNavigator;

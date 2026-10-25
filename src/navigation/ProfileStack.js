import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "../screens/profile/ProfileScreen";
import EditProfileScreen from "../screens/profile/EditProfileScreen";
import ChangePasswordScreen from "../screens/profile/ChangePasswordScreen";
import ROUTES from "./routes";

const Stack = createNativeStackNavigator();

/** Profile tab: the account hub, then the edit-profile and password forms. */
const ProfileStack = () => (
  <Stack.Navigator
    initialRouteName={ROUTES.profile}
    screenOptions={{ headerShown: false, animation: "slide_from_right" }}
  >
    <Stack.Screen name={ROUTES.profile} component={ProfileScreen} />
    <Stack.Screen name={ROUTES.editProfile} component={EditProfileScreen} />
    <Stack.Screen name={ROUTES.changePassword} component={ChangePasswordScreen} />
  </Stack.Navigator>
);

export default ProfileStack;

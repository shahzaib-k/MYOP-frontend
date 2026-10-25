import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import OrderStack from "./OrderStack";
import OrdersStack from "./OrdersStack";
import ProfileStack from "./ProfileStack";
import PlatterScreen from "../screens/platter/PlatterScreen";
import PlatterTabIcon from "../components/navigation/PlatterTabIcon";
import usePushNotifications from "../hooks/usePushNotifications";
import { TABS } from "./routes";
import { colors, typography } from "../constants/theme";

const Tab = createBottomTabNavigator();

/**
 * Signed-in shell: a minimal four-tab bar sitting above the ordering flow.
 *
 * "Order" keeps the existing Budget → Categories → Food list → Summary →
 * Success stack untouched. "Platter" and "Orders" are always reachable —
 * unlike the old design, reviewing the current platter or checking past
 * orders no longer requires being mid-flow in the Order tab.
 */
const MainNavigator = () => {
  usePushNotifications();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      <Tab.Screen
        name={TABS.order}
        component={OrderStack}
        options={{
          tabBarLabel: "Order",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "restaurant" : "restaurant-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name={TABS.platter}
        component={PlatterScreen}
        options={{
          tabBarLabel: "Platter",
          tabBarIcon: (props) => <PlatterTabIcon {...props} />,
        }}
      />
      <Tab.Screen
        name={TABS.orders}
        component={OrdersStack}
        options={{
          tabBarLabel: "Orders",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "receipt" : "receipt-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name={TABS.profile}
        component={ProfileStack}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  tabBarLabel: {
    ...typography.label,
    fontSize: 11,
    letterSpacing: 0,
    textTransform: "none",
    fontWeight: "600",
  },
  tabBarItem: {
    paddingTop: 4,
  },
});

export default MainNavigator;

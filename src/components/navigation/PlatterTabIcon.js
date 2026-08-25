import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import usePlatter from "../../hooks/usePlatter";
import { colors, radii, typography } from "../../constants/theme";

/**
 * Tab icon for the Platter tab. Reads the live item count itself (rather than
 * MainNavigator passing it down) so the badge updates the instant an item is
 * added, no matter which tab is currently focused.
 */
const PlatterTabIcon = ({ color, size, focused }) => {
  const { summary } = usePlatter();
  const count = summary.itemCount;

  return (
    <View style={styles.wrapper}>
      <Ionicons name={focused ? "basket" : "basket-outline"} size={size} color={color} />

      {count > 0 ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText} numberOfLines={1}>
            {count > 99 ? "99+" : count}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -10,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 3,
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    ...typography.label,
    fontSize: 9,
    lineHeight: 11,
    letterSpacing: 0,
    color: colors.textInverse,
  },
});

export default PlatterTabIcon;

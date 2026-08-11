import { memo } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../constants/theme";

/**
 * Screen shell. Handles safe-area insets once so no screen has to think about
 * notches or the Android navigation bar.
 *
 * `edges` defaults to top-only: screens with a docked footer (the cart button,
 * the place-order bar) pad their own bottom, and adding a bottom inset here
 * would double it.
 */
const ScreenContainer = ({
  children,
  style,
  backgroundColor = colors.background,
  edges = ["top"],
}) => (
  <SafeAreaView style={[styles.safeArea, { backgroundColor }]} edges={edges}>
    <View style={[styles.content, style]}>{children}</View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default memo(ScreenContainer);

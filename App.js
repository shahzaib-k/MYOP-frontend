import { StatusBar } from "expo-status-bar";
import AppProviders from "./src/context/AppProviders";
import RootNavigator from "./src/navigation/RootNavigator";
import useTheme from "./src/hooks/useTheme";

/** Light icons on a dark app, dark icons on a light one. */
const ThemedStatusBar = () => {
  const { isDark } = useTheme();

  return <StatusBar style={isDark ? "light" : "dark"} />;
};

/**
 * Entry point. All it does is mount the global providers and the navigator —
 * every decision about what to render lives in RootNavigator.
 */
export default function App() {
  return (
    <AppProviders>
      <ThemedStatusBar />
      <RootNavigator />
    </AppProviders>
  );
}

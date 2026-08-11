import { StatusBar } from "expo-status-bar";
import AppProviders from "./src/context/AppProviders";
import RootNavigator from "./src/navigation/RootNavigator";

/**
 * Entry point. All it does is mount the global providers and the navigator —
 * every decision about what to render lives in RootNavigator.
 */
export default function App() {
  return (
    <AppProviders>
      <StatusBar style="dark" />
      <RootNavigator />
    </AppProviders>
  );
}

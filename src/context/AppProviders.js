import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "./AuthContext";
import { PlatterProvider } from "./PlatterContext";

/**
 * Composes every global provider so App.js stays a single element deep and new
 * providers only ever get added in one place.
 */
export const AppProviders = ({ children }) => (
  <SafeAreaProvider>
    <AuthProvider>
      <PlatterProvider>{children}</PlatterProvider>
    </AuthProvider>
  </SafeAreaProvider>
);

export default AppProviders;

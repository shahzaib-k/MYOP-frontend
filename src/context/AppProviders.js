import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "./AuthContext";
import { FavouritesProvider } from "./FavouritesContext";
import { PlatterProvider } from "./PlatterContext";

/**
 * Composes every global provider so App.js stays a single element deep and new
 * providers only ever get added in one place.
 */
export const AppProviders = ({ children }) => (
  <SafeAreaProvider>
    <AuthProvider>
      <FavouritesProvider>
        <PlatterProvider>{children}</PlatterProvider>
      </FavouritesProvider>
    </AuthProvider>
  </SafeAreaProvider>
);

export default AppProviders;

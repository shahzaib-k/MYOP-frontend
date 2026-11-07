import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "./AuthContext";
import { FavouritesProvider } from "./FavouritesContext";
import { PlatterProvider } from "./PlatterContext";
import { ThemeProvider } from "./ThemeContext";

/**
 * Composes every global provider so App.js stays a single element deep and new
 * providers only ever get added in one place. Theme is outermost so even the
 * login and splash screens are themed.
 */
export const AppProviders = ({ children }) => (
  <SafeAreaProvider>
    <ThemeProvider>
      <AuthProvider>
        <FavouritesProvider>
          <PlatterProvider>{children}</PlatterProvider>
        </FavouritesProvider>
      </AuthProvider>
    </ThemeProvider>
  </SafeAreaProvider>
);

export default AppProviders;

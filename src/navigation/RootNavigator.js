import { useEffect, useMemo, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./AuthNavigator";
import MainNavigator from "./MainNavigator";
import buildNavigationTheme from "./navigationTheme";
import { navigationRef } from "./navigationRef";
import SplashScreen from "../screens/splash/SplashScreen";
import useAuth from "../hooks/useAuth";
import usePlatter from "../hooks/usePlatter";
import useTheme from "../hooks/useTheme";
import { SPLASH_DURATION } from "../constants/config";

/**
 * Decides what the app shows at launch.
 *
 * The splash stays up until both are true: the minimum display time has
 * elapsed, and the persisted session and budget have been read back. That
 * avoids a flash of the login screen before a stored token is restored.
 */
const RootNavigator = () => {
  const { isAuthenticated, isRestoring: isRestoringAuth } = useAuth();
  const { isRestoring: isRestoringPlatter } = usePlatter();
  const { colors, isDark, isRestoring: isRestoringTheme } = useTheme();

  const navigationTheme = useMemo(
    () => buildNavigationTheme(colors, isDark),
    [colors, isDark]
  );

  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsSplashVisible(false), SPLASH_DURATION);

    return () => clearTimeout(timer);
  }, []);

  const isBootstrapping =
    isSplashVisible || isRestoringAuth || isRestoringPlatter || isRestoringTheme;

  if (isBootstrapping) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer ref={navigationRef} theme={navigationTheme}>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default RootNavigator;

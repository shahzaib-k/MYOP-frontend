import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./AuthNavigator";
import MainNavigator from "./MainNavigator";
import navigationTheme from "./navigationTheme";
import { navigationRef } from "./navigationRef";
import SplashScreen from "../screens/splash/SplashScreen";
import useAuth from "../hooks/useAuth";
import usePlatter from "../hooks/usePlatter";
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

  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsSplashVisible(false), SPLASH_DURATION);

    return () => clearTimeout(timer);
  }, []);

  const isBootstrapping =
    isSplashVisible || isRestoringAuth || isRestoringPlatter;

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

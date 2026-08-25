import { createNavigationContainerRef } from "@react-navigation/native";

/**
 * Lets code outside the component tree (a notification tap handler, fired
 * before any screen has mounted on cold start) trigger navigation once the
 * container is ready.
 */
export const navigationRef = createNavigationContainerRef();

export const navigate = (name, params) => {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
};

export default navigationRef;

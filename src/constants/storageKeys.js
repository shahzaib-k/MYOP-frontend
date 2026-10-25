/** AsyncStorage keys. Namespaced so they never collide with other libraries. */
export const STORAGE_KEYS = {
  authToken: "@myop/auth-token",
  authUser: "@myop/auth-user",
  budget: "@myop/budget",
  /** Favourites are per account, so two users on one device never mix. */
  favouritesFor: (userId) => `@myop/favourites/${userId}`,
};

export default STORAGE_KEYS;

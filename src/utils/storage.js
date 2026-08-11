import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Thin AsyncStorage wrapper. Storage failures are never worth crashing the app
 * over, so every call degrades to a null/no-op result instead of throwing.
 */
export const getItem = async (key) => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    return null;
  }
};

export const setItem = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
    return true;
  } catch (error) {
    return false;
  }
};

export const removeItem = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    return false;
  }
};

export const getObject = async (key) => {
  const raw = await getItem(key);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    // Corrupted entry: drop it so it can't keep failing on every launch.
    await removeItem(key);
    return null;
  }
};

export const setObject = async (key, value) =>
  setItem(key, JSON.stringify(value));

export const removeMany = async (keys = []) => {
  try {
    await AsyncStorage.multiRemove(keys);
    return true;
  } catch (error) {
    return false;
  }
};

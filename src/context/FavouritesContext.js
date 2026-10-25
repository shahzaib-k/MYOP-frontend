import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import useAuth from "../hooks/useAuth";
import STORAGE_KEYS from "../constants/storageKeys";
import { getObject, setObject } from "../utils/storage";

/**
 * The customer's favourite foods, stored on the device per account. Only ids
 * are kept; the Favourites screen looks the foods up from the live menu, so a
 * price change or a sold-out item is always current.
 */
export const FavouritesContext = createContext(null);

export const FavouritesProvider = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.userId;

  const [favouriteIds, setFavouriteIds] = useState([]);
  const idsRef = useRef([]);

  // Load this account's favourites whenever the signed-in user changes.
  useEffect(() => {
    let isCancelled = false;

    idsRef.current = [];
    setFavouriteIds([]);

    if (!userId) {
      return undefined;
    }

    const loadFavourites = async () => {
      const saved = await getObject(STORAGE_KEYS.favouritesFor(userId));

      if (!isCancelled && Array.isArray(saved)) {
        idsRef.current = saved;
        setFavouriteIds(saved);
      }
    };

    loadFavourites();

    return () => {
      isCancelled = true;
    };
  }, [userId]);

  const toggleFavourite = useCallback(
    (foodId) => {
      if (!userId || !foodId) {
        return;
      }

      const current = idsRef.current;
      const next = current.includes(foodId)
        ? current.filter((id) => id !== foodId)
        : [foodId, ...current];

      idsRef.current = next;
      setFavouriteIds(next);
      setObject(STORAGE_KEYS.favouritesFor(userId), next);
    },
    [userId]
  );

  const favouriteSet = useMemo(() => new Set(favouriteIds), [favouriteIds]);

  const value = useMemo(
    () => ({ favouriteIds, favouriteSet, toggleFavourite }),
    [favouriteIds, favouriteSet, toggleFavourite]
  );

  return (
    <FavouritesContext.Provider value={value}>
      {children}
    </FavouritesContext.Provider>
  );
};

export default FavouritesProvider;

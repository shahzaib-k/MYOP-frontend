import { useCallback, useMemo } from "react";
import useFetch from "./useFetch";
import useFavourites from "./useFavourites";
import { fetchAllFoods } from "../services/foodService";

/**
 * The favourite foods as full, current menu items. Favourites are stored as
 * ids; looking them up here means prices and sold-out state are never stale,
 * and an item removed from the menu simply drops out of the list.
 */
export const useFavouriteFoods = () => {
  const { favouriteIds } = useFavourites();

  const request = useCallback(() => fetchAllFoods(), []);

  const { data, isLoading, isRefreshing, error, refetch, refresh } = useFetch(
    request,
    { initialData: [] }
  );

  const foods = useMemo(() => {
    const foodsById = new Map((data || []).map((food) => [food.id, food]));

    // Keep the order the customer favourited them in (newest first).
    return favouriteIds.map((id) => foodsById.get(id)).filter(Boolean);
  }, [data, favouriteIds]);

  return { foods, isLoading, isRefreshing, error, refetch, refresh };
};

export default useFavouriteFoods;

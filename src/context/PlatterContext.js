import { createContext, useCallback, useEffect, useMemo, useReducer } from "react";
import platterReducer, {
  PLATTER_ACTIONS,
  platterInitialState,
} from "./platterReducer";
import STORAGE_KEYS from "../constants/storageKeys";
import { getObject, removeItem, setObject } from "../utils/storage";
import { summarizePlatter } from "../utils/platterCalculations";
import { isSoldOut } from "../utils/foodAvailability";

/**
 * Global platter state: the budget, the selected items and every total derived
 * from them. Totals are recomputed on each change, so any screen reading
 * `summary` is always current.
 *
 * Only the budget is persisted — a platter is a short-lived, in-session thing.
 */
export const PlatterContext = createContext(null);

export const PlatterProvider = ({ children }) => {
  const [state, dispatch] = useReducer(platterReducer, platterInitialState);

  useEffect(() => {
    const restoreBudget = async () => {
      const savedBudget = await getObject(STORAGE_KEYS.budget);

      dispatch({ type: PLATTER_ACTIONS.RESTORE, payload: savedBudget });
    };

    restoreBudget();
  }, []);

  const setBudget = useCallback((budget) => {
    const numericBudget = Number(budget) || 0;

    dispatch({ type: PLATTER_ACTIONS.SET_BUDGET, payload: numericBudget });
    setObject(STORAGE_KEYS.budget, numericBudget);
  }, []);

  const addItem = useCallback((food, quantity = 1) => {
    // Sold-out items can't be ordered, whichever screen tries to add one.
    if (isSoldOut(food)) {
      return;
    }

    dispatch({ type: PLATTER_ACTIONS.ADD_ITEM, payload: { food, quantity } });
  }, []);

  const incrementItem = useCallback((foodId) => {
    dispatch({ type: PLATTER_ACTIONS.INCREMENT, payload: foodId });
  }, []);

  const decrementItem = useCallback((foodId) => {
    dispatch({ type: PLATTER_ACTIONS.DECREMENT, payload: foodId });
  }, []);

  const setItemQuantity = useCallback((foodId, quantity) => {
    dispatch({
      type: PLATTER_ACTIONS.SET_QUANTITY,
      payload: { foodId, quantity },
    });
  }, []);

  const removeFromPlatter = useCallback((foodId) => {
    dispatch({ type: PLATTER_ACTIONS.REMOVE_ITEM, payload: foodId });
  }, []);

  const clearPlatter = useCallback(() => {
    dispatch({ type: PLATTER_ACTIONS.CLEAR_PLATTER });
  }, []);

  /** Clears the platter *and* the budget — used when starting a new platter. */
  const resetPlatter = useCallback(() => {
    dispatch({ type: PLATTER_ACTIONS.RESET });
    removeItem(STORAGE_KEYS.budget);
  }, []);

  const summary = useMemo(
    () => summarizePlatter(state.items, state.budget),
    [state.items, state.budget]
  );

  /** O(1) quantity lookups so food cards don't scan the array on every render. */
  const quantityByFoodId = useMemo(() => {
    const map = {};

    state.items.forEach((item) => {
      map[item.foodId] = item.quantity;
    });

    return map;
  }, [state.items]);

  const value = useMemo(
    () => ({
      budget: state.budget,
      items: state.items,
      isRestoring: state.isRestoring,
      hasBudget: state.budget > 0,
      summary,
      quantityByFoodId,
      setBudget,
      addItem,
      incrementItem,
      decrementItem,
      setItemQuantity,
      removeFromPlatter,
      clearPlatter,
      resetPlatter,
    }),
    [
      state.budget,
      state.items,
      state.isRestoring,
      summary,
      quantityByFoodId,
      setBudget,
      addItem,
      incrementItem,
      decrementItem,
      setItemQuantity,
      removeFromPlatter,
      clearPlatter,
      resetPlatter,
    ]
  );

  return (
    <PlatterContext.Provider value={value}>{children}</PlatterContext.Provider>
  );
};

export default PlatterProvider;

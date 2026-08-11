import { MAX_ITEM_QUANTITY } from "../constants/config";
import { toPlatterItem } from "../utils/platterCalculations";

/**
 * Reducer for the budget + platter state. Kept in its own file so
 * PlatterContext stays focused on wiring and persistence.
 */

export const platterInitialState = {
  budget: 0,
  items: [],
  /** True until the persisted budget has been read back from storage. */
  isRestoring: true,
};

export const PLATTER_ACTIONS = {
  RESTORE: "RESTORE",
  SET_BUDGET: "SET_BUDGET",
  ADD_ITEM: "ADD_ITEM",
  INCREMENT: "INCREMENT",
  DECREMENT: "DECREMENT",
  SET_QUANTITY: "SET_QUANTITY",
  REMOVE_ITEM: "REMOVE_ITEM",
  CLEAR_PLATTER: "CLEAR_PLATTER",
  RESET: "RESET",
};

const clampQuantity = (quantity) =>
  Math.min(Math.max(quantity, 0), MAX_ITEM_QUANTITY);

/** Applies a quantity change, dropping the line when it reaches zero. */
const changeQuantity = (items, foodId, getNextQuantity) =>
  items.reduce((next, item) => {
    if (item.foodId !== foodId) {
      next.push(item);
      return next;
    }

    const quantity = clampQuantity(getNextQuantity(item.quantity));

    if (quantity > 0) {
      next.push({ ...item, quantity });
    }

    return next;
  }, []);

export const platterReducer = (state, action) => {
  switch (action.type) {
    case PLATTER_ACTIONS.RESTORE:
      return { ...state, budget: action.payload || 0, isRestoring: false };

    case PLATTER_ACTIONS.SET_BUDGET:
      return { ...state, budget: Number(action.payload) || 0 };

    case PLATTER_ACTIONS.ADD_ITEM: {
      const { food, quantity = 1 } = action.payload;
      const existing = state.items.find((item) => item.foodId === food.id);

      if (existing) {
        return {
          ...state,
          items: changeQuantity(
            state.items,
            food.id,
            (current) => current + quantity
          ),
        };
      }

      return {
        ...state,
        items: [...state.items, toPlatterItem(food, clampQuantity(quantity))],
      };
    }

    case PLATTER_ACTIONS.INCREMENT:
      return {
        ...state,
        items: changeQuantity(
          state.items,
          action.payload,
          (current) => current + 1
        ),
      };

    case PLATTER_ACTIONS.DECREMENT:
      return {
        ...state,
        items: changeQuantity(
          state.items,
          action.payload,
          (current) => current - 1
        ),
      };

    case PLATTER_ACTIONS.SET_QUANTITY:
      return {
        ...state,
        items: changeQuantity(
          state.items,
          action.payload.foodId,
          () => action.payload.quantity
        ),
      };

    case PLATTER_ACTIONS.REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter((item) => item.foodId !== action.payload),
      };

    case PLATTER_ACTIONS.CLEAR_PLATTER:
      return { ...state, items: [] };

    case PLATTER_ACTIONS.RESET:
      return { ...platterInitialState, isRestoring: false };

    default:
      return state;
  }
};

export default platterReducer;

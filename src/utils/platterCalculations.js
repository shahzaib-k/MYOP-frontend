import { roundAmount } from "./currency";
import { MAX_SUGGESTIONS } from "../constants/config";

/**
 * Pure platter maths. Kept free of React so it can be reasoned about and
 * reused by the context reducer, the screens and any future tests.
 *
 * A platter item looks like:
 *   { foodId, name, price, category, image, description, quantity }
 */

export const getLineSubtotal = (item) =>
  roundAmount(Number(item.price) * Number(item.quantity));

export const calculateSubtotal = (items = []) =>
  roundAmount(items.reduce((total, item) => total + getLineSubtotal(item), 0));

export const countItems = (items = []) =>
  items.reduce((count, item) => count + Number(item.quantity), 0);

/**
 * Everything the budget UI needs, derived in one pass.
 * `total` currently equals `subtotal` because the backend applies no taxes or
 * delivery charges — it stays separate so charges can be added in one place.
 */
export const summarizePlatter = (items = [], budget = 0) => {
  const subtotal = calculateSubtotal(items);
  const total = subtotal;
  const numericBudget = roundAmount(budget);
  const remaining = roundAmount(numericBudget - total);
  const isOverBudget = remaining < 0;

  return {
    itemCount: countItems(items),
    lineCount: items.length,
    subtotal,
    total,
    budget: numericBudget,
    remaining,
    isOverBudget,
    amountOverBudget: isOverBudget ? roundAmount(Math.abs(remaining)) : 0,
    /** 0–1, clamped, for the budget progress bar. */
    usageRatio:
      numericBudget > 0 ? Math.min(total / numericBudget, 1) : total > 0 ? 1 : 0,
  };
};

/** Maps a food item from the API into a platter item with a quantity. */
export const toPlatterItem = (food, quantity = 1) => ({
  foodId: food.id,
  name: food.name,
  price: Number(food.price),
  category: food.category,
  image: food.image,
  description: food.description,
  quantity,
});

/**
 * The exact item payload POST /api/orders expects. The backend re-reads prices
 * from Firebase, so only ids and quantities are sent.
 */
export const toOrderItems = (items = []) =>
  items.map((item) => ({ foodId: item.foodId, quantity: item.quantity }));

/**
 * Offline fallback for Smart Suggestions: cheaper items from the already
 * loaded list that still fit inside the remaining budget.
 */
export const findLocalSuggestions = (
  foods = [],
  remainingBudget = 0,
  selectedIds = [],
  limit = MAX_SUGGESTIONS
) => {
  if (remainingBudget <= 0) {
    return [];
  }

  const excluded = new Set(selectedIds);

  return foods
    .filter(
      (food) => !excluded.has(food.id) && Number(food.price) <= remainingBudget
    )
    .sort((a, b) => Number(b.price) - Number(a.price))
    .slice(0, limit);
};

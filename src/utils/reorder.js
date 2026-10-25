import { MAX_ITEM_QUANTITY } from "../constants/config";
import { roundAmount } from "./currency";
import { isSoldOut } from "./foodAvailability";
import { calculateSubtotal, toPlatterItem } from "./platterCalculations";

export const UNAVAILABLE_REASON = {
  soldOut: "sold_out",
  removed: "removed",
};

/**
 * Turns a past order into a platter using today's menu.
 *
 * Prices always come from the current food list (never the old order), items
 * that are sold out or no longer on the menu are skipped and reported, and the
 * budget is the old order's budget — raised to the new total if prices went up,
 * so the rebuilt platter is never instantly over budget.
 */
export const buildReorderPlan = (order, foods = []) => {
  const foodsById = new Map(foods.map((food) => [food.id, food]));

  const lines = [];
  const unavailable = [];

  (order?.items || []).forEach((item) => {
    const food = foodsById.get(item.foodId);

    if (!food) {
      unavailable.push({ name: item.name, reason: UNAVAILABLE_REASON.removed });
      return;
    }

    if (isSoldOut(food)) {
      unavailable.push({ name: food.name, reason: UNAVAILABLE_REASON.soldOut });
      return;
    }

    const quantity = Math.min(
      Math.max(Number(item.quantity) || 1, 1),
      MAX_ITEM_QUANTITY
    );

    lines.push({
      food,
      quantity,
      priceChanged: Number(food.price) !== Number(item.price),
    });
  });

  const total = calculateSubtotal(
    lines.map((line) => toPlatterItem(line.food, line.quantity))
  );

  return {
    lines,
    unavailable,
    total,
    priceChangedCount: lines.filter((line) => line.priceChanged).length,
    budget: roundAmount(Math.max(Number(order?.budget) || 0, total)),
  };
};

/** One-line summary of what could not be added, for the confirmation alert. */
export const describeUnavailable = (unavailable = []) => {
  if (unavailable.length === 0) {
    return "";
  }

  const names = unavailable.map((entry) => entry.name).join(", ");

  return `Not added (sold out or no longer on the menu): ${names}.`;
};

import { useCallback, useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import usePlatter from "./usePlatter";
import { fetchAllFoods } from "../services/foodService";
import { buildReorderPlan, describeUnavailable } from "../utils/reorder";
import { getErrorMessage } from "../utils/errorHandler";
import { TABS } from "../navigation/routes";

/**
 * "Reorder" from a past order: rebuild the platter from the current menu and
 * take the customer to the Platter tab to review it.
 *
 * Nothing is sent to the backend here — the customer still reviews the platter
 * and places the order themselves, so a changed price or a sold-out item is
 * visible before any money is committed.
 */
export const useReorder = (navigation) => {
  const { items, setBudget, addItem, clearPlatter } = usePlatter();
  const [isReordering, setIsReordering] = useState(false);

  const isMounted = useRef(true);
  const inFlight = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  const applyPlan = useCallback(
    (plan) => {
      clearPlatter();
      setBudget(plan.budget);
      plan.lines.forEach(({ food, quantity }) => addItem(food, quantity));

      const notes = [describeUnavailable(plan.unavailable)];

      if (plan.priceChangedCount > 0) {
        notes.push("Some prices have changed since your last order.");
      }

      const message = notes.filter(Boolean).join("\n\n");

      if (message) {
        Alert.alert("Platter ready", message);
      }

      navigation.navigate(TABS.platter);
    },
    [addItem, clearPlatter, navigation, setBudget]
  );

  const runReorder = useCallback(
    async (order) => {
      if (inFlight.current) {
        return;
      }

      inFlight.current = true;
      setIsReordering(true);

      try {
        const foods = await fetchAllFoods();
        const plan = buildReorderPlan(order, foods);

        if (plan.lines.length === 0) {
          Alert.alert(
            "Can't reorder",
            "None of the items from this order are available right now."
          );
          return;
        }

        applyPlan(plan);
      } catch (error) {
        Alert.alert("Can't reorder", getErrorMessage(error));
      } finally {
        inFlight.current = false;

        if (isMounted.current) {
          setIsReordering(false);
        }
      }
    },
    [applyPlan]
  );

  const reorder = useCallback(
    (order) => {
      if (items.length === 0) {
        runReorder(order);
        return;
      }

      Alert.alert(
        "Replace your current platter?",
        "Reordering will clear the items you've already picked.",
        [
          { text: "Keep current", style: "cancel" },
          { text: "Replace", style: "destructive", onPress: () => runReorder(order) },
        ]
      );
    },
    [items.length, runReorder]
  );

  return { reorder, isReordering };
};

export default useReorder;

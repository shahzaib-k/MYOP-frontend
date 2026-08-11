import { useEffect, useMemo, useRef, useState } from "react";
import { reviewPlatter } from "../services/recommendationService";
import { findLocalSuggestions } from "../utils/platterCalculations";
import useDebouncedValue from "./useDebouncedValue";
import usePlatter from "./usePlatter";
import { MAX_SUGGESTIONS } from "../constants/config";

/**
 * Smart Suggestions.
 *
 * Primary source is POST /api/recommendations/review, which prices the platter
 * from live data and returns `addOns` that fit the leftover budget (plus
 * cheaper `alternatives` when the platter is over budget).
 *
 * If that call fails — offline, server down — we fall back to filtering the
 * foods already loaded on screen, so the feature degrades instead of vanishing.
 *
 * The endpoint requires a positive budget AND a non-empty item list, so an
 * empty platter is always served locally.
 */

/** addOns use `foodId`; the platter and food cards expect `id`. */
const toFoodShape = (suggestion) => ({
  id: suggestion.foodId,
  name: suggestion.name,
  category: suggestion.category,
  price: Number(suggestion.price),
  image: suggestion.image || "",
  description: suggestion.description || "",
});

export const useSuggestions = (availableFoods = []) => {
  const { items, budget, summary } = usePlatter();

  const [remoteResult, setRemoteResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [usedFallback, setUsedFallback] = useState(false);

  /** Only the ids and quantities affect the result, so debounce on those. */
  const platterSignature = useMemo(
    () => items.map((item) => `${item.foodId}:${item.quantity}`).join("|"),
    [items]
  );

  const debouncedSignature = useDebouncedValue(platterSignature, 500);
  const debouncedBudget = useDebouncedValue(budget, 500);

  const itemsRef = useRef(items);
  itemsRef.current = items;

  const isMounted = useRef(true);
  const requestId = useRef(0);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const currentItems = itemsRef.current;

    if (currentItems.length === 0 || debouncedBudget <= 0) {
      setRemoteResult(null);
      setUsedFallback(false);
      setIsLoading(false);
      return;
    }

    const currentRequest = requestId.current + 1;
    requestId.current = currentRequest;

    const loadSuggestions = async () => {
      setIsLoading(true);

      try {
        const review = await reviewPlatter({
          budget: debouncedBudget,
          items: currentItems,
        });

        if (isMounted.current && requestId.current === currentRequest) {
          setRemoteResult(review);
          setUsedFallback(false);
        }
      } catch (error) {
        if (isMounted.current && requestId.current === currentRequest) {
          setRemoteResult(null);
          setUsedFallback(true);
        }
      } finally {
        if (isMounted.current && requestId.current === currentRequest) {
          setIsLoading(false);
        }
      }
    };

    loadSuggestions();
  }, [debouncedSignature, debouncedBudget]);

  const selectedIds = useMemo(
    () => items.map((item) => item.foodId),
    [items]
  );

  const localSuggestions = useMemo(
    () =>
      findLocalSuggestions(
        availableFoods,
        summary.remaining,
        selectedIds,
        MAX_SUGGESTIONS
      ),
    [availableFoods, summary.remaining, selectedIds]
  );

  const suggestions = useMemo(() => {
    if (remoteResult?.addOns?.length) {
      return remoteResult.addOns.map(toFoodShape);
    }

    return localSuggestions;
  }, [remoteResult, localSuggestions]);

  return {
    suggestions,
    /** Cheaper same-category swaps; only populated when over budget. */
    alternatives: remoteResult?.alternatives || [],
    isLoading,
    /** True when the backend engine was unreachable and local filtering ran. */
    usedFallback,
    source: usedFallback || !remoteResult ? "local" : "server",
  };
};

export default useSuggestions;

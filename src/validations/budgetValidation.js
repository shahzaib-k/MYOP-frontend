import { isBlank, isPositiveNumber } from "./validators";

/** Guards against absurd inputs that would break the budget bar UI. */
const MAX_BUDGET = 1000000;

/**
 * Budget rules from the spec: required, numeric only, greater than zero.
 * Returns an error string or null.
 */
export const validateBudget = (value) => {
  if (isBlank(value)) {
    return "Please enter your budget";
  }

  if (!/^\d+(\.\d{1,2})?$/.test(String(value).trim())) {
    return "Budget must be a number";
  }

  if (!isPositiveNumber(value)) {
    return "Budget must be greater than zero";
  }

  if (Number(value) > MAX_BUDGET) {
    return "Please enter a smaller budget";
  }

  return null;
};

export const validateBudgetForm = (budget) => {
  const error = validateBudget(budget);

  return { isValid: !error, errors: error ? { budget: error } : {} };
};

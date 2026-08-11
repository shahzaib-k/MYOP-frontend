/** User-facing copy kept in one place so wording stays consistent. */
export const MESSAGES = {
  network:
    "Can't reach the server. Check your internet connection and try again.",
  timeout: "The server took too long to respond. Please try again.",
  serverUnavailable:
    "The server is unavailable right now. Please try again in a moment.",
  unknown: "Something went wrong. Please try again.",
  sessionExpired: "Your session has expired. Please sign in again.",

  emptyCategories: {
    title: "No categories yet",
    description:
      "Food categories haven't been added yet. Please check back shortly.",
  },
  emptyFoods: {
    title: "No items in this category",
    description: "Try another category to keep building your platter.",
  },
  emptyCart: {
    title: "Your platter is empty",
    description: "Add a few items and they'll show up here.",
  },
};

export default MESSAGES;

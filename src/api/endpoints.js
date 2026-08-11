/** Every backend path in one place — screens and services never inline URLs. */
export const ENDPOINTS = {
  auth: {
    register: "/api/auth/register",
    login: "/api/auth/login",
    me: "/api/auth/me",
    updateProfile: "/api/auth/me",
    changePassword: "/api/auth/me/password",
  },
  categories: {
    list: "/api/categories",
    detail: (id) => `/api/categories/${id}`,
  },
  foods: {
    list: "/api/foods",
    byCategory: (category) =>
      `/api/foods/category/${encodeURIComponent(category)}`,
  },
  orders: {
    create: "/api/orders",
    list: "/api/orders",
    detail: (id) => `/api/orders/${id}`,
    cancel: (id) => `/api/orders/${id}/cancel`,
  },
  recommendations: {
    platter: "/api/recommendations/platter",
    review: "/api/recommendations/review",
  },
};

export default ENDPOINTS;

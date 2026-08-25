/** Route names. Never type a screen name as a raw string at a call site. */
export const ROUTES = {
  login: "Login",
  register: "Register",

  budget: "Budget",
  categories: "Categories",
  foodList: "FoodList",
  orderSummary: "OrderSummary",
  orderSuccess: "OrderSuccess",

  orders: "Orders",
  orderDetail: "OrderDetail",
};

/** Bottom tab names, kept separate from stack screen names to avoid collisions. */
export const TABS = {
  order: "OrderTab",
  platter: "PlatterTab",
  orders: "OrdersTab",
};

export default ROUTES;

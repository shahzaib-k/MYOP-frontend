/** Route names. Never type a screen name as a raw string at a call site. */
export const ROUTES = {
  login: "Login",
  register: "Register",

  budget: "Budget",
  categories: "Categories",
  foodList: "FoodList",
  orderSummary: "OrderSummary",
  orderSuccess: "OrderSuccess",
  favourites: "Favourites",

  orders: "Orders",
  orderDetail: "OrderDetail",

  profile: "Profile",
  editProfile: "EditProfile",
  changePassword: "ChangePassword",
};

/** Bottom tab names, kept separate from stack screen names to avoid collisions. */
export const TABS = {
  order: "OrderTab",
  platter: "PlatterTab",
  orders: "OrdersTab",
  profile: "ProfileTab",
};

export default ROUTES;

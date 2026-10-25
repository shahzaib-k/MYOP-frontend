/**
 * A food is sold out only when the backend says so explicitly. Items without
 * the flag (an older backend, or items saved before it existed) count as
 * available so nothing is greyed out by accident.
 */
export const isSoldOut = (food) => food?.available === false;

export const filterAvailable = (foods = []) =>
  foods.filter((food) => !isSoldOut(food));

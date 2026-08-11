import { useContext } from "react";
import { PlatterContext } from "../context/PlatterContext";

export const usePlatter = () => {
  const context = useContext(PlatterContext);

  if (!context) {
    throw new Error("usePlatter must be used inside a PlatterProvider");
  }

  return context;
};

export default usePlatter;

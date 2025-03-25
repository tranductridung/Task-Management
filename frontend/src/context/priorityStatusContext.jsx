import React, { createContext, useContext, useState } from "react";

export const PriorityStatusContext = createContext();

export const PriorityStatusProvider = ({ children }) => {
  const [priority, setPriority] = useState("All");
  const [status, setStatus] = useState("All");

  return (
    <PriorityStatusContext.Provider
      value={{ priority, setPriority, status, setStatus }}
    >
      {children}
    </PriorityStatusContext.Provider>
  );
};

export const usePriorityStatusContext = () => useContext(PriorityStatusContext);

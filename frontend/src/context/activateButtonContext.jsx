import { useState, useContext, createContext } from "react";
const ActivateButtonContext = createContext();

export const ActivateButtonProvider = ({ children }) => {
  const [priorityActivate, setPriorityActivate] = useState("All");
  const [statusActivate, setStatusActivate] = useState("All");

  return (
    <ActivateButtonContext.Provider
      value={{
        priorityActivate,
        setPriorityActivate,
        statusActivate,
        setStatusActivate,
      }}
    >
      {children}
    </ActivateButtonContext.Provider>
  );
};

export const useActivateButtonContext = () => useContext(ActivateButtonContext);

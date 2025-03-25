import React, { createContext, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Tạo Context
const ToastContext = createContext();

// Hook sử dụng ToastContext
export const useToast = () => useContext(ToastContext);

// ToastProvider để bọc toàn bộ ứng dụng
export const ToastProvider = ({ children }) => {
  const customToast = {
    success: (message) =>
      toast.success(message, {
        className:
          "bg-green-500 text-white font-semibold px-4 py-3 rounded-lg shadow-md",
        progressClassName: "bg-green-300",
      }),
    error: (message) =>
      toast.error(message, {
        className:
          "bg-red-500 text-white font-semibold px-4 py-3 rounded-lg shadow-md",
        progressClassName: "bg-red-300",
      }),
    warning: (message) =>
      toast.warning(message, {
        className:
          "bg-yellow-500 text-black font-semibold px-4 py-3 rounded-lg shadow-md",
        progressClassName: "bg-yellow-300",
      }),
    info: (message) =>
      toast.info(message, {
        className:
          "bg-blue-500 text-white font-semibold px-4 py-3 rounded-lg shadow-md",
        progressClassName: "bg-blue-300",
      }),
  };

  return (
    <ToastContext.Provider value={customToast}>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        draggable
        pauseOnHover
      />
    </ToastContext.Provider>
  );
};

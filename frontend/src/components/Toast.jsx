import React, { useEffect } from "react";

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-700 border-green-400";
      case "error":
        return "bg-red-100 text-red-700 border-red-400";
      case "warning":
        return "bg-yellow-100 text-yellow-700 border-yellow-400";
      default:
        return "bg-gray-100 text-gray-700 border-gray-400";
    }
  };

  return (
    <div
      className={`fixed top-5 right-5 p-4 border rounded-lg shadow ${getStyles()}`}
    >
      <p>{message}</p>
    </div>
  );
};

export default Toast;

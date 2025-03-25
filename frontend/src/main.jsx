import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { UserProvider } from "./context/userContext.jsx";
import { PriorityStatusProvider } from "./context/priorityStatusContext.jsx";
import { TasksProvider } from "./context/tasksContext.jsx";
import { ToastProvider } from "./context/toastContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ToastProvider>
      <UserProvider>
        <PriorityStatusProvider>
          <TasksProvider>
            <App />
          </TasksProvider>
        </PriorityStatusProvider>
      </UserProvider>
    </ToastProvider>
  </StrictMode>
);

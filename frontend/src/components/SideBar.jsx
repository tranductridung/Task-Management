import React, { useEffect } from "react";
import { MdOutlineWidgets, MdPendingActions } from "react-icons/md";
import { GoChecklist } from "react-icons/go";
import { LuAlarmClockOff, LuClock4 } from "react-icons/lu";
import { usePriorityStatusContext } from "../context/priorityStatusContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useActivateButtonContext } from "../context/activateButtonContext";

const SideBar = () => {
  const { setPriority, status, setStatus } = usePriorityStatusContext();
  const { statusActivate, setStatusActivate } = useActivateButtonContext();

  const navigate = useNavigate();
  const location = useLocation();

  const buttons = [
    { name: "All", title: "ALL TASK", icon: <MdOutlineWidgets /> },
    { name: "Pending", title: "PENDING TASK", icon: <MdPendingActions /> },
    { name: "Completed", title: "COMPLETED TASK", icon: <GoChecklist /> },
    { name: "InProgress", title: "IN PROGRESS TASK", icon: <LuClock4 /> },
    { name: "OnHold", title: "ON HOLD TASK", icon: <LuAlarmClockOff /> },
  ];

  const btnClick = (buttonName) => {
    setStatusActivate(buttonName);
    setStatus(buttonName);

    if (location.pathname !== "/") {
      navigate("/");
    }
  };

  useEffect(() => {
    const currentLocation = location.pathname;

    if (currentLocation.startsWith("/tasks/")) {
      setStatus(null);
      setStatusActivate(null);
    } else {
      const newStatus = status ?? "All";
      setStatus(newStatus);
      setStatusActivate(newStatus);
      setPriority((prevPriority) => prevPriority ?? "All");
    }
  }, [location.pathname]);

  return (
    <div className="flex flex-1 my-2 flex-col items-center gap-6 text-2xl">
      {buttons.map(({ name, title, icon }) => (
        <button
          title={title}
          key={name}
          className={`status-btn
              ${name === statusActivate ? "active" : "inactive"}`}
          onClick={() => btnClick(name)}
        >
          {icon}
        </button>
      ))}
    </div>
  );
};

export default SideBar;

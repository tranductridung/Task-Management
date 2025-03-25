import React, { useEffect } from "react";
import api from "../api/api";
import { usePriorityStatusContext } from "../context/priorityStatusContext";
import { useTasksContext } from "../context/tasksContext";
import { useActivateButtonContext } from "../context/activateButtonContext";

const Tab = () => {
  const { priorityActivate, setPriorityActivate, setStatusActivate } =
    useActivateButtonContext();
  const { setStatus, priority, setPriority, status } =
    usePriorityStatusContext();
  const { setTasks } = useTasksContext();

  const priorityTabs = ["All", "Low", "Medium", "High"];

  const handlePriorityClick = async (priorityActive) => {
    // Return if priority not be changed
    if (priorityActivate === priorityActive) {
      return;
    }

    setPriority(priorityActive);
    setPriorityActivate(priorityActive);
  };

  useEffect(() => {
    const fetchTasks = async () => {
      const newStatus = status ? status : "All";
      const newPriority = priority ? priority : "All";

      setStatusActivate(newStatus);
      setStatus(newStatus);
      setPriority(newPriority);

      try {
        const response = await api.get(
          `/tasks/priority/${newPriority}/status/${newStatus}`
        );
        setTasks(response.data.tasks || []);
      } catch (error) {
        console.error("Error", error);
        setTasks([]);
      }
    };

    fetchTasks();
  }, [status, priority]);

  return (
    <div className="rounded-xl border-2 bg-gray-50 border-white p-1">
      <ul className="flex flex-wrap text-xs text-center text-gray-800">
        {priorityTabs.map((priorityTab) => (
          <li key={priorityTab} className="me-2">
            <button
              className={`priority-tab
                ${priority === priorityTab ? "active" : "inactive"}`}
              onClick={() => handlePriorityClick(priorityTab)}
            >
              {priorityTab}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tab;

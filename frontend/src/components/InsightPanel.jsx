import React, { useEffect, useState } from "react";
import { getInitials } from "../utils/helper";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { useUserContext } from "../context/userContext";
import { useTasksContext } from "../context/tasksContext";
import RadialChart from "./RadialChart";

const InsightPanel = () => {
  const navigate = useNavigate();
  const { user } = useUserContext();

  const { tasks } = useTasksContext();
  const [counts, setCounts] = useState({
    Pending: 0,
    InProgress: 0,
    OnHold: 0,
    Completed: 0,
  });

  useEffect(() => {
    const newCounts = {
      Pending: 0,
      InProgress: 0,
      OnHold: 0,
      Completed: 0,
    };

    tasks.forEach((task) => {
      if (newCounts[task.status] !== undefined) {
        newCounts[task.status]++;
      }
    });

    setCounts(newCounts);
  }, [tasks]);

  const handleLogout = async () => {
    try {
      await api.post("/users/logout");
      localStorage.removeItem("accessToken");
      navigate("/login");
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  return (
    <div className="flex flex-1 flex-col align-middle">
      <div className="flex flex-row items-center justify-items-center m-5 mt-10">
        <div to="/" className="w-[30%] h-full flex items-center justify-start">
          <img
            src="/logo.png"
            alt="logo image"
            className="rounded-full h-full aspect-square"
          />
        </div>
        <h1 className="pl-4 text-2xl">
          Hello, <br></br>
          <b>{user.userName}</b>
        </h1>
      </div>

      <div className="grid grid-cols-2 grid-rows-2 my-5">
        <div className="flex flex-col pl-5 text-xl">
          <h1 className="text-gray-600">Pending:</h1>
          <div className="pl-2 border-l-4 border-fuchsia-500 text-3xl font-semibold">
            {counts.Pending}
          </div>
        </div>

        <div className="flex flex-col pl-5 text-xl">
          <h1 className="text-gray-600">In Progress:</h1>
          <div className="pl-2 border-l-4 border-blue-500 text-3xl font-semibold">
            {counts.InProgress}
          </div>
        </div>

        <div className="flex flex-col pl-5 text-xl">
          <h1 className="text-gray-600">On Hold:</h1>
          <div className="pl-2 border-l-4 border-red-500 text-3xl font-semibold">
            {counts.OnHold}
          </div>
        </div>

        <div className="flex flex-col pl-5 text-xl">
          <h1 className="text-gray-600">Completed:</h1>
          <div className="pl-2 border-l-4 border-green-500 text-3xl font-semibold">
            {counts.Completed}
          </div>
        </div>
      </div>

      {/* <div className="flex-1 my-5">
      </div> */}

      <div className="m-2">
        <button
          type="submit"
          className="w-full rounded-full bg-red-400 px-10 py-2 hover:bg-red-500 hover:cursor-pointer"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default InsightPanel;

import React, { useEffect, useState } from "react";
import { useTasksContext } from "../context/tasksContext";
import api from "../api/api";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { FaRegTrashCan } from "react-icons/fa6";
import { HiDotsHorizontal } from "react-icons/hi";
import { GoDotFill } from "react-icons/go";
import { MdKeyboardDoubleArrowUp, MdKeyboardArrowUp } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { formatDate } from "../utils/helper";

const Card = ({ setOpenAddEditModal }) => {
  const [openMenuId, setOpenMenuId] = useState(false);
  const { tasks, setTasks } = useTasksContext();
  const priorityStyles = {
    High: {
      textStyle: "text-red-500",
      icon: <MdKeyboardDoubleArrowUp />,
    },
    Medium: {
      textStyle: "text-amber-400",
      icon: <MdKeyboardArrowUp />,
    },
    Low: {
      textStyle: "text-blue-500",
      icon: "",
    },
  };

  const statusStyles = {
    Pending: "text-fuchsia-500",
    InProgress: "text-blue-500",
    OnHold: "text-red-500",
    Completed: "text-green-500",
  };

  const handleEditDelete = async (name, task) => {
    const taskId = task.id;
    if (name === "Delete") {
      await api.delete(`/tasks/${taskId}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      toast.success("Task deleted!");
    }

    if (name === "Edit") {
      setOpenAddEditModal({
        isShown: true,
        type: "edit",
        task: task,
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenuId && !event.target.closest(".task-menu")) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [openMenuId]);

  return (
    <div className=" grid grid-cols-4 gap-2 pb-2 mx-4 my-3">
      {tasks.map((task) => {
        const priorityStyle = priorityStyles[task.priority] || {
          icon: null,
        };
        const statusStyle = statusStyles[task.status] || null;

        const date = formatDate(task.dueDate).slice(0, 10);
        const time = formatDate(task.dueDate).slice(11, 16);
        return (
          <Link
            to={`/tasks/${task.id}`}
            key={task.id}
            className="flex flex-col max-w-sm h-60 p-6 bg-white border border-gray-200
            rounded-lg shadow-smhover:bg-gray-100 dark:bg-gray-800
            dark:border-gray-700 dark:hover:bg-gray-700"
            onClick={(e) => {
              if (openMenuId) {
                e.preventDefault();
                setOpenMenuId(null);
              }
            }}
          >
            <div className="flex flex-row justify-between text-sm">
              <p
                className={`flex font-semibold items-center ${priorityStyle.textStyle}`}
              >
                {priorityStyle.icon}
                <span className="">{task.priority} Priority</span>
              </p>

              <div className="relative">
                <button
                  key={`${task.id}-menuOption`}
                  className="p-2 hover:cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setOpenMenuId(task.id);
                  }}
                >
                  <HiDotsHorizontal className="text-lg opacity-70" />
                </button>

                {openMenuId === task.id && (
                  <ul
                    className="absolute right-0 mt-2 w-34 bg-white shadow-lg rounded-lg task-menu"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <li
                      className="group flex flex-row items-center justify-start px-4 py-2
                       m-2 hover:cursor-pointer rounded-sm hover:text-white hover:bg-blue-400"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setOpenMenuId(null);
                        handleEditDelete("Edit", task);
                      }}
                    >
                      <CiEdit className="text-xl h-4 w-4 mr-4 group-hover:text-white" />
                      <span className="group-hover:text-white">Edit</span>
                    </li>

                    <li
                      className="group flex flex-row text-sm items-center justify-start px-4 py-2
                       m-2 hover:cursor-pointer rounded-sm hover:bg-blue-400"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setOpenMenuId(null);
                        handleEditDelete("Delete", task);
                      }}
                    >
                      <FaRegTrashCan className="h-4 w-4 mr-4 text-red-500 opacity-80 group-hover:opacity-100" />
                      <span className="group-hover:text-white">Delete</span>
                    </li>
                  </ul>
                )}
              </div>
            </div>

            <div className="flex flex-row mr-auto">
              <GoDotFill className={`flex text-3xl -ml-2 ${statusStyle}`} />

              <h5 className="line-clamp-2 mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                {task.title}
              </h5>
            </div>

            {task.dueDate ? (
              <div className="flex flex-row justify-between text-gray-400 text-sm">
                <h5>{date}</h5>
                <h5>{time}</h5>
              </div>
            ) : (
              <p></p>
            )}

            <p className="break-words w-full h-fit border-t-2 border-gray-200 line-clamp-4 font-normal text-gray-700 dark:text-gray-400">
              {task.description}
            </p>
          </Link>
        );
      })}

      <button
        className="flex items-center justify-center max-w-sm h-60 p-6 text-gray-500 font-medium border-3 border-gray-400 border-dashed
        hover:cursor-pointer opacity-70 hover:opacity-100
            rounded-lg "
        onClick={() =>
          setOpenAddEditModal({ isShown: true, type: "add", task: null })
        }
      >
        Add New Task
      </button>
    </div>
  );
};

export default Card;

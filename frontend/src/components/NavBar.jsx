import React, { useEffect, useState } from "react";
import { useUserContext } from "../context/userContext";
import { FaCircleUser } from "react-icons/fa6";
import Modal from "react-modal";
import UserInfoModal from "../modals/UserInfoModal";
import { useTasksContext } from "../context/tasksContext";
import { Link } from "react-router-dom";
import { FcLike } from "react-icons/fc";
const NavBar = ({ onAddTask }) => {
  const [isUserInfoModalOpen, setIsUserInfoModalOpen] = useState(false);
  const [inProgressTask, setInProgressTask] = useState(null);
  const { user } = useUserContext();
  const { tasks } = useTasksContext();

  const handleUserInfo = () => {
    setIsUserInfoModalOpen(true);
  };

  useEffect(() => {
    const count = tasks.filter((task) => task.status === "InProgress").length;
    setInProgressTask(count);
  }, [tasks]);

  return (
    <>
      <div className="flex flex-1 h-full px-4 items-center">
        <Link to="/" className="w-[5%] h-full flex items-center justify-start">
          <img
            src="/logo.png"
            alt="logo image"
            className="rounded-full h-[80%] aspect-square"
          />
        </Link>

        <div className="flex flex-1 justify-between items-start pl-3">
          <div>
            <b>
              <p className="flex flex-row gap-2">
                <FcLike className="text-xl" />
                Welcome to MyTask, {user.fullName}!
              </p>
            </b>
            <div className="flex">
              You have&nbsp;
              <span className="text-green-400">{inProgressTask}</span>
              &nbsp;active task
            </div>
          </div>

          <button
            onClick={onAddTask}
            className="bg-primary hover:bg-primary-hover hover:cursor-pointer text-white px-6 py-2.5 rounded-full transition duration-100 ml-auto"
          >
            Add New Task
          </button>
        </div>
        <div className="flex w-[20vw] justify-end">
          <button
            onClick={handleUserInfo}
            className="hover:cursor-pointer ml-auto text-violet-600 text-4xl"
          >
            <FaCircleUser />
          </button>
        </div>
      </div>
      <Modal
        shouldCloseOnOverlayClick={true}
        onRequestClose={() => setIsUserInfoModalOpen(false)}
        isOpen={isUserInfoModalOpen}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        className="rounded-md mt-14"
        overlayClassName="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      >
        <UserInfoModal
          isOpen={isUserInfoModalOpen}
          onClose={() => setIsUserInfoModalOpen(false)}
        />
      </Modal>
    </>
  );
};

export default NavBar;

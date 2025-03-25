import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { GoDotFill } from "react-icons/go";
import { IoMdAdd, IoIosRemoveCircle } from "react-icons/io";
import { AiOutlineUserAdd } from "react-icons/ai";
import {
  MdOutlineComment,
  MdKeyboardDoubleArrowUp,
  MdKeyboardArrowUp,
} from "react-icons/md";
import CommentModal from "../modals/CommentModal";
import AddUserModal from "../modals/AddUserModal";
import Modal from "react-modal";
import { CiEdit } from "react-icons/ci";
import { HiMenuAlt2 } from "react-icons/hi";
import api from "../api/api";
import { toast } from "react-toastify";
import { useActivateButtonContext } from "../context/activateButtonContext";
import { getInitials } from "../utils/helper";
import { useUserContext } from "../context/userContext";
import { useTasksContext } from "../context/tasksContext";
import { usePriorityStatusContext } from "../context/priorityStatusContext";

const Task = ({ setOpenAddEditModal }) => {
  const taskId = useParams().taskId;
  const { user } = useUserContext();
  const { setStatus, setPriority } = usePriorityStatusContext();
  const { tasks, setTasks } = useTasksContext();
  const { setStatusActivate } = useActivateButtonContext();
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [task, setTask] = useState({});
  const [userEmail, setUserEmail] = useState("");
  const [role, setRole] = useState("member");

  const emailTest = user?.email;
  const listOfMembers = task?.Users ?? [];

  // Check if user is the owner of current task
  const isOwner = listOfMembers.filter((member) => {
    if (member.email === emailTest && member.UserTask.role === "owner")
      return true;
    return false;
  });

  const handleAddUser = async () => {
    try {
      await api.post(`tasks/${taskId}/users`, {
        role: `${role}`,
        email: `${userEmail}`,
      });
      const taskResponse = await api.get(`tasks/${taskId}`);
      setTask(taskResponse.data);
      setIsAddUserModalOpen(false);
      toast.success("User added to task");
    } catch (error) {
      setIsAddUserModalOpen(false);
      toast.error("Add user failed");
      console.log("Error add user: ", error);
    }
  };

  const removeUser = async (userId) => {
    try {
      await api.delete(`tasks/${taskId}/users/${userId}`);

      const taskResponse = await api.get(`tasks/${taskId}`);
      setTask(taskResponse.data);

      toast.success("Remove user success");
    } catch (error) {
      console.log(error);
      toast.error("Remove user failed.");
    }
  };

  const handleAddComment = async () => {
    try {
      const response = await api.post(`tasks/${taskId}/comments`, {
        content: content,
      });

      setComments((prevComments) => [...prevComments, response.data]);
      setContent("");
      toast.success("Comment created!");
    } catch (error) {
      toast.error("Create comment failed!");
    }
  };

  useEffect(() => {
    const initial = async () => {
      setStatusActivate("");
      setStatus("All");
      setPriority("All");
      // Get all comment of the task
      const commentsResponse = await api.get(`tasks/${taskId}/comments`);
      setComments(commentsResponse.data);

      // Get detail of task
      const taskDetailResponse = await api.get(`tasks/${taskId}`);
      setTask(taskDetailResponse.data);
    };

    initial();
  }, [tasks]);

  useEffect(() => {
    const initial = async () => {
      try {
        const response = await api.get(`/tasks/priority/All/status/All`);
        setTasks(response.data.tasks || []);
      } catch (error) {
        console.error("Error", error);
        setTasks([]);
      }
    };
    initial();
  }, []);
  const priorityStyles = {
    High: {
      bg: "bg-red-300 text-red-800",
      icon: <MdKeyboardDoubleArrowUp />,
    },
    Medium: {
      bg: "bg-yellow-300 text-yellow-800",
      icon: <MdKeyboardArrowUp />,
    },
    Low: {
      bg: "bg-blue-300 text-blue-800",
      icon: "",
    },
  };

  const statusStyles = {
    Pending: "text-fuchsia-500",
    InProgress: "text-yellow-500",
    OnHold: "text-red-500",
    Completed: "text-green-500",
  };
  const statusStyle = statusStyles[task.status] || null;

  const priorityStyle = priorityStyles[task.priority] || { bg: "", icon: null };

  return (
    <div className="flex flex-col h-[98%]">
      <div className="items-center mx-5 my-2 text-2xl">
        <h1>{task.title}</h1>
      </div>

      <div className="flex-1 grid grid-cols-2 mx-5">
        {/* Task detail part */}
        <div className="flex flex-col  pl-7 pt-6 bg-white gap-3 overflow-y-auto rounded-l-3xl">
          <div className="flex flex-row">
            <p
              className={`flex rounded-full px-5 py-1 items-center ${priorityStyle.bg}`}
            >
              {priorityStyle.icon}
              <span className="ml-2">{task.priority} Priority</span>
            </p>

            <p className="flex items-center">
              <GoDotFill className={`text-3xl ${statusStyle}`} />
              {task.status}
            </p>

            {isOwner.length > 0 ? (
              <button
                className="text-3xl ml-auto hover:cursor-pointer hover:text-blue-600"
                onClick={() => {
                  setOpenAddEditModal({
                    isShown: true,
                    type: "edit",
                    task: task,
                  });
                }}
              >
                <CiEdit />
              </button>
            ) : (
              ""
            )}
          </div>

          <div>
            <p className="flex flex-row gap-2 text-xl items-center">
              <HiMenuAlt2 />
              Description
            </p>
            <p className="w-full break-words pl-8"> {task.description}</p>
          </div>

          <div className="flex flex-row justify-between">
            {task.expriration ? (
              <p className="text-gray-500">Due date: : Fri Feb 09 2024</p>
            ) : (
              <p></p>
            )}
          </div>

          <div className="flex-1">
            <div className="flex flex-row justify-between items-center">
              <h1 className="text-gray-500">TASK TEAM</h1>
              {isOwner.length > 0 ? (
                <AiOutlineUserAdd
                  onClick={() => setIsAddUserModalOpen(true)}
                  className="text-2xl hover:text-blue-400 hover:cursor-pointer"
                />
              ) : (
                ""
              )}
            </div>
            <ul>
              {listOfMembers ? (
                listOfMembers.map((member, index) => (
                  <li
                    key={index}
                    className="flex flex-row my-4 pt-2 items-center border-t-2 border-gray-200"
                  >
                    <span className="text-white mr-3 h-[90%] px-2.5 py-2 bg-blue-400 rounded-full text-lg">
                      {getInitials(`${member.firstName} ${member.lastName}`)}
                    </span>
                    <div>
                      <p className="font-bold">
                        {member.firstName} {member.lastName} (@{member.userName}
                        )
                      </p>
                      <p className="text-gray-500">{member.UserTask.role}</p>
                    </div>

                    {isOwner.length > 0 && member.email !== emailTest ? (
                      <IoIosRemoveCircle
                        onClick={() => removeUser(member.id)}
                        className="text-4xl ml-auto hover:cursor-pointer hover:text-red-500"
                      />
                    ) : (
                      ""
                    )}
                  </li>
                ))
              ) : (
                <h1>There no member</h1>
              )}
            </ul>
          </div>
        </div>

        {/* Task comment part */}
        <div className="flex flex-1 flex-col bg-white p-7 gap-3 rounded-r-3xl">
          <h1 className="text-2xl">Comment</h1>
          {/* Div contain comments */}
          <div className="flex flex-col gap-8 h-[60vh] overflow-y-auto scrollbar-thumb-red-500 scrollbar scrollbar-thin">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="flex flex-row">
                  <div className="w-fit h-fit items-center p-2.5 rounded-full text-white bg-blue-500 text-2xl">
                    <MdOutlineComment />
                  </div>
                  <div className="pl-2">
                    <p className="font-semibold text-lg">
                      {comment.User.firstName} {comment.User.lastName}
                    </p>
                    <p className="text-gray-500">{comment.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <h1>No comments created</h1>
            )}
          </div>

          <div className="flex justify-end z-10">
            <button
              className="rounded-full w-fit p-3 bg-blue-500 text-white hover:bg-blue-600 text-3xl hover:cursor-pointer"
              onClick={() => setIsCommentModalOpen(true)}
            >
              <IoMdAdd />
            </button>
          </div>
        </div>
      </div>

      {/* Comment Modal */}
      <Modal
        shouldCloseOnOverlayClick={true}
        onRequestClose={() => setIsCommentModalOpen(false)}
        isOpen={isCommentModalOpen}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        className="max-w-[30vw] max-h-[80vh] rounded-md mt-14"
        overlayClassName="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 "
      >
        <CommentModal
          isOpen={isCommentModalOpen}
          setContent={setContent}
          content={content}
          onClose={() => setIsCommentModalOpen(false)}
          onSubmit={handleAddComment}
        />
      </Modal>

      {/* Add User Modal */}
      <Modal
        shouldCloseOnOverlayClick={true}
        onRequestClose={() => setIsAddUserModalOpen(false)}
        isOpen={isAddUserModalOpen}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        className="max-w-[30vw] max-h-[80vh] rounded-md mt-14"
        overlayClassName="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 "
      >
        <AddUserModal
          isOpen={isAddUserModalOpen}
          setUserEmail={setUserEmail}
          userEmail={userEmail}
          setRole={setRole}
          role={role}
          onClose={() => setIsAddUserModalOpen(false)}
          onSubmit={handleAddUser}
        />
      </Modal>
    </div>
  );
};

export default Task;

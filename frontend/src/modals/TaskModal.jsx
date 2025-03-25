import { MdClose } from "react-icons/md";
import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import api from "../api/api";
import { useTasksContext } from "../context/tasksContext";
import { toast } from "react-toastify";
import { usePriorityStatusContext } from "../context/priorityStatusContext";
import { validateDate } from "../utils/helper";

// Cấu hình cho react-modal
Modal.setAppElement("#root");

const TaskModal = ({ openAddEditModal, setOpenAddEditModal }) => {
  const { tasks, setTasks } = useTasksContext();
  const [error, setError] = useState(null);
  const [titleInput, setTitleInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const [priorityInput, setPriorityInput] = useState("Low");
  const [dueDateInput, setDueDateInput] = useState(null);
  const [statusInput, setStatusInput] = useState("Pending");
  const { status, priority } = usePriorityStatusContext();

  const onClose = () => {
    setOpenAddEditModal({ isShown: false, type: "add" });
  };

  // Cập nhật state khi mở modal để chỉnh sửa task
  useEffect(() => {
    if (openAddEditModal.type === "add") {
      setTitleInput("");
      setDescriptionInput("");
      setPriorityInput("Low");
      setDueDateInput("");
      setStatusInput("Pending");
    } else {
      setTitleInput(openAddEditModal.task.title);
      setDescriptionInput(openAddEditModal.task.description);
      setPriorityInput(openAddEditModal.task.priority);
      setDueDateInput(openAddEditModal.task.expiration);
      setStatusInput(openAddEditModal.task.status);
    }
  }, [openAddEditModal]);

  const handleSubmit = async (e) => {
    if (!titleInput) {
      setError("Please enter title!");
      return;
    }

    // Check if due date user pick is valid (before today) or not (after today)
    if (dueDateInput && !validateDate(dueDateInput)) {
      setError("Due date is not valid!");
      return;
    }

    e.preventDefault();
    const taskData = {
      title: titleInput,
      description: descriptionInput,
      status: statusInput,
      priority: priorityInput,
      expiration: dueDateInput ? new Date(dueDateInput).toISOString() : null,
    };

    try {
      if (openAddEditModal.type === "add") {
        const response = await api.post("/tasks", taskData);
        const createdTask = response.data;

        const taskAdd =
          (createdTask.status === status || status === "All") &&
          (createdTask.priority === priority || priority === "All")
            ? [...tasks, createdTask]
            : tasks;

        setTasks(taskAdd);
        toast.success("Task created!");
      } else {
        console.log("task data of edit: ", taskData);
        const response = await api.put(
          `/tasks/${openAddEditModal.task.id}`,
          taskData
        );
        const editedTask = response.data;
        console.log(editedTask, status, priority);

        setTasks((prevTasks) =>
          prevTasks
            // Update task edited in tasks
            .map((task) =>
              task.id === openAddEditModal.task.id ? editedTask : task
            )
            // Filter the task is not match with status and priority
            .filter(
              (task) =>
                task.id !== editedTask.id ||
                ((editedTask.status === status || status === "All") &&
                  (editedTask.priority === priority || priority === "All"))
            )
        );

        toast.success("Task edited!");
      }
    } catch (error) {
      console.log(error);
      toast.error(`${openAddEditModal.type} task failed!`);
    }

    setOpenAddEditModal({
      isShown: false,
      type: "add",
      task: null,
    });
    setError("");
  };

  return (
    <Modal
      shouldCloseOnOverlayClick={true}
      isOpen={openAddEditModal.isShown}
      onRequestClose={() =>
        setOpenAddEditModal({ isShown: false, type: "add" })
      }
      style={{
        overlay: {
          backgroundColor: "rgba(0,0,0,0.2)",
        },
      }}
      className="w-[30%] max-h-[80vh] bg-white rounded-md mx-auto mt-14 p-5"
      overlayClassName="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div className="relative pt-5">
        <button
          className="absolute top-0 right-0 w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-500"
          onClick={onClose}
        >
          <MdClose className=" text-xl" />
        </button>

        <div className="flex flex-col gap-2">
          <label className="input-label">Title</label>
          <input
            type="text"
            className="input-box2"
            placeholder="Title of the task"
            value={titleInput ? titleInput : ""}
            onChange={({ target }) => setTitleInput(target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="input-label">Description</label>
          <textarea
            rows="4"
            className="input-box2"
            placeholder="Description of the task"
            value={descriptionInput ? descriptionInput : ""}
            onChange={({ target }) => setDescriptionInput(target.value)}
          />
        </div>

        <label className="input-label">Priority Level</label>
        <select
          className="input-box2"
          value={priorityInput ? priorityInput : ""}
          onChange={(e) => setPriorityInput(e.target.value)}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <label className="input-label">Status</label>
        <select
          className="input-box2"
          value={statusInput ? statusInput : ""}
          onChange={(e) => setStatusInput(e.target.value)}
        >
          <option value="Pending">Pending</option>
          <option value="InProgress">InProgress</option>
          <option value="Completed">Completed</option>
          <option value="OnHold">OnHold</option>
        </select>

        <label className="input-label">Due Date</label>
        <input
          type="datetime-local"
          className="input-box2"
          value={dueDateInput ? dueDateInput : ""}
          onChange={(e) => setDueDateInput(e.target.value)}
        />

        {error && <p className="text-red-500 text-sx pt-4">{error}</p>}
        <button
          className="btn-primary-fullsize font-medium mt-5 p-3"
          onClick={handleSubmit}
        >
          {openAddEditModal.type === "add" ? "CREATE TASK" : "EDIT TASK"}
        </button>
      </div>
    </Modal>
  );
};

export default TaskModal;

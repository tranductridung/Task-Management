import React, { useState } from "react";
import { useUserContext } from "../context/userContext";
import api from "../api/api";
import { toast } from "react-toastify";

const UserInfoModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const { user, setUser } = useUserContext();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");

  const [fullNameInput, setFullNameInput] = useState(user.fullName);
  const [userNameInput, setUserNameInput] = useState(user.userName);

  const onChangePassword = async () => {
    if (!oldPassword) {
      setError("Please enter your old password");
      return;
    }

    if (!newPassword) {
      setError("Please enter your new password");
      return;
    }
    setError("");
    try {
      await api.post("/users/changePassword", {
        oldPassword: oldPassword,
        newPassword: newPassword,
      });
      toast.success("Change password success!");
    } catch (error) {
      console.log(error);
      toast.error("Change password failed!");
    }
  };

  const onSaveChange = async () => {
    if (!fullNameInput) {
      setError("Please enter your last name");
      return;
    }

    if (!userNameInput) {
      setError("Please enter your user name");
      return;
    }

    setError("");
    try {
      await api.put("/users", {
        fullName: fullNameInput,
        userName: userNameInput,
      });
      setUser({
        ...user,
        fullName: fullNameInput,
        userName: userNameInput,
      });
      toast.success("Update information success!");
    } catch (error) {
      console.log(error);
      toast.error("Update information failed!");
    }
  };

  return (
    <div className="flex-col rounded-xl bg-white inset-0 flex items-center justify-center h-[80%] w-[34vw]">
      <div className="rounded-t-xl w-[99%] h-20 bg-gray-300 m-1 "></div>

      <div className="h-full w-full bg-white p-6 rounded-lg shadow-lg items-center">
        <div className="flex flex-col justify-start pb-2">
          <h2 className="flex text-2xl font-bold">
            {user.fullName} {user.lastName} (@{user.userName})
          </h2>

          <h2 className="flex items-center text-lg text-gray-500">
            {user.email}
          </h2>
        </div>
        {/* Full name input */}
        <div className="border-t-2 border-gray-200 flex flex-row gap-2 py-3">
          <label
            htmlFor="fullName"
            className="mr-15 mb-2 text-sm font-medium text-gray-500 dark:text-white"
          >
            Full name
          </label>
          <input
            value={fullNameInput || ""}
            type="text"
            id="fullName"
            className="flex flex-1 h-fit py-2 px-3 bg-gray-50 border border-gray-300
             text-gray-900 text-sm rounded-lg focus:ring-blue-500
              focus:border-blue-500  dark:bg-gray-700
               dark:border-gray-600 dark:placeholder-gray-400 
               dark:text-white dark:focus:ring-blue-500 
               dark:focus:border-blue-500"
            onChange={(e) => setFullNameInput(e.target.value)}
            placeholder="Full Name"
            required
          />
        </div>

        {/* Username input */}
        <div className="border-t-2 border-gray-200 flex flex-row gap-2 py-3">
          <label
            htmlFor="userName"
            className="mr-15 mb-2 text-sm font-medium text-gray-500 dark:text-white"
          >
            Username
          </label>
          <input
            value={userNameInput || ""}
            type="text"
            id="userName"
            className="p-2 flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={(e) => setUserNameInput(e.target.value)}
            placeholder="Username"
            required
          />
        </div>

        {/* Change password input */}
        <div className="border-t-2 border-gray-200 grid grid-cols-2 py-2 gap-x-3 gap-y-1">
          <div>
            <label
              htmlFor="email"
              className="mr-15 mb-2 text-sm font-medium text-gray-500 dark:text-white"
            >
              Old Password
            </label>
            <input
              value={oldPassword}
              type="password"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Old Password"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mr-15 mb-2 text-sm font-medium text-gray-500 dark:text-white"
            >
              New Password
            </label>
            <input
              value={newPassword}
              type="password"
              id="newPassword"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              required
            />
          </div>
        </div>

        {/* Error notification */}
        {error && <p className="text-red-500 text-sx pb-1">{error}</p>}

        <div className="flex justify-end mt-2 border-b-2 border-gray-200 pb-2 w-full">
          <button className="btn-secondary" onClick={onChangePassword}>
            Change Password
          </button>
        </div>

        <div className="mt-4 flex flex-rpw justify-end space-x-2">
          <button
            className="border border-gray-400 p-2.5 rounded-lg my-1.5 hover:bg-gray-200 hover:cursor-pointer"
            onClick={onClose}
          >
            Cancel
          </button>
          <button className="btn-primary" onClick={onSaveChange}>
            Save Change
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserInfoModal;

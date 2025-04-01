import React from "react";
import { MdClose } from "react-icons/md";
const AddUserModal = ({
  isOpen,
  onClose,
  onSubmit,
  userEmail,
  setUserEmail,
  role,
  setRole,
}) => {
  if (!isOpen) return null;

  return (
    <div className="relative inset-0 flex items-center justify-center">
      <div className=" bg-white p-6 max-w-84 rounded-lg shadow-lg">
        <div className="flex flex-row justify-end align-middle items-center">
          <button
            className="hover:cursor-pointer rounded-full flex items-center justify-center hover:bg-slate-500 text-2xl"
            onClick={onClose}
          >
            <MdClose />
          </button>
        </div>

        <label className="input-label">Email</label>
        <input
          className="input-box2"
          rows="4"
          placeholder="Enter email of user..."
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
        />

        <label className="input-label">Role</label>
        <select
          className="input-box2"
          value={role ? role : ""}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="Member">Member</option>
          <option value="Owner">Owner</option>
        </select>

        <div className="mt-4 flex justify-end space-x-2">
          <button
            className="btn-primary-fullsize font-medium mt-5 p-3"
            onClick={onSubmit}
          >
            Add User
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;

import React from "react";
import { MdClose } from "react-icons/md";
const CommentModal = ({ isOpen, onClose, onSubmit, content, setContent }) => {
  if (!isOpen) return null;

  return (
    <div className="relative inset-0 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <div className="flex flex-row justify-between py-2 align-middle items-center">
          <h2 className="flex items-center text-xl font-bold">Add a Comment</h2>

          <button
            className="p-2 hover:cursor-pointer rounded-full flex items-center justify-center hover:bg-slate-500 text-2xl"
            onClick={onClose}
          >
            <MdClose />
          </button>
        </div>

        <textarea
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="4"
          placeholder="Write your comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="mt-4 flex justify-end space-x-2">
          <button
            className="btn-primary font-medium mt-5 p-3"
            onClick={onSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;

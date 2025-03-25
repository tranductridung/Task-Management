import React from "react";
import Card from "./Card";
import Tab from "./Tab";
import { useLocation } from "react-router-dom";
import Task from "../components/Task";

const MainLayout = ({ setOpenAddEditModal }) => {
  const location = useLocation();
  return (
    <div className="flex flex-col flex-1 h-full bg-[#EDEDED] rounded-3xl overflow-auto">
      {location.pathname === "/" ? (
        <>
          <div className="flex justify-end items-center p-3 bg-[#EDEDED] sticky top-0 z-10">
            <Tab></Tab>
          </div>

          <div className="flex-1">
            <Card setOpenAddEditModal={setOpenAddEditModal}></Card>
          </div>
        </>
      ) : (
        <div className="flex-1">
          <Task setOpenAddEditModal={setOpenAddEditModal}></Task>
        </div>
      )}
    </div>
  );
};

export default MainLayout;

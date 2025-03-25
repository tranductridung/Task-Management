import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "../components/SideBar";
import MainLayout from "../components/MainLayout";
import InsightPanel from "../components/InsightPanel";
import { useUserContext } from "../context/userContext";
import { checkAuth } from "../api/auth";
import NavBar from "../components/NavBar";
import Modal from "react-modal";
import TaskModal from "../modals/TaskModal";
import { ActivateButtonProvider } from "../context/activateButtonContext";

Modal.setAppElement("#root");

const Home = () => {
  const { setUser } = useUserContext();
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    task: null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        await checkAuth(setUser);
      } catch (error) {
        console.error("User not authenticated", error);
        navigate("/login");
      }
    };

    verifyUser();
  }, [navigate]);

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100">
      <div className="fixed top-0 left-0 right-0 h-[12vh] z-50 flex items-center pb-5">
        <NavBar
          onAddTask={() =>
            setOpenAddEditModal({ isShown: true, type: "add", task: null })
          }
        />
      </div>

      <div className="flex flex-1 pt-[10vh]">
        <ActivateButtonProvider>
          <div className="flex fixed left-0 w-[5vw] h-[90vh]">
            <SideBar />
          </div>

          <div className="flex flex-1 rounded-4xl ml-[5vw] mr-[20vw] h-[90vh] overflow-auto ">
            <MainLayout setOpenAddEditModal={setOpenAddEditModal} />
          </div>
        </ActivateButtonProvider>

        <div className="flex fixed right-0 top-[10vh] w-[20vw] h-[90vh] pl-[10px]">
          <InsightPanel />
        </div>
      </div>

      <TaskModal
        openAddEditModal={openAddEditModal}
        setOpenAddEditModal={setOpenAddEditModal}
      />
    </div>
  );
};

export default Home;

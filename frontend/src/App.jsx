import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const App = () => {
  const routes = (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/tasks/:taskId" element={<Home />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
      </Routes>
    </Router>
  );

  return <div>{routes}</div>;
};

export default App;

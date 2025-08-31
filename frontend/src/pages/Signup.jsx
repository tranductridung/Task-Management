import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../components/PasswordInput";
import { validateEmail } from "../utils/helper";
import axios from "axios";
import { toast } from "react-toastify";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setfullName] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Email Invalid!");
      return;
    }

    if (!username) {
      setError("Please enter the username");
      return;
    }

    if (!fullName) {
      setError("Please enter the last name");
      return;
    }

    setError("");

    // Signup API call
    await axios
      .post(`${backendUrl}/api/users/register`, {
        email: email,
        password: password,
        userName: username,
        fullName: fullName,
      })
      .then(() => {
        toast.success("Register success!");
        navigate("/login");
      })
      .catch((err) => {
        console.log("Sign up error", err.response.data.data.message);
      });
  };

  return (
    <>
      <div className="bg-gradient-to-r to-purple-100 flex justify-center items-center h-screen w-screen">
        <div className="h-fit w-fit max-w-[30%] bg-white p-8 rounded-lg shadow-lg">
          <form onSubmit={handleSignup}>
            <h4 className="flex justify-center text-2xl mb-7">Signup</h4>
            <input
              type="text"
              placeholder="Email"
              className="input-box border-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="text"
              placeholder="Username"
              className="input-box border-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              type="text"
              placeholder="Full Name"
              className="input-box border-input"
              value={fullName}
              onChange={(e) => setfullName(e.target.value)}
            />
            <PasswordInput
              value={password}
              onChange={(e) => {
                e.preventDefault();
                setPassword(e.target.value);
              }}
            />

            {error && <p className="text-red-500 text-sx pb-1">{error}</p>}

            <button
              type="submit"
              className="w-full text-lg bg-primary hover:bg-primary-hover text-white p-2.5 rounded-lg my-1.5 hover:cursor-pointer"
            >
              Signup
            </button>

            <p className="text-lg text-center mt-4">
              Already have an account? {""}
              <Link to="/login" className="font-normal text-primary underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;

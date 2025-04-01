import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../components/PasswordInput";
import { validateEmail } from "../utils/helper";
import axios from "axios";
import { useUserContext } from "../context/userContext";
import { checkAuth } from "../api/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { setUser } = useUserContext();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        await checkAuth(setUser);
        navigate("/");
      } catch (error) {
        console.log("Error: ", error);
      }
    };

    checkLogin();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Email Invalid!");
      return;
    }

    if (!password) {
      setError("Please enter the password!");
      return;
    }

    setError("");

    await axios
      .post(
        "http://localhost:3000/api/users/login",
        {
          email: email,
          password: password,
        },
        { withCredentials: true }
      )
      .then((response) => {
        const accessToken = response.data.data.accessToken;
        localStorage.setItem("accessToken", accessToken);

        setUser({
          id: response.data.data.User.id,
          userName: response.data.data.User.userName,
          fullName: response.data.data.User.fullName,
          email: response.data.data.User.email,
        });
        navigate("/");
      })
      .catch((err) => {
        setError(err);
      });
  };

  return (
    <>
      <div className="bg-gradient-to-r to-purple-100 flex justify-center items-center h-screen w-screen">
        <div className="h-fit w-fit bg-white p-8 rounded-lg shadow-lg">
          <form onSubmit={handleLogin}>
            <h4 className="flex justify-center text-3xl mb-7">Login</h4>

            <input
              type="text"
              placeholder="Email"
              className="input-box border-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="text-red-500 text-sx pb-1">{error}</p>}

            <button
              type="submit"
              className="w-full text-lg bg-primary hover:bg-primary-hover text-white p-2.5 rounded-lg my-1.5 hover:cursor-pointer"
            >
              Login
            </button>

            <p className="text-lg text-center mt-4">
              Not registered yet? {""}
              <Link to="/signup" className="font-normal text-primary underline">
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;

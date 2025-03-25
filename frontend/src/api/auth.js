import api from "./api";

export const register = async (userData) => {
  const response = await api.post("/register", userData);
  return response.data;
};

export const refreshAccessToken = async () => {
  const response = await api.post("/refreshToken");
  return response.data;
};

export const logout = async (setUser) => {
  sessionStorage.removeItem("accessToken");
  setUser(null);
  window.location.href = "/login";
};

export const checkAuth = async (setUser) => {
  const response = await api.get("http://localhost:3000/api/users/verifyToken");
  console.log(response);
  setUser({
    id: response.data.id,
    userName: response.data.userName,
    firstName: response.data.firstName,
    email: response.data.email,
    lastName: response.data.lastName,
  });
};

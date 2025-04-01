import api from "./api";

export const register = async (userData) => {
  const response = await api.post("/register", userData);
  return response.data;
};

export const refreshAccessToken = async () => {
  const response = await api.post("/refresh");
  return response.data;
};

export const logout = async (setUser) => {
  sessionStorage.removeItem("accessToken");
  setUser(null);
  window.location.href = "/login";
};

export const checkAuth = async (setUser) => {
  const response = await api.get("users/verify");
  if (response.data.data)
    setUser({
      id: response.data.data.User.id,
      userName: response.data.data.User.userName,
      email: response.data.data.User.email,
      fullName: response.data.data.User.fullName,
    });
};

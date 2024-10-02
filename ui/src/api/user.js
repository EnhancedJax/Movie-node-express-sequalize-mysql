import { api } from "./index";

export const registerUser = (email, password) => {
  return api.post("/users/register", { email, password });
};

export const loginUser = (email, password) => {
  return api.post("/users/login", { email, password });
};

export const getUserProfile = () => {
  return api.get("/users/profile");
};

export const updateUserEmail = (email) => {
  return api.put("/users/update-email", { email });
};

export const updateUserPassword = (oldPassword, newPassword) => {
  return api.put("/users/update-password", { oldPassword, newPassword });
};

export default {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserEmail,
  updateUserPassword,
};

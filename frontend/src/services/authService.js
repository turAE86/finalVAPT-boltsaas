import api from "./api";

export const signup = (data) => {
  return api.post("/api/auth/signup", data);
};

export const login = (data) => {
  return api.post("/api/auth/login", data);
};

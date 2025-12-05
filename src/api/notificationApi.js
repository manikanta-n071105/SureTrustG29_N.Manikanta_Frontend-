import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000", 
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getAllNotifications = async () => {
  return await API.get("/api/notification/getNotifications");
};

export const markAsChecked = async (id) => {
  return await API.put(`/api/notification/mark/${id}`, {});
};

export const markAllAsChecked = async () => {
  return await API.put(`/api/notification/markAll`, {});
};

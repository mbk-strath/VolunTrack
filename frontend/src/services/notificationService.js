import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api"; // replace with your backend URL

// Create an axios instance with default headers
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add a request interceptor to attach token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API calls

export const getMyNotifications = async () => {
  const res = await api.get("/my-notifications");
  return res.data;
};

export const getUnreadNotifications = async () => {
  const res = await api.get("/unread-notifications");
  return res.data;
};

export const markAsRead = async (id) => {
  const res = await api.put(`/mark-as-read/${id}`);
  return res.data;
};

export const sendNotification = async (data) => {
  const res = await api.post("/send-notification", data);
  return res.data;
};

import axios from "axios";

const api = axios.create({
    baseURL: "https://altitude-hr.vercel.app/api",
    withCredentials: true,
});

export default api;
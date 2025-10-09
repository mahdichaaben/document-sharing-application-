// src/axiosConfig.js
import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL;
// Set default configurations for axios
axios.defaults.withCredentials = true;
axios.defaults.baseURL = API_URL; // Adjust to your backend URL if necessary

export default axios;

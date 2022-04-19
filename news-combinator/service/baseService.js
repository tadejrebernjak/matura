import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/",
  timeout: 50000,
  headers: {},
});

// Add a request interceptor
api.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    const token = localStorage.getItem("token");

    config.headers.Authorization = "Bearer " + token;

    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

export default api;

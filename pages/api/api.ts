import axios from "axios";

let baseURL = "http://localhost:3213";

const apiConnection = axios.create({ baseURL });

apiConnection.interceptors.request.use((req) => {
  if (typeof window !== "undefined") {
    if (window.localStorage) {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        req.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return req;
  }
});

apiConnection.interceptors.response.use(undefined, (error) => {
  // Errors handling
  const status = error?.response?.status;
  if (status === 401) {
    // logout();
  }
  return Promise.reject(error);
});

const originalRequest = axios.request;
axios.request = function (config) {
  if (typeof config !== 'object') {
    console.error('Axios config inválido:', config);
  }
  return originalRequest.call(this, config);
};

export default apiConnection;

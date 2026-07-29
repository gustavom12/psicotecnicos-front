import axios from "axios";

let baseURL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3213";

const apiConnection = axios.create({ baseURL });

// Páginas del portal de entrevistados (no confundir /survey/[id] con /surveys/*,
// que son las pantallas del profesional).
const INTERVIEWEE_PATHS = /^\/(interviewee|survey)(\/|$)/;

/**
 * Ambos portales pueden tener sesión abierta en el mismo navegador, y el
 * backend rechaza un token de profesional en las rutas de entrevistado
 * (y viceversa), así que el token se elige según el contexto del pedido.
 */
const resolveToken = (url?: string): string | null => {
  const professionalToken = localStorage.getItem("accessToken");
  const intervieweeToken = localStorage.getItem("intervieweeAccessToken");

  const isIntervieweeRequest =
    url?.startsWith("/interviewee-auth") ||
    INTERVIEWEE_PATHS.test(window.location.pathname);

  return isIntervieweeRequest
    ? intervieweeToken || professionalToken
    : professionalToken || intervieweeToken;
};

apiConnection.interceptors.request.use((req) => {
  if (typeof window === "undefined" || !window.localStorage) return req;

  const token = resolveToken(req.url);
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
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
  if (typeof config !== "object") {
    console.error("Axios config inválido:", config);
  }
  return originalRequest.call(this, config);
};

export default apiConnection;

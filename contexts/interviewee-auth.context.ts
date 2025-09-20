import { create } from "zustand";
import apiConnection from "@/pages/api/api";
import { Notification } from "@/common/notification";
import Router from "next/router";

interface IntervieweeProfile {
  _id: string;
  email: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    phone?: string;
    position?: string;
    department?: string;
    location?: string;
  };
  companyName?: string;
  status: 'PENDING' | 'INVITED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED';
  profileImage?: string;
}

interface IntervieweeAuthState {
  authenticated: boolean;
  interviewee: IntervieweeProfile | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  getProfile: () => Promise<void>;
}

export const useIntervieweeAuthContext = create<IntervieweeAuthState>((set, get) => {
  // Check authentication on initialization
  const checkInitialAuth = async () => {
    const token = localStorage.getItem("intervieweeAccessToken");
    if (token) {
      try {
        const { data } = await apiConnection.get("/interviewee-auth/check");
        set({
          authenticated: true,
          interviewee: data.interviewee,
        });
      } catch (error) {
        // Token is invalid, remove it
        localStorage.removeItem("intervieweeAccessToken");
        set({
          authenticated: false,
          interviewee: null,
        });
      }
    }
  };

  // Initialize authentication check
  checkInitialAuth();

  return {
    authenticated: false,
    interviewee: null,

    login: async (email: string, password: string) => {
      try {
        const { data } = await apiConnection.post("/interviewee-auth/login", {
          email,
          password,
        });

        const accessToken = data.token;
        localStorage.setItem("intervieweeAccessToken", accessToken);

        // Update API connection to use the interviewee token
        apiConnection.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

        set({
          authenticated: true,
          interviewee: data.interviewee
        });

        Notification("Has iniciado sesión exitosamente", "success");

        // Redirect to interviewee home
        Router.push("/interviewee");
      } catch (error: any) {
        console.log({ error: error?.response?.data });
        const errorMessage = error?.response?.data?.message ||
                            error?.response?.data?.errorMessage ||
                            "Error al iniciar sesión";
        Notification(errorMessage, "error");
        throw error;
      }
    },

    logout: () => {
      localStorage.removeItem("intervieweeAccessToken");
      delete apiConnection.defaults.headers.common['Authorization'];

      set({
        authenticated: false,
        interviewee: null
      });

      Notification("Sesión cerrada exitosamente", "success");
      Router.push("/interviewee/login");
    },

    checkAuth: async () => {
      try {
        const token = localStorage.getItem("intervieweeAccessToken");
        if (!token) {
          throw new Error("No token found");
        }

        // Set token in API connection if not already set
        if (!apiConnection.defaults.headers.common['Authorization']) {
          apiConnection.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }

        const { data } = await apiConnection.get("/interviewee-auth/check");

        set({
          authenticated: true,
          interviewee: data.interviewee,
        });
      } catch (error) {
        // Token is invalid or expired
        localStorage.removeItem("intervieweeAccessToken");
        delete apiConnection.defaults.headers.common['Authorization'];

        set({
          authenticated: false,
          interviewee: null,
        });

        // Redirect to login if not already there
        if (Router.pathname !== "/interviewee/login") {
          Router.push("/interviewee/login");
        }
      }
    },

    changePassword: async (currentPassword: string, newPassword: string) => {
      try {
        const { data } = await apiConnection.patch("/interviewee-auth/change-password", {
          currentPassword,
          newPassword,
        });

        if (data?.message) {
          Notification(data.message, "success");
        }
        return true;
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message ||
                            error?.response?.data?.errorMessage ||
                            "Error al cambiar contraseña";
        Notification(errorMessage, "error");
        return false;
      }
    },

    getProfile: async () => {
      try {
        const { data } = await apiConnection.get("/interviewee-auth/profile");

        set({
          interviewee: data,
        });
      } catch (error: any) {
        console.error("Error getting profile:", error);
        const errorMessage = error?.response?.data?.message ||
                            error?.response?.data?.errorMessage ||
                            "Error al obtener perfil";
        Notification(errorMessage, "error");
      }
    },
  };
});

// Utility function to setup axios interceptor for interviewee auth
export const setupIntervieweeAuthInterceptor = () => {
  // Request interceptor to add token
  apiConnection.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("intervieweeAccessToken");
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor to handle token expiration
  apiConnection.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem("intervieweeAccessToken");
        delete apiConnection.defaults.headers.common['Authorization'];

        const { logout } = useIntervieweeAuthContext.getState();
        logout();
      }
      return Promise.reject(error);
    }
  );
};


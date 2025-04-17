import { create } from "zustand";
import apiConnection from "@/pages/api/api";
import { Notification } from "@/common/notification";

interface AuthState {
  authorized: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  roles: string[];
  resetPassword: (email: string) => Promise<boolean>;
  changePassword: (password: string, token: string) => Promise<boolean>;
  changeUsername: (password: string) => Promise<boolean>;
}

export const useAuthContext = create<AuthState>((set) => {
  return {
    authorized: false,
    roles: [],
    login: async (usernameOrEmail: string, password: string) => {
      try {
        const { data } = await apiConnection.post("/auth/login", {
          user: usernameOrEmail,
          password,
        });
        const accessToken = data.data.accessToken;
        localStorage.setItem("accessToken", accessToken);

        set({ authorized: true, roles: data.data.roles });
      } catch (error: any) {
        console.log({ error: error?.response?.data?.errorMessage });
        Notification(error?.response?.data?.errorMessage, "error");
      }
    },
    resetPassword: async (email: string) => {
      try {
        const { data } = await apiConnection.post("/auth/reset-password", {
          email,
        });
        return !!data;
      } catch (error: any) {
        Notification(error?.response?.data?.errorMessage, "error");
        return false;
      }
    },
    changePassword: async (password: string, token: string) => {
      try {
        localStorage.setItem("accessToken", token);

        const { data } = await apiConnection.patch(
          "/users/profile/change-password/",
          {
            password,
          },
        );
        if (data) {
          Notification("Contraseña actualizada con éxito", "success");
          localStorage.removeItem("accessToken");
          return true;
        }
        return false;
      } catch (error: any) {
        console.log({ error });
        Notification(error?.response?.data?.errorMessage, "error");
        return false;
      }
    },
    changeUsername: async (email: string) => {
      try {
        const { data } = await apiConnection.patch("/auth/remember-username", {
          email,
        });
        return true;
      } catch (error: any) {
        console.log({ error });
        Notification(error?.response?.data?.errorMessage, "error");
        return false;
      }
    },
  };
});

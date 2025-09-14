import { create } from "zustand";
import apiConnection from "@/pages/api/api";
import { Notification } from "@/common/notification";
import Router from "next/router";

interface AuthState {
  authorized: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  logout: () => void;
  roles: string[];
  resetPassword: (email: string) => Promise<boolean>;
  changePassword: (password: string, token: string) => Promise<boolean>;
  changeUsername: (password: string) => Promise<boolean>;
  user;
}

export const useAuthContext = create<AuthState>((set) => {
  apiConnection
    .get("users/self")
    .then(({ data }) => {
      set({
        authorized: true,
        roles: data.roles,
        user: data,
      });
    })
    .catch((error) => {
      // TODO: REACTIVAR
      // Router.push("/auth/login");
      console.log("Error: ", error);
    });
  return {
    authorized: false,
    roles: [],
    user: {},
    login: async (usernameOrEmail: string, password: string) => {
      try {
        const { data } = await apiConnection.post("/auth/login", {
          email: usernameOrEmail,
          password,
        });
        const accessToken = data.token;
        localStorage.setItem("accessToken", accessToken);

        set({ authorized: true, roles: data.user.roles, user: data.user });
        Notification("Haz iniciado sesión éxitosamente", "success");
        // Pushea al inicio
        Router.push("/home");
      } catch (error: any) {
        console.log({ error: error?.response?.data });
        const errorMessage = error?.response?.data?.message || error?.response?.data?.errorMessage || "Error al iniciar sesión";
        Notification(errorMessage, "error");
      }
    },
    resetPassword: async (email: string) => {
      try {
        const { data } = await apiConnection.post("/auth/reset-password", {
          email,
        });
        if (data?.message) {
          Notification(data.message, "success");
        }
        return true;
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.response?.data?.errorMessage || "Error al restablecer contraseña";
        Notification(errorMessage, "error");
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
        const errorMessage = error?.response?.data?.message || error?.response?.data?.errorMessage || "Error al cambiar contraseña";
        Notification(errorMessage, "error");
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
        const errorMessage = error?.response?.data?.message || error?.response?.data?.errorMessage || "Error al cambiar nombre de usuario";
        Notification(errorMessage, "error");
        return false;
      }
    },
    logout: () => {
      localStorage.removeItem("accessToken");
      set({ authorized: false, roles: [], user: {} });
      Notification("Sesión cerrada exitosamente", "success");
      Router.push("/auth/login");
    },
  };
});

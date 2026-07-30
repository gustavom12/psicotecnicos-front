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
  updateUserProfile: (userData: any) => Promise<boolean>;
  user;
}

// Pantallas que no son del portal del profesional. Este store se evalúa al
// importarse (Next ejecuta el módulo de una página incluso al prefetchearla),
// así que sin este filtro el bootstrap se lleva puesta, por ejemplo, la sesión
// del entrevistado que está entrando con su magic link.
const NON_PROFESSIONAL_PATHS = /^\/(interviewee|survey|auth|invitation)(\/|$)/;

const bootstrapSession = (set: (state: Partial<AuthState>) => void) => {
  const redirectToLogin = () => {
    if (NON_PROFESSIONAL_PATHS.test(window.location.pathname)) return;
    // Este módulo puede evaluarse antes de que Next cree el router, así que la
    // navegación se posterga al próximo tick.
    setTimeout(() => Router.push("/auth/login"), 0);
  };

  if (!localStorage.getItem("accessToken")) {
    redirectToLogin();
    return;
  }

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
      localStorage.removeItem("accessToken");
      console.log("Error: ", error);
      redirectToLogin();
    });
};

export const useAuthContext = create<AuthState>((set) => {
  if (typeof window !== "undefined") {
    bootstrapSession(set);
  }
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
        if (typeof window !== "undefined") Router.push("/home");
      } catch (error: any) {
        console.log({ error: error?.response?.data });
        const errorMessage =
          error?.response?.data?.message ||
          error?.response?.data?.errorMessage ||
          "Error al iniciar sesión";
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
        const errorMessage =
          error?.response?.data?.message ||
          error?.response?.data?.errorMessage ||
          "Error al restablecer contraseña";
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
        const errorMessage =
          error?.response?.data?.message ||
          error?.response?.data?.errorMessage ||
          "Error al cambiar contraseña";
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
        const errorMessage =
          error?.response?.data?.message ||
          error?.response?.data?.errorMessage ||
          "Error al cambiar nombre de usuario";
        Notification(errorMessage, "error");
        return false;
      }
    },
    updateUserProfile: async (userData: any) => {
      try {
        const { data } = await apiConnection.patch("/users/profile", userData);

        // Actualizar el usuario en el estado
        set((state) => ({
          ...state,
          user: { ...state.user, ...data },
        }));

        Notification("Perfil actualizado exitosamente", "success");
        return true;
      } catch (error: any) {
        console.log({ error });
        const errorMessage =
          error?.response?.data?.message ||
          error?.response?.data?.errorMessage ||
          "Error al actualizar perfil";
        Notification(errorMessage, "error");
        return false;
      }
    },
    logout: () => {
      localStorage.removeItem("accessToken");
      set({ authorized: false, roles: [], user: {} });
      Notification("Sesión cerrada exitosamente", "success");
      if (typeof window !== "undefined") Router.push("/auth/login");
    },
  };
});

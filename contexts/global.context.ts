import { create } from "zustand";
import apiConnection from "@/pages/api/api";
import { Notification } from "@/common/notification";

interface GlobalState {
  user: any;
}

export const useAuthContext = create<GlobalState>((set) => {
  return {
    user: {},
  };
});

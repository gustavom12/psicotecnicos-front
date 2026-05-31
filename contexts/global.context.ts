import { create } from "zustand";

interface GlobalState {
  user: any;
}

export const useAuthContext = create<GlobalState>((set) => {
  return {
    user: {},
  };
});

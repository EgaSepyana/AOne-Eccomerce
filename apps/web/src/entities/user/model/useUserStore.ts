import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Address } from "@/entities/order";
import type { User } from "./types";

interface UserStoreState {
  user: User | null;
  addresses: Address[];
  login: (email: string) => void;
  logout: () => void;
  addAddress: (address: Address) => void;
}

export const useUserStore = create<UserStoreState>()(
  persist(
    (set) => ({
      user: null,
      addresses: [],
      login: (email) =>
        set({
          user: { id: crypto.randomUUID(), name: email.split("@")[0]!, email },
        }),
      logout: () => set({ user: null }),
      addAddress: (address) =>
        set((state) => ({ addresses: [...state.addresses, address] })),
    }),
    { name: "aone-user" },
  ),
);

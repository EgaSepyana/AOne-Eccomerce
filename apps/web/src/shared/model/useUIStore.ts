import { create } from "zustand";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastItem {
  id: string;
  message: string;
  action?: ToastAction;
}

interface UIState {
  cartDrawerOpen: boolean;
  searchOpen: boolean;
  menuOpen: boolean;
  quickViewId: string | null;
  toasts: ToastItem[];
  setCartDrawerOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setMenuOpen: (open: boolean) => void;
  setQuickViewId: (id: string | null) => void;
  showToast: (message: string, action?: ToastAction) => void;
  dismissToast: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  cartDrawerOpen: false,
  searchOpen: false,
  menuOpen: false,
  quickViewId: null,
  toasts: [],
  setCartDrawerOpen: (open) => set({ cartDrawerOpen: open }),
  setSearchOpen: (open) => set({ searchOpen: open }),
  setMenuOpen: (open) => set({ menuOpen: open }),
  setQuickViewId: (id) => set({ quickViewId: id }),
  showToast: (message, action) =>
    set((state) => ({
      toasts: [...state.toasts, { id: crypto.randomUUID(), message, action }],
    })),
  dismissToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

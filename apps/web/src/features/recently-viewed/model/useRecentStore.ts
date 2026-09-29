import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX_RECENTLY_VIEWED = 12;
const MAX_RECENT_SEARCHES = 5;

interface RecentState {
  recentlyViewed: string[];
  recentSearches: string[];
  addRecentlyViewed: (productId: string) => void;
  addRecentSearch: (query: string) => void;
  removeRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
}

export const useRecentStore = create<RecentState>()(
  persist(
    (set) => ({
      recentlyViewed: [],
      recentSearches: [],
      addRecentlyViewed: (productId) =>
        set((state) => ({
          recentlyViewed: [
            productId,
            ...state.recentlyViewed.filter((id) => id !== productId),
          ].slice(0, MAX_RECENTLY_VIEWED),
        })),
      addRecentSearch: (query) =>
        set((state) => ({
          recentSearches: [
            query,
            ...state.recentSearches.filter((q) => q !== query),
          ].slice(0, MAX_RECENT_SEARCHES),
        })),
      removeRecentSearch: (query) =>
        set((state) => ({
          recentSearches: state.recentSearches.filter((q) => q !== query),
        })),
      clearRecentSearches: () => set({ recentSearches: [] }),
    }),
    { name: "aone-recent" },
  ),
);

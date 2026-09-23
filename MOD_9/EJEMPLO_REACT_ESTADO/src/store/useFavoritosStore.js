import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useFavoritosStore = create(
  persist(
    (set) => ({
      favoritos: [],
      toggle: (id) =>
        set((s) => ({
          favoritos: s.favoritos.includes(id)
            ? s.favoritos.filter((f) => f !== id)
            : [...s.favoritos, id],
        })),
      clear: () => set({ favoritos: [] }),
    }),
    { name: 'm9_favoritos' },
  ),
)

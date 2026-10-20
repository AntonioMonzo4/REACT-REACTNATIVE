import { create } from 'zustand';

export type Producto = {
  id: string;
  nombre: string;
  precio: number;
  categoria: 'herramientas' | 'accesorios';
};

type FavoritosState = {
  favoritos: Producto[];
  alternar: (producto: Producto) => void;
  esFavorito: (id: string) => boolean;
};

/**
 * Store global mínimo con Zustand (Unidad 04 — Estado en React Native).
 * En producción, aquí se añadiría persistencia con AsyncStorage.
 */
export const useFavoritosStore = create<FavoritosState>((set, get) => ({
  favoritos: [],
  alternar: (producto) =>
    set((state) => ({
      favoritos: state.favoritos.some((f) => f.id === producto.id)
        ? state.favoritos.filter((f) => f.id !== producto.id)
        : [...state.favoritos, producto],
    })),
  esFavorito: (id) => get().favoritos.some((f) => f.id === id),
}));

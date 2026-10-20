# Unidad 04 — Estado en React Native (Context, Zustand, persistencia)
> 🧭 **Navegación:** [← Anterior: Unidad 03 — Navegación: Stack y Drawer (expo-router)](Unidad_03_Navegacion_Stack_Drawer.md) · [Índice del tema](../README.md) · [Siguiente: Unidad 05 — APIs del dispositivo: cámara, GPS, archivos, notificaciones, permisos →](Unidad_05_APIs_dispositivo.md)

## Objetivos

Al terminar esta unidad podrás:

- Aplicar los mismos patrones de estado que en React web dentro de React Native.
- Usar **Context API** para tema, idioma o sesión en una app móvil.
- Integrar **Zustand** (o Redux Toolkit) en una app Expo con TypeScript.
- Persistir estado en el dispositivo con **AsyncStorage**.
- Saber cuándo NO hace falta estado global en móvil (ventajas de mantenerlo local).

## Requisitos

- [Unidad 01](Unidad_01_ReactNative_Expo.md) y nociones de la práctica de `MiAplicacion/` (que ya usa Context para el tema).
- M9 del roadmap (Gestión de Estado): Context, Redux Toolkit, Zustand y Jotai vistos en web. Aquí solo se repite lo específico de móvil.
- La app de práctica tiene un store de Zustand en `src/store/favoritos.ts` (añadido en esta revisión del módulo).

## La buena noticia: el estado es el mismo React

React Native **no inventa un modelo de estado nuevo**. `useState`, `useReducer`,
Context, stores externos (Zustand, Redux, Jotai), custom hooks… todo funciona
igual que en el navegador. Lo único que cambia es el **almacenamiento persistente**:
en web usarías `localStorage`/`cookies`; en móvil, AsyncStorage (o SecureStore
para secretos).

| Necesidad | Web | Móvil (Expo) |
|-----------|-----|--------------|
| Estado temporal de pantalla | `useState` | `useState` |
| Estado compartido ligero | Context | Context |
| Estado global con acciones | Redux / Zustand / Jotai | **Los mismos** |
| Persistir preferencias | `localStorage` | `@react-native-async-storage/async-storage` |
| Guardar tokens/secretos | cookie httpOnly / sessionStorage | `expo-secure-store` |

## Context API en móvil

Ya lo usa la app de práctica: `src/hooks/use-theme.ts` expone el tema actual y
`src/constants/theme.ts` define los colores. El patrón es idéntico al de M6:
`createContext` + Provider + hook consumidor. No hay nada "nativo" que añadir.

Un caso de uso clásico móvil: **sesión de usuario** (token + datos del perfil)
compartida entre pantallas de login, perfil y ajustes.

## Zustand en Expo

Zustand es la opción más cómoda para estado global en React Native: pocas
líneas, sin Providers, funciona fuera del árbol de React (útil en listeners
nativos) y se persiste fácil. La app de práctica lo usa en
`src/store/favoritos.ts`:

```tsx
// src/store/favoritos.ts
import { create } from 'zustand';

export type Producto = { id: string; nombre: string; precio: number };

type FavoritosState = {
  favoritos: Producto[];
  alternar: (producto: Producto) => void;
  esFavorito: (id: string) => boolean;
};

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
```

Uso desde cualquier pantalla:

```tsx
import { Pressable, Text } from 'react-native';
import { useFavoritosStore } from '@/store/favoritos';

export function BotonFavorito({ producto }: { producto: Producto }) {
  const esFav = useFavoritosStore((s) => s.esFavorito(producto.id));
  const alternar = useFavoritosStore((s) => s.alternar);

  return (
    <Pressable onPress={() => alternar(producto)}>
      <Text>{esFav ? '★' : '☆'}</Text>
    </Pressable>
  );
}
```

En el listado (`src/app/listas.tsx`) se lee el store con el selector
`useFavoritosStore((s) => s.favoritos)` para pintar la estrella en cada fila.

> **Regla de oro (igual que en web):** selecciona solo lo que la pantalla
> necesita (`(s) => s.favoritos`), no el store entero. Así evitas re-renders
> innecesarios en listas grandes — algo que en móvil se nota mucho más en los
> FPS.

### Redux Toolkit también funciona

Si tu equipo ya usa RTK (M9), el `configureStore` + slices es 100% compatible
con React Native: no hay `localStorage` de por medio, solo cambia la persistencia
(usa `redux-persist` con el adaptador AsyncStorage, o hazlo a mano con
`subscribe`). Para apps nuevas desde cero, Zustand suele ser más ligero de
adoptar.

## Persistencia: AsyncStorage

`@react-native-async-storage/async-storage` es un key-value store asíncrono del
dispositivo (equivalente móvil a `localStorage`). Instálalo con:

```bash
npx expo install @react-native-async-storage/async-storage
```

API básica:

```tsx
import AsyncStorage from '@react-native-async-storage/async-storage';

// Guardar
await AsyncStorage.setItem('bienvenida-vista', 'true');

// Leer
const visto = await AsyncStorage.getItem('bienvenida-vista');

// Borrar
await AsyncStorage.removeItem('bienvenida-vista');

// Guardar objeto serializado
await AsyncStorage.setItem('carrito', JSON.stringify(items));
const carrito = JSON.parse((await AsyncStorage.getItem('carrito')) ?? '[]');
```

### Persistir un store de Zustand

El middleware oficial `persist` de Zustand necesita un adaptador "async". El
patrón habitual (sin dependencias extra) es un wrapper manual:

```tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

const CLAVE = 'ajustes-tema';

type Ajustes = { modoOscuro: boolean; setModoOscuro: (v: boolean) => void };

export const useAjustesStore = create<Ajustes>((set) => ({
  modoOscuro: false,
  setModoOscuro: (modoOscuro) => {
    void AsyncStorage.setItem(CLAVE, JSON.stringify({ modoOscuro }));
    set({ modoOscuro });
  },
}));

// Al arrancar la app (por ejemplo en el _layout raíz):
useAjustesStore.getState().setModoOscuro(
  JSON.parse((await AsyncStorage.getItem(CLAVE)) ?? '{"modoOscuro":false}').modoOscuro,
);
```

Para un setup más elaborado existe `zustand/middleware` `persist` con
`createJSONStorage(() => AsyncStorage)`; la idea es la misma: hidratar al
arrancar, escribir en cada cambio.

### ¿Y los tokens y contraseñas?

**No** guardes secretos en AsyncStorage: es legible con acceso root/jailbreak.
Para tokens JWT cortos o credenciales usa `expo-secure-store` (Keychain en iOS,
Keystore en Android):

```bash
npx expo install expo-secure-store
```

```tsx
import * as SecureStore from 'expo-secure-store';

await SecureStore.setItemAsync('token', token);
const token = await SecureStore.getItemAsync('token');
await SecureStore.deleteItemAsync('token');
```

## Cuándo NO usar estado global

En móvil, el apretón de manos es el mismo que en web (y se nota más en
batería/rendimiento):

1. ¿Solo una pantalla lo usa? → `useState`/`useReducer` local.
2. ¿Un par de pantallas hermanas? → Estado "subido" al layout común o Context pequeño.
3. ¿Muchas pantallas no relacionadas, datos del servidor, caché? → Zustand/RTK o **TanStack Query** (M25 del roadmap).
4. ¿Datos del servidor? → No los pegues en un store global si Query puede cachearlos y revalidarlos.

## Errores comunes

| Error típico | Causa | Solución |
|--------------|-------|----------|
| El estado "se reinicia" al cerrar la app | Era solo `useState`, sin persistencia | Persiste en AsyncStorage/SecureStore lo que deba sobrevivir al cierre |
| Parpadeo de tema claro al arrancar | Se pinta la UI antes de hidratar el tema guardado | Oculta el splash (`SplashScreen.preventAutoHideAsync`) hasta leer el storage |
| La lista no se actualiza al añadir favorito | El selector devuelve el store entero o una referencia nueva siempre | Selecciona estado concreto y usa acciones estables del store |
| AsyncStorage devuelve `null` donde esperabas un objeto | Aún no hay valor guardado o falló la escritura | Normaliza con `?? valorPorDefecto` y envuelve en try/catch |
| Guardar el token en AsyncStorage | El storage no está cifrado | Usa `expo-secure-store` para secretos |

## Conceptos clave

| Término | Qué significa en humano |
|---------|-------------------------|
| **AsyncStorage** | Key-value store asíncrono del dispositivo; heredero espiritual de `localStorage` |
| **SecureStore** | Almacén cifrado (Keychain/Keystore) para tokens y secretos |
| **Zustand** | Store global minimalista; mismo API en web y móvil |
| **Hidratar** | Leer el storage guardado al arrancar y volcarlo al estado en memoria |
| **Selector** | Función `(state) => slice` para suscribirse solo a lo necesario |
| **Persistencia** | Sobrevivir al cierre de la app; no confundir con el estado en RAM |

## Autoevaluación

**1. Mi app de notas debe conservar las notas al cerrar y reabrir. ¿Qué combo uso?**

<details>
<summary>Respuesta</summary>

Estado en memoria con Zustand (o Context/`useReducer`) + persistencia en
AsyncStorage: guardar en cada mutación (o con el middleware `persist`) y
hidratar al arrancar antes de mostrar la lista. No hace falta backend para esto.

</details>

**2. ¿Dónde guardo el JWT del login?**

<details>
<summary>Respuesta</summary>

En `expo-secure-store` (Keychain/Keystore), nunca en AsyncStorage ni en un
arch plano. SecureStore está pensado para datos sensibles y se bloquea con el
biométrico/clave del dispositivo si lo configuras.

</details>

**3. Tengo dos pantallas que leen el mismo contador global de Zustand. ¿Cuál es el error de rendimiento más típico?**

<details>
<summary>Respuesta</summary>

Suscribirse al store entero (`useStore()`) en vez de al trozo concreto
(`useStore((s) => s.contador)`). Con el selector, solo las pantallas que usan
ese trozo se re-renderizan cuando cambia.

</details>

**4. ¿Context y Zustand no hacen lo mismo? ¿Por qué el módulo enseña los dos?**

<details>
<summary>Respuesta</summary>

Context sirve para compartir valores (tema, idioma, dependencias) sin lógica de
acciones compleja, pero cada cambio re-renderiza a todos los consumidores y
requiere un Provider. Zustand/RTK añaden acciones, selectores, middleware
(persistencia) y evitan re-renders innecesarios: mejor para estado de negocio
global (carrito, sesión, favoritos). El repo usa Context para el tema de la app
y Zustand para favoritos, que cambian más a menudo.

</details>

**5. ¿Qué pasa si AsyncStorage.getItem lanza o devuelve null?**

<details>
<summary>Respuesta</summary>

`getItem` devuelve `null` si la clave no existe (no es un error). Falla (throw)
solo si el storage está lleno o inaccesible: envuélvelo en try/catch y define
siempre un valor por defecto (`?? []`, `?? false`…) para no pintar `undefined`
en la UI.

</details>

---

> 🧭 **Navegación:** [← Anterior: Unidad 03 — Navegación: Stack y Drawer (expo-router)](Unidad_03_Navegacion_Stack_Drawer.md) · [Índice del tema](../README.md) · [Siguiente: Unidad 05 — APIs del dispositivo: cámara, GPS, archivos, notificaciones, permisos →](Unidad_05_APIs_dispositivo.md)

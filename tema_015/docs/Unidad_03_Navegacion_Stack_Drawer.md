# Unidad 03 — Navegación: Stack y Drawer (expo-router)
> 🧭 **Navegación:** [← Anterior: Unidad 02 — FlatList, SectionList e Image](Unidad_02_Listas_FlatList_SectionList.md) · [Índice del tema](../README.md) · [Siguiente: Unidad 04 — Estado en React Native (Context, Zustand, persistencia) →](Unidad_04_Estado_en_React_Native.md)

## Objetivos

Al terminar esta unidad podrás:

- Entender el modelo de rutas por archivos de **expo-router** (herencia de Next.js).
- Crear un navegador **Stack** (pantallas apiladas con botón "atrás").
- Crear un navegador **Drawer** (menú lateral deslizable).
- Anidar navegadores (Stack dentro de Tabs, Drawer como raíz, etc.).
- Pasar parámetros entre pantallas y leerlos con `useLocalSearchParams`.
- Navegar programáticamente con `router.push`, `replace` y `back`.

## Requisitos

- [Unidad 01](Unidad_01_ReactNative_Expo.md) completada.
- La app de práctica `ReactNative/MiAplicacion/` usa **NativeTabs** como raíz; esta unidad explica cómo añadir un Stack por encima (la práctica del módulo lo hace en `src/app/_layout.tsx`).
- Saber qué es un "enrutador" en React web (equivalente a react-router, visto en M7).

## El modelo: archivos = rutas

Expo Router mapea la carpeta `app/` (o `src/app/`) a rutas, igual que Next.js
App Router o react-router con `createBrowserRouter`. Cada archivo `tsx` es una
pantalla; los `_layout.tsx` definen **cómo se navega** entre las pantallas de su
carpeta (Stack, Tabs, Drawer…).

```
src/app/
├── _layout.tsx        → layout raíz (aquí el Stack general)
├── (tabs)/
│   ├── _layout.tsx    → layout de pestañas (NativeTabs)
│   ├── index.tsx      → /
│   └── explore.tsx    → /explore
├── listas.tsx         → /listas (pantalla apilada sobre las tabs)
└── detalle/
    └── [id].tsx       → /detalle/123 (ruta dinámica)
```

Paréntesis `(...)` son **grupos** (no afectan a la URL); corchetes `[...]` son
**rutas dinámicas**. El orden de apilamiento lo decide el Stack, no el alfabeto
de carpetas.

## Stack: la navegación por defecto en móvil

Un Stack es una pila de pantallas: empujas (`push`) una nueva encima y al volver
(`back`) se descarta. En iOS se desliza desde la derecha; en Android hay flecha
atrás. Es el patrón de detalle de WhatsApp, Instagram, ajustes de iOS, etc.

```tsx
// src/app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerStyle: { backgroundColor: '#fff' } }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="listas" options={{ title: 'Listas' }} />
      <Stack.Screen name="detalle/[id]" options={{ title: 'Detalle' }} />
    </Stack>
  );
}
```

- `headerShown: false` para el grupo de tabs (cada tab ya gestiona su propia UI).
- `title` cambia el texto de la cabecera nativa.
- Cualquier archivo nuevo en `app/` aparece en el Stack automáticamente aunque
  no lo declares con `Stack.Screen` (útil para desarrollo rápido).

### Navegar y pasar parámetros

```tsx
import { router, useLocalSearchParams } from 'expo-router';

// Empezar una pantalla nueva encima
router.push('/listas');

// Ruta dinámica
router.push(`/detalle/${id}`);
// o con objeto (recomendado con typedRoutes):
router.push({ pathname: '/detalle/[id]', params: { id: '42' } });

// Reemplazar la actual (sin poder volver atrás con un gesto)
router.replace('/login');

// Volver
router.back();
router.dismiss(); // cierra el stack más cercano
```

En la pantalla de destino, los parámetros se leen así:

```tsx
// src/app/detalle/[id].tsx
import { Stack, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

export default function Detalle() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View>
      <Stack.Screen options={{ title: `Detalle #${id}` }} />
      <Text>Estás viendo el elemento {id}</Text>
    </View>
  );
}
```

`useLocalSearchParams` devuelve **strings** (o arrays de strings si repites el
parámetro en la URL). Si necesitas un número, conviértelo: `Number(id)`.

## Drawer: el menú lateral

El Drawer es el clásico panel deslizable desde la izquierda (hamburger). En Expo
Router se usa con `expo-router/drawer`:

```bash
npx expo install expo-router/drawer react-native-gesture-handler react-native-reanimated
```

```tsx
// src/app/_layout.tsx
import { Drawer } from 'expo-router/drawer';

export default function RootLayout() {
  return (
    <Drawer>
      <Drawer.Screen name="index" options={{ title: 'Inicio' }} />
      <Drawer.Screen name="ajustes" options={{ title: 'Ajustes' }} />
      <Drawer.Screen name="perfil" options={{ title: 'Perfil' }} />
    </Drawer>
  );
}
```

El Drawer necesita **gesture-handler** y **reanimated** (ya incluidos en la
práctica del módulo). En web, el Drawer se convierte en un menú lateral fijo.

## Anidar navegadores

La potencia real de expo-router es combinar. Patrón muy común en apps reales:

```
app/
├── _layout.tsx          → <Stack>  (raíz: pantallas "modales" o detalle)
├── (tabs)/
│   ├── _layout.tsx      → <Tabs> o <NativeTabs>  (pestañas abajo)
│   ├── index.tsx
│   └── explore.tsx
├── login.tsx            → pantalla a pantalla completa (fuera de tabs)
└── detalle/[id].tsx     → detalle apilado sobre cualquier tab
```

- La **raíz** suele ser un Stack (o Drawer si el menú lateral es la navegación
  principal de la app).
- Dentro de la raíz, un grupo `(tabs)` con el tab bar.
- Pantallas "fuera" del grupo (login, detalle, ajustes globales) se apilan
  **por encima** de las tabs y las ocultan con su propia cabecera.

En la práctica de este módulo, `src/app/_layout.tsx` es el Stack raíz y
`src/app/(tabs)/_layout.tsx` contiene el `NativeTabs` que ya veías en la
Unidad 01.

## Comparativa rápida con react-router (web)

| Idea en react-router (M7) | Equivalente en expo-router |
|---------------------------|----------------------------|
| `<Routes>` + `<Route path>` | Archivos en `app/` |
| `<Outlet />` | `_layout.tsx` que renderiza el navigator |
| `useParams()` | `useLocalSearchParams()` |
| `useNavigate()` | `useRouter()` → `push`/`replace` |
| `<Link to>` | `<Link href>` de expo-router |
| Rutas protegidas con wrapper | `Stack.Protected` / redirects en `_layout` (docs de Expo) |
| Lazy routes | `export { default } from` con `lazy` en el layout |

## Errores comunes

| Error típico | Causa | Solución |
|--------------|-------|----------|
| `useRouter`/`router` no funciona | Se usa en un componente que no está dentro del árbol de expo-router | Asegúrate de que el archivo vive en `app/` y el layout raíz está bien |
| La pantalla nueva no tiene cabecera ni botón atrás | Se renderiza sin un Stack por encima (por ejemplo, suelta en un Navigator de tabs) | Colócala como hijo del Stack raíz, fuera del grupo `(tabs)` |
| `expo-router/drawer` falla al compilar | Faltan `react-native-gesture-handler` o `react-native-reanimated` | `npx expo install` de ambos y reinicia con cache limpia (`pnpm start -c`) |
| Parámetro llega `undefined` | El nombre en la ruta (`[id]`) no coincide con el `params` de `router.push` | Usa el objeto `{ pathname, params }` y revisa el typo |
| Al volver atrás se cierra la app entera | Se usó `replace` donde esperabas poder volver | Usa `push` para apilar; reserva `replace` para login → home |
| Rutas tipadas no existen | `typedRoutes: true` regenera tipos al detectar archivos nuevos | Reinicia Expo y revisa que `app.json` tiene `experiments.typedRoutes` |

## Conceptos clave

| Término | Qué significa en humano |
|---------|-------------------------|
| **expo-router** | Enrutador por archivos para Expo, estilo Next.js App Router |
| **Stack** | Pila de pantallas; push/back, cabecera nativa con botón atrás |
| **Drawer** | Menú lateral deslizable desde un borde de la pantalla |
| **Ruta dinámica** | Carpeta/archivo entre corchetes (`[id]`) que captura un segmento de la URL |
| **Grupo** | Carpeta entre paréntesis `(tabs)`: organiza sin cambiar la URL |
| **`router.push` / `replace` / `back`** | Empujar, reemplazar o volver en el historial de navegación |
| **`useLocalSearchParams`** | Hook para leer params de la ruta actual (siempre como string) |

## Autoevaluación

**1. Estoy en la pestaña "Explore" y quiero mostrar el detalle de un producto con botón atrás, sin perder el tab bar de abajo. ¿Qué hago?**

<details>
<summary>Respuesta</summary>

Depende del UX deseado:
- Si el detalle debe **tapar** las tabs (patrón Instagram): crea `app/detalle/[id].tsx` como pantalla hermana del grupo `(tabs)` en el Stack raíz; al `router.push`, el Stack la pone encima con su cabecera y botón atrás.
- Si el detalle debe vivir **dentro** de la tab: crea `(tabs)/detalle/[id].tsx` y da a esa tab un Stack propio (layout `(tabs)/explore/_layout.tsx` con `<Stack />`).

</details>

**2. ¿Qué diferencia hay entre `router.push` y `router.replace`?**

<details>
<summary>Respuesta</summary>

`push` añade la pantalla encima de la actual: el usuario puede volver atrás con
el botón/gesto. `replace` intercambia la pantalla actual por la nueva: no queda
en el historial (típico tras un login, para que "atrás" no lleve al formulario
ya superado).

</details>

**3. En `/detalle/42`, ¿qué tipo tiene `useLocalSearchParams().id`?**

<details>
<summary>Respuesta</summary>

`string` (o `string[]` si el parámetro se repite en la URL). Los params de URL
son texto plano: convierte a número tú si el detalle necesita hacer aritmética.

</details>

**4. ¿Qué dos librerías hacen falta para un Drawer con Expo?**

<details>
<summary>Respuesta</summary>

`react-native-gesture-handler` (gestos) y `react-native-reanimated` (animación
del panel), además del paquete `expo-router/drawer` que los orquesta.

</details>

**5. ¿Para qué sirve un grupo `(tabs)`?**

<details>
<summary>Respuesta</summary>

Para colocar varias pantallas bajo un mismo layout de pestañas **sin** añadir
un segmento a la URL: `/` y `/explore` siguen siendo rutas limpias, mientras
que `_layout.tsx` del grupo decide que se navegan con un tab bar.

</details>

---

> 🧭 **Navegación:** [← Anterior: Unidad 02 — FlatList, SectionList e Image](Unidad_02_Listas_FlatList_SectionList.md) · [Índice del tema](../README.md) · [Siguiente: Unidad 04 — Estado en React Native (Context, Zustand, persistencia) →](Unidad_04_Estado_en_React_Native.md)

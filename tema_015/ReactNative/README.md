# Módulo 16 — React Native (carpeta del ejemplo: `ReactNative/`)

> Alineado con el **Módulo 16** del roadmap (`README.md` de la raíz).
> El proyecto de ejemplo es `MiAplicacion/`, creada con Expo SDK 57.

## Cómo usar este material

1. Lee [`../docs/Unidad_01_ReactNative_Expo.md`](../docs/Unidad_01_ReactNative_Expo.md) → comandos de creación y ejecución.
2. Explora el código de `MiAplicacion/` → es una app Expo completa con
   Stack raíz, expo-router, tema claro/oscuro, animaciones, listas y estado global.
3. Consulta la tabla inferior para saber qué concepto demuestra cada archivo.
4. Las unidades 02–06 de `../docs/` profundizan en listas, navegación, estado,
   APIs del dispositivo y publicación con EAS.

```bash
cd MiAplicacion
pnpm install
pnpm start
```

## Qué demuestra esta plantilla

| Archivo | Concepto |
|---------|----------|
| `src/app/_layout.tsx` | **Stack raíz**, `ThemeProvider`, splash screen (Unidad 03) |
| `src/app/(tabs)/_layout.tsx` | Layout de pestañas: monta `AppTabs` dentro del Stack |
| `src/app/(tabs)/index.tsx` | Pantalla principal, `SafeAreaView`, `Platform.OS`, `StyleSheet` |
| `src/app/(tabs)/explore.tsx` | `ScrollView`, `useSafeAreaInsets`, `Platform.select`, `Pressable` |
| `src/app/listas.tsx` | **FlatList + SectionList**, cabecera, separadores, estado vacío (U02) |
| `src/app/detalle/[id].tsx` | **Ruta dinámica**, `useLocalSearchParams`, pantalla apilada (U03) |
| `src/store/favoritos.ts` | **Zustand**: store global de favoritos (U04) |
| `src/components/app-tabs.tsx` / `.web.tsx` | Bottom tabs nativos vs web (archivos por plataforma) |
| `src/components/themed-text.tsx` / `themed-view.tsx` | Componentes tematizados con props tipadas en TypeScript |
| `src/components/animated-icon.tsx` | Animaciones con react-native-reanimated (worklets) |
| `src/components/ui/collapsible.tsx` | `useState` + `Animated.View` (entrada `FadeIn`) |
| `src/components/external-link.tsx` | Abrir enlaces con `expo-web-browser` |
| `src/hooks/use-theme.ts` | Custom hook de tema (claro/oscuro) |
| `src/constants/theme.ts` | Paleta de colores, espaciado, `Platform.select` |

## Cómo recorrer la práctica

1. Arranca con `pnpm start` y abre en Expo Go (o `w` para web).
2. En **Home**, toca *"Abrir práctica Listas / Stack →"*.
3. En **Listas**: toca un producto → se apila `detalle/[id]` (Unidad 03);
   toca la estrella → alterna en el store de Zustand (Unidad 04); activa el
   switch para ver los mismos datos como `SectionList` (Unidad 02).
4. Vuelve atrás (botón nativo o gesto) y comprueba que las tabs siguen donde estaban.

## Temario del Módulo 16 — estado

### Cubierto por teoría + ejemplo

- [x] ¿Qué es React Native? / Expo (U01)
- [x] Diferencias con React (sin DOM, componentes nativos) (U01)
- [x] Estilos: Flexbox con `StyleSheet`, Safe Area (U01 + app)
- [x] React Native CLI (sin Expo) / `expo prebuild` (U01)
- [x] Navegación por pestañas (expo-router) (app)
- [x] FlatList, SectionList, Image (U02 + `listas.tsx`)
- [x] Navegación Stack y Drawer (U03 + Stack raíz + `detalle/[id].tsx`)
- [x] Estado: contexto de tema (U01/app) + Zustand (U04 + `store/favoritos.ts`)
- [x] APIs del dispositivo: cámara, GPS, archivos, notificaciones, permisos (U05)
- [x] Publicación: EAS Build, Submit, Update (U06)
- [x] TypeScript en React Native

### Proyecto final (roadmap, no material del módulo)

- [ ] Aplicación móvil completa — ver checklist del `README.md` raíz y `tema_022/`

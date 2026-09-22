# Módulo 16 — React Native (carpeta del ejemplo: `ReactNative/`)

> Alineado con el **Módulo 16** del roadmap (`README.md` de la raíz).
> El proyecto de ejemplo es `MiAplicacion/`, creada con Expo SDK 57.

## Cómo usar este material

1. Lee `doc.md` → comandos de creación y ejecución.
2. Explora el código de `MiAplicacion/` → es una app Expo completa con
   expo-router, tema claro/oscuro y animaciones.
3. Consulta la tabla inferior para saber qué concepto demuestra cada archivo.
4. Revisa el temario oficial del Módulo 16 en el README de la raíz para ver
   qué temas faltan por cubrir (están marcados en `GUIA_ESTUDIO.md`).

```bash
cd MiAplicacion
pnpm install
pnpm start
```

## Qué demuestra esta plantilla

| Archivo | Concepto |
|---------|----------|
| `src/app/_layout.tsx` | Layout raíz, `ThemeProvider`, splash screen |
| `src/app/index.tsx` | Pantalla principal, `SafeAreaView`, `Platform.OS`, `StyleSheet` |
| `src/app/explore.tsx` | `ScrollView`, `useSafeAreaInsets`, `Platform.select`, `Pressable` |
| `src/components/app-tabs.tsx` / `.web.tsx` | Bottom tabs nativos vs web (archivos por plataforma) |
| `src/components/themed-text.tsx` / `themed-view.tsx` | Componentes tematizados con props tipadas en TypeScript |
| `src/components/animated-icon.tsx` | Animaciones con react-native-reanimated (worklets) |
| `src/components/ui/collapsible.tsx` | `useState` + `Animated.View` (entrada `FadeIn`) |
| `src/components/external-link.tsx` | Abrir enlaces con `expo-web-browser` |
| `src/hooks/use-theme.ts` | Custom hook de tema (claro/oscuro) |
| `src/constants/theme.ts` | Paleta de colores, espaciado, `Platform.select` |

## Temario del Módulo 16 — estado

### Cubierto por el ejemplo

- [x] ¿Qué es React Native? / Expo
- [x] Diferencias con React (sin DOM, componentes nativos)
- [x] Estilos: Flexbox con `StyleSheet`, Safe Area
- [x] Navegación por pestañas (expo-router)
- [x] Estado: contexto de tema (claro/oscuro)
- [x] TypeScript en React Native

### Pendiente (ver GUIA_ESTUDIO.md)

- [ ] React Native CLI (sin Expo)
- [ ] Componentes: FlatList, SectionList, Image, ScrollView avanzado
- [ ] Navegación Stack y Drawer
- [ ] Estado con Redux
- [ ] APIs del dispositivo: cámara, GPS, archivos, notificaciones, permisos
- [ ] Proyecto: aplicación móvil completa

# Módulo 16 — React Native
> 🧭 **Navegación:** [← Anterior: tema_014 — Next.js y React Moderno](../tema_014/README.md) · [Índice del curso](../GUIA_ESTUDIO.md) · [Siguiente: tema_016 — Backend para Frontend →](../tema_016/README.md)

Material del **Módulo 16** del roadmap (React Native + Expo SDK 57), carpeta `tema_015`.
Antes en el repo como `MOD_5`, luego `MOD_14` y `MOD_16`.

> **Estado: completo en teoría y práctica introductoria.** Las 6 unidades cubren
> Expo, listas, navegación (Stack/Drawer), estado (Context/Zustand/persistencia),
> APIs del dispositivo y publicación con EAS. El proyecto grande ("app móvil
> completa") sigue siendo el ejercicio final del roadmap, no material del módulo.

## Para quién es este módulo

Este módulo es para ti si:

- **Ya sabes React en el navegador** (componentes, props, estado, hooks) y quieres
  llevar esa misma lógica a una app real de Android e iOS sin aprender Java/Kotlin
  ni Swift/Objective-C.
- **Nunca has tocado el desarrollo móvil** y quieres empezar por el camino más
  corto: Expo + Expo Go, escanear un QR y ver tu código en el teléfono en segundos.
- **Vienes del frontend web** del curso y buscas entender qué cambia al salir del
  DOM: sin `div`, sin CSS de verdad, con componentes nativos y Flexbox obligatorio.

No necesitas experiencia previa con Android Studio, Xcode, nativos ni tiendas de
aplicaciones: con Expo eso lo pone de obra. Si nunca has visto React, repasa antes
los módulos de fundamentos del roadmap.

## Contenido

### Teoría (`docs/`)

| Unidad | Tema |
|--------|------|
| [01 — React Native y Expo (SDK 57)](docs/Unidad_01_ReactNative_Expo.md) | Crear, ejecutar y compilar proyectos Expo; Expo vs RN CLI (`prebuild`) |
| [02 — FlatList, SectionList, Image](docs/Unidad_02_Listas_FlatList_SectionList.md) | Virtualización, keyExtractor, refresh, paginación, expo-image |
| [03 — Navegación Stack y Drawer](docs/Unidad_03_Navegacion_Stack_Drawer.md) | expo-router: Stack, Drawer, params, rutas dinámicas, anidado |
| [04 — Estado en React Native](docs/Unidad_04_Estado_en_React_Native.md) | Context, Zustand, AsyncStorage, SecureStore |
| [05 — APIs del dispositivo](docs/Unidad_05_APIs_dispositivo.md) | Cámara, GPS, archivos, notificaciones, permisos |
| [06 — Publicación con EAS](docs/Unidad_06_Publicacion_EAS.md) | EAS Build, Submit, Update (OTA), prebuild |

Cada unidad incluye: objetivos, requisitos, prosa para novatos, código, **Errores
comunes** con solución, **Conceptos clave** y **Autoevaluación** con respuestas
plegadas.

### Práctica (`ReactNative/`)

App Expo con expo-router (**Stack raíz + NativeTabs**), tema claro/oscuro,
animaciones, pantalla de **listas** (FlatList/SectionList), **detalle dinámico**
y **store de Zustand**:

- [`ReactNative/README.md`](ReactNative/README.md) — conceptos por archivo
- [`ReactNative/MiAplicacion/`](ReactNative/MiAplicacion/) — app completa

```bash
cd ReactNative/MiAplicacion
pnpm install
pnpm start     # Expo (QR para Expo Go)
```

## Cómo estudiar

Sigue estas 4 fases en orden; cada una depende de la anterior.

| Fase | Qué haces | Resultado esperado |
|------|-----------|--------------------|
| **1 — Fundamentos** | Lee la [Unidad 01](docs/Unidad_01_ReactNative_Expo.md) de principio a fin: qué es React Native, qué es Expo, Expo vs RN CLI. | Puedes explicar la diferencia entre React web y React Native, y cuándo usar `expo prebuild`. |
| **2 — Puesta en marcha** | Ejecuta el bloque `pnpm install` / `pnpm start` de arriba y escanea el QR con **Expo Go**. Prueba las teclas `a`, `i` y `w`. | Ves la app corriendo en tu móvil, en un emulador o en el navegador. |
| **3 — Explorar el código** | Con las Unidades 02–04 a la mano, abre la app: pantalla **Listas** (`src/app/listas.tsx`), **Detalle** (`src/app/detalle/[id].tsx`), store (`src/store/favoritos.ts`) y el Stack raíz (`src/app/_layout.tsx`). | Identificas qué archivo demuestra cada concepto de las unidades 02–04. |
| **4 — Practicar y repasar** | Haz la **Práctica mínima** de abajo, responde las autoevaluaciones y, si vas en serio con móvil, lee las Unidades 05–06 y crea tu propio proyecto con permisos y `eas build`. | Tienes cambiado algo de la app por tu cuenta y sabes el camino hasta publicar en una tienda. |

## Práctica mínima

Lo mínimo que deberías hacer antes de dar este módulo por visto:

1. Instalar dependencias y arrancar: `pnpm install` + `pnpm start` dentro de `ReactNative/MiAplicacion/`.
2. Escanear el QR con Expo Go y confirmar que la app se ve en el teléfono (o usar `w` para web si no tienes móvil a mano).
3. Abrir la pantalla **Listas** (botón en Home o `router.push('/listas')`): tocar un producto (detalle en Stack), alternar favoritos (Zustand) y activar el switch de SectionList.
4. Modificar un texto o un color en `src/app/listas.tsx`, guardar y ver el *hot reload*.
5. Responder las autoevaluaciones de las Unidades 01–04 sin mirar.

## Mapa con el README

- [x] ¿Qué es React Native? / Expo
- [x] Diferencias con React (sin DOM, componentes nativos)
- [x] Estilos: Flexbox con `StyleSheet`, Safe Area
- [x] Navegación por pestañas (expo-router)
- [x] Estado: contexto de tema
- [x] TypeScript en React Native
- [x] React Native CLI (sin Expo) — cobrado en U01 (`expo prebuild` / workflow bare)
- [x] FlatList, SectionList, Image — U02 + pantalla `listas.tsx`
- [x] Navegación Stack y Drawer — U03 + Stack raíz + `detalle/[id].tsx`
- [x] Estado con Redux — U04 (Zustand + contexto; Redux Toolkit compatible, ver U04)
- [x] APIs del dispositivo — U05 (cámara, GPS, archivos, notificaciones, permisos)
- [x] Publicación (EAS Build/Submit/Update) — U06
- [ ] Proyecto: app móvil completa — *proyecto final del roadmap (M23/portfolio), no material del módulo*

---

> 🧭 **Navegación:** [← Anterior: tema_014 — Next.js y React Moderno](../tema_014/README.md) · [Índice del curso](../GUIA_ESTUDIO.md) · [Siguiente: tema_016 — Backend para Frontend →](../tema_016/README.md)

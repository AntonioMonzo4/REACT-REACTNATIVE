# Módulo 16 — React Native 🟡 (parcial)

Material del **Módulo 16** del roadmap (React Native + Expo SDK 57).
Antes en el repo como `MOD_5` y luego `MOD_14`.

> **Estado: parcial 🟡.** La Unidad 01 y la app de práctica (`ReactNative/MiAplicacion/`)
> ya están listas y son utilizables tal cual; los temas marcados como *pendiente*
> en el checklist de abajo se irán añadiendo en futuras revisiones del módulo.
> Mientras tanto, estudia lo que sí está cubierto y no te preocupes por lo demás.

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
| [01 — React Native y Expo (SDK 57)](docs/Unidad_01_ReactNative_Expo.md) | Crear, ejecutar y compilar proyectos Expo |

### Práctica (`ReactNative/`)

App Expo con expo-router, tema claro/oscuro y animaciones:

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
| **1 — Fundamentos** | Lee la [Unidad 01](docs/Unidad_01_ReactNative_Expo.md) de principio a fin: qué es React Native, qué es Expo y por qué `expo-cli` ya no se usa. | Puedes explicar con tus palabras la diferencia entre React web y React Native, y entre Expo y React Native CLI. |
| **2 — Puesta en marcha** | Ejecuta el bloque `pnpm install` / `pnpm start` de arriba (o crea tu propio proyecto con `create-expo-app`) y escanea el QR con **Expo Go**. Prueba las teclas `a`, `i` y `w`. | Ves la app corriendo en tu móvil, en un emulador o en el navegador, y sabes lanzarla cada vez con un comando. |
| **3 — Explorar el código** | Abre `ReactNative/MiAplicacion/` y recorre la tabla de conceptos de [`ReactNative/README.md`](ReactNative/README.md) archivo por archivo: layout, pantallas, tema, animaciones. | Identificas en qué archivo vive cada concepto (Flexbox, `SafeAreaView`, expo-router, contexto de tema, reanimated). |
| **4 — Practicar y repasar** | Haz la **Práctica mínima** de abajo, responde la autoevaluación de la Unidad 01 y marca el checklist de la sección *Mapa con el README*. Consulta lo pendiente para saber qué viene. | Tienes cambiado algo de la app por tu cuenta y sabes exactamente qué temas faltan por cubrir en este módulo 🟡. |

## Práctica mínima

Lo mínimo que deberías hacer antes de dar este módulo por visto (aunque esté parcial):

1. Instalar dependencias y arrancar: `pnpm install` + `pnpm start` dentro de `ReactNative/MiAplicacion/`.
2. Escanear el QR con Expo Go y confirmar que la app se ve en el teléfono (o usar `w` para web si no tienes móvil a mano).
3. Modificar un texto visible (por ejemplo, el título de `src/app/index.tsx`), guardar y ver el *hot reload* reflejarlo al instante.
4. Cambiar el tema claro/oscuro o seguir el hilo de un archivo de la tabla de `ReactNative/README.md` hasta entenderlo.
5. Responder la autoevaluación de la [Unidad 01](docs/Unidad_01_ReactNative_Expo.md) sin mirar.

## Mapa con el README

- [x] ¿Qué es React Native? / Expo
- [x] Diferencias con React (sin DOM, componentes nativos)
- [x] Estilos: Flexbox con `StyleSheet`, Safe Area
- [x] Navegación por pestañas (expo-router)
- [x] Estado: contexto de tema
- [x] TypeScript en React Native
- [ ] React Native CLI (sin Expo) — *pendiente*
- [ ] FlatList, SectionList, Image — *pendiente*
- [ ] Navegación Stack y Drawer — *pendiente*
- [ ] Estado con Redux — *pendiente*
- [ ] APIs del dispositivo — *pendiente*
- [ ] Proyecto: app móvil completa — *pendiente*

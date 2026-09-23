# Unidad 01 — React Native y Expo (SDK 57)

## Objetivos

Al terminar esta unidad podrás:

- Explicar qué es React Native y en qué se diferencia de React en el navegador.
- Entender qué es Expo, qué es Expo Go y por qué el `expo-cli` antiguo ya no se usa.
- Crear un proyecto Expo nuevo con `create-expo-app`.
- Ejecutar el proyecto en el móvil (Expo Go), en emuladores, en el navegador y con ESLint.
- Localizar la documentación oficial del SDK 57 y de Expo Router para seguir por tu cuenta.

## Requisitos

- Node.js instalado y un gestor de paquetes: en los ejemplos usamos `pnpm`, pero `npx` funciona igual.
- Conocimientos mínimos de React: componentes, props, estado y hooks (`useState`, `useEffect`).
- Para probar en el móvil: la app **Expo Go** (Play Store / App Store) y el teléfono en la **misma red Wi-Fi** que tu ordenador.
- No hace falta Android Studio ni Xcode para seguir esta unidad: Expo se encarga del compilado.

## Qué es React Native (y qué no)

React Native es una forma de escribir **aplicaciones móviles** (Android e iOS) usando
React. La idea central es simple: **reutilizas tus conocimientos de React**, pero el
destino deja de ser el DOM del navegador y pasa a ser la interfaz nativa del sistema.

Los cambios respecto a React web que más vas a notar:

- **No hay HTML.** No existen `div`, `span`, `p` o `button` como etiquetas JSX.
  En su lugar usas componentes nativos: `View` (equivalente a un contenedor tipo
  `div`), `Text` (cualquier texto), `ScrollView`, `Image`, `Pressable`, etc.
- **No hay CSS de hojas de estilos.** Los estilos se escriben en JavaScript con
  `StyleSheet.create(...)`, en un objeto de propiedades muy parecido al CSS pero en
  camelCase (`backgroundColor` en vez de `background-color`).
- **El sistema de diseño por defecto es Flexbox**, en columna. En web a veces
  tienes que recordar poner Flexbox; en móvil casi siempre es el punto de partida.
- **No hay selectors ni cascada.** Cada componente recibe sus estilos por `style`,
  sin especificidad ni herencia de clases.

Es decir: *toda la parte de React que ya sabes* (componentes, props, estado,
contextos, hooks, TypeScript) se mantiene; *todo lo que rodea al DOM* cambia.

## Qué aporta Expo

La comunidad de React Native tiene dos formas de empezar un proyecto:

1. **React Native CLI** (sin Expo): configuras tú Android Studio, Xcode, el
   `gradle`, firmas, dependencias nativas… Potente, pero mucha configuración
   inicial.
2. **Expo**: un conjunto de herramientas y una API (`expo-*`) que te dan todo
   eso listo. Creas el proyecto, escaneas un QR y estás probando en el móvil.

Esta unidad (y toda la práctica de este módulo) usa **Expo con SDK 57**. Dentro de
Expo hay dos piezas que conviene distinguir:

- **Expo Go**: una app de tu tienda de aplicaciones que sirve de "reproductor".
  Le pasas el QR que genera `pnpm start` y ejecuta tu proyecto al instante, sin
  compilar. Ideal para desarrollo y para esta unidad.
- **`create-expo-app`**: la herramienta oficial (ya integrada en Expo moderno) que
  genera la estructura del proyecto. Sustituyó al antiguo `expo init`.

> Nota: el antiguo `expo init` y la instalación global de `expo-cli`
> están obsoletos. Usa `create-expo-app` (incluido en Expo moderno).

## Crear un proyecto

Abre una terminal en la carpeta donde quieras trabajar y ejecuta:

```bash
pnpm create expo-app MiAplicacion
# o equivalentemente:
npx create-expo-app MiAplicacion
```

Ambas líneas hacen lo mismo: descargan la plantilla, instalan dependencias y te
dejan una carpeta `MiAplicacion/` lista para arrancar. Elige un nombre sin espacios
y en minúsculas si piensas publicarla algún día.

## Ejecutar el proyecto

Entra en la carpeta recién creada (o en la app de práctica de este módulo) y lanza
el servidor de Expo:

```bash
cd MiAplicacion
pnpm install   # instalar dependencias
pnpm start     # levanta el servidor de Expo (QR para Expo Go)
```

El último comando levanta un servidor de desarrollo y muestra un **QR en la
terminal**. Con Expo Go instalado en el teléfono, escanéalo (asegurándote de que
móvil y PC están en la misma red) y verás la app corriendo. También se recarga
sola cada vez que guardas un archivo.

Desde `pnpm start` puedes pulsar:

- `a` — abrir en emulador Android
- `i` — abrir en simulador iOS (requiere macOS)
- `w` — abrir en el navegador

O directamente:

```bash
pnpm run android
pnpm run ios      # requiere macOS; sin Mac, usa Expo Go en un iPhone
pnpm run web
pnpm run lint     # analizar con ESLint
```

## Documentación oficial

Cuando te pierdas (y te vas a perder alguna vez), estas dos páginas son tu brújula:

- Expo SDK 57: https://docs.expo.dev/versions/v57.0.0/
- Expo Router: https://docs.expo.dev/router/introduction/

## Errores comunes

| Error típico | Causa | Solución |
|--------------|-------|----------|
| `expo: command not found` o intentas usar `expo init` | Estás usando el flujo antiguo (`expo-cli` global) | Usa `pnpm create expo-app` / `npx create-expo-app`; no instales `expo-cli` globalmente |
| El QR no conecta o Expo Go dice "No se pudo conectar" | El móvil y el ordenador están en redes distintas (o una de ellas en VPN) | Ponlos en el mismo Wi-Fi y reintenta; prueba `pnpm run web` para descartar |
| Pulso `i` y sale un error de simulador | Estás en Windows/Linux: no hay simulador de iOS | Usa Expo Go en un iPhone real o el emulador Android (`a`) |
| `Cannot find module` al arrancar | Faltan dependencias | Ejecuta `pnpm install` en la carpeta del proyecto |
| Cambios que no se ven | Estás editando otro proyecto o no guardaste | Comprueba la ruta `cd`, guarda el archivo y mira la terminal por errores de bundling |

## Conceptos clave

| Término | Qué significa en humano |
|---------|-------------------------|
| **React Native** | Framework para escribir apps Android/iOS con React, sin DOM y con componentes nativos |
| **Expo SDK 57** | Conjunto de librerías y herramientas (`expo-*`) de la versión 57 que envuelven React Native |
| **Expo Go** | App de tu tienda que ejecuta tu proyecto escaneando un QR, sin compilar |
| **`create-expo-app`** | Comando oficial para crear un proyecto Expo nuevo (sustituye a `expo init`) |
| **expo-router** | Sistema de rutas tipo Next.js basado en archivos (`app/`), usado por la práctica del módulo |
| **`StyleSheet`** | API de estilos de RN: objetos JS con propiedades tipo CSS en camelCase |
| **Hot reload** | Recarga automática de la app al guardar un archivo |

## Autoevaluación

**1. ¿En qué se diferencia React Native de React en el navegador?**

<details>
<summary>Respuesta</summary>

React se mantiene (componentes, props, estado, hooks), pero no hay DOM ni HTML:
se usan componentes nativos (`View`, `Text`, `Pressable`…) en lugar de `div`,
`span`, `button`; los estilos van en `StyleSheet` (camelCase, sin selectors ni
cascada); y el diseño por defecto es Flexbox en columna.

</details>

**2. ¿Por qué el módulo usa Expo en vez de React Native CLI?**

<details>
<summary>Respuesta</summary>

Expo abstrae toda la configuración nativa (Android Studio, Xcode, gradle,
compilado, dependencias). Con Expo Go y un QR pruebas en el móvil en segundos,
sin compilar. React Native CLI te da más control nativo, pero exige mucha
configuración inicial (ese es el resto pendiente del módulo).

</details>

**3. Estoy en Windows, pulso `i` en `pnpm start` y falla. ¿Qué hago?**

<details>
<summary>Respuesta</summary>

El simulador de iOS solo existe en macOS. Alternativas: pulsar `a` para un
emulador Android, `w` para el navegador, o escanear el QR con Expo Go en un
iPhone real (no hace falta Mac para eso).

</details>

**4. ¿Qué dos comandos hacen falta para arrancar un proyecto recién creado?**

<details>
<summary>Respuesta</summary>

```bash
pnpm install   # instalar dependencias
pnpm start     # servidor de Expo + QR para Expo Go
```

Primero `install` (solo la primera vez o cuando cambian dependencias), después
`start` cada vez que quieras desarrollar.

</details>

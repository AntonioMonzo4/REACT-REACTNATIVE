# React Native — comandos esenciales (Expo SDK 57)

## Crear un proyecto

```bash
pnpm create expo-app MiAplicacion
# o equivalentemente:
npx create-expo-app MiAplicacion
```

> Nota: el antiguo `expo init` y la instalación global de `expo-cli`
> están obsoletos. Usa `create-expo-app` (incluido en Expo moderno).

## Ejecutar el proyecto

```bash
cd MiAplicacion
pnpm install   # instalar dependencias
pnpm start     # levanta el servidor de Expo (QR para Expo Go)
```

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

- Expo SDK 57: https://docs.expo.dev/versions/v57.0.0/
- Expo Router: https://docs.expo.dev/router/introduction/

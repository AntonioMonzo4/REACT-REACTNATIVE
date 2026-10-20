# Unidad 06 — Publicación: EAS Build, EAS Submit y EAS Update
> 🧭 **Navegación:** [← Anterior: Unidad 05 — APIs del dispositivo: cámara, GPS, archivos, notificaciones, permisos](Unidad_05_APIs_dispositivo.md) · [Índice del tema](../README.md) · [Siguiente: tema_016 · Unidad 01 — REST y GraphQL →](../../tema_016/docs/Unidad_01_REST_y_GraphQL.md)

## Objetivos

Al terminar esta unidad podrás:

- Explicar qué es **EAS** (Expo Application Services) y qué servicios ofrece.
- Configurar un proyecto para **development build** vs **preview build** vs **production build**.
- Crear binarios para Android e iOS en la nube con `eas build`.
- Entender el flujo de **submit** a Google Play y App Store.
- Aplicar actualizaciones OTA con **EAS Update** sin pasar por la tienda.
- Situar `expo prebuild` (workflow bare) en el ciclo de vida de una app Expo.

## Requisitos

- [Unidad 01](Unidad_01_ReactNative_Expo.md) completada; ideal también haber leído la 03 y 05.
- Cuenta gratuita en https://expo.dev (el plan Hobby sirve para practicar).
- `eas-cli` instalado: `npm install -g eas-cli` (o `pnpm dlx eas-cli`).
- Android Studio/Xcode **no** hacen falta para los builds en la nube.

## ¿Qué es EAS?

**Expo Application Services** es el conjunto de servicios de Expo en la nube
que resuelven lo "feo" del desarrollo móvil:

| Servicio | Para qué |
|----------|----------|
| **EAS Build** | Compilar el `.aab`/`.apk` de Android y el `.ipa` de iOS en servidores de Expo (sin instalar toolchains locales) |
| **EAS Submit** | Enviar el binario a Google Play Console / App Store Connect |
| **EAS Update** | Publicar parches de JS al instante (OTA) sin nueva versión de tienda |
| **EAS Metadata** | Ficha de la tienda (screenshots, texto, idiomas) |

Antes de EAS, "publicar una app Expo" significaba ejecutar `expo build` contra
builders descontinuados o configurar Macs propios. Hoy EAS es el camino oficial.

## Autenticación y project.json

```bash
npm install -g eas-cli
eas login          # crea cuenta en expo.dev si no tienes
eas init           # en la raíz del proyecto; añade el campo "extra.eas.projectId" a app.json
```

`eas init` escribe un `projectId` en tu `app.json`/`app.config.js`. Sin él,
`eas build` y `eas update` no saben a qué proyecto en la nube apuntan.

## Los tres tipos de build

| Tipo | Cuándo | Comando | Quién lo usa |
|------|--------|---------|--------------|
| **development** | Iterar con código nativo propio (módulos no incluidos en Expo Go) | `eas build --profile development` | Tú, con `expo-dev-client` |
| **preview** | Compartir con QA/stakeholders vía link/QR (Android: APK instalable) | `eas build --profile preview` | Equipo interno |
| **production** | Subir a las tiendas | `eas build --profile production` | Usuarios finales |

La práctica de este módulo es suficiente con Expo Go; los development builds
los necesitarás cuando instales módulos nativos que no trae Expo Go (tema de la
[Unidad 05](Unidad_05_APIs_dispositivo.md) y de `expo prebuild`).

### Perfiles en eas.json

```json
// eas.json
{
  "cli": { "version": ">= 12.0.0" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": { "buildType": "apk" }
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {
      "android": { "serviceAccountKeyPath": "./google-service-account.json", "track": "internal" },
      "ios": { "ascAppId": "1234567890" }
    }
  }
}
```

## Compilar en la nube

```bash
# Android (APK para pruebas)
eas build --platform android --profile preview

# iOS (requiere cuenta Apple Developer Program, ~99 $/año)
eas build --platform ios --profile preview

# Ambas
eas build --platform all --profile production
```

El primer build encola en la cola gratuita de Expo (puede tardar minutos). Al
terminar, la terminal muestra un **link de descarga** y, en Android del perfil
preview, un **QR** para instalar directamente en el teléfono.

Para iOS sin cuenta de desarrollador Apple puedes compilar, pero no instalar en
un dispositivo real ni enviar a TestFlight: Apple exige su firma.

## Submit a las tiendas

```bash
eas submit --platform android --latest
eas submit --platform ios --latest
```

Requisitos previos (una sola vez por app):

- **Google Play:** cuenta de desarrollador (25 $ única), crear la app en Play Console, subir la clave de firma de uploads (gestiona EAS si le das permisos, o usa la tuya).
- **App Store:** cuenta Apple Developer (99 $/año), app creada en App Store Connect, app ID, perfil de distribución; EAS puede gestionar los certificados si se lo permites.

`--latest` usa el build de producción más reciente de EAS; también puedes pasar
un ID de build concreto.

## EAS Update: parches OTA

A veces hay un bug urgente en JS (no en código nativo). Re-compilar y esperar a
la revisión de Apple/Google es lento. **EAS Update** publica un nuevo bundle de
JS que las apps instaladas descargan al abrir (o en background), sin nueva
versión en la tienda.

```bash
eas update --branch production --message "Fix: carrito no limpiaba el total"
eas update:configure   # una vez, añade runtimeVersion y updates a app.json
```

Limites importantes de OTA:

- Solo actualiza **JavaScript y assets**, no código nativo ni dependencias nativas nuevas.
- La app debe tener habilitado el runtime compatible (`runtimeVersion` en `app.json`, típicamente `{"policy": "appVersion"}`).
- Apple lo permite siempre que no cambies capacidades nativas; se considera una "descarga de contenido", no una nueva app.

## Workflow bare: expo prebuild

Si algún día necesitas una librería nativa fuera del ecosistema Expo (o tocar
`AndroidManifest.xml`/`Info.plist` a mano), no reescribes la app: generas los
proyectos nativos:

```bash
npx expo prebuild
```

Eso crea `android/` e `ios/` en tu repo (el mismo resultado que tendría React
Native CLI). A partir de ahí:

- Expo Go ya no sirve para desarrollo con esas libs: usa development builds (`npx expo run:android` o `eas build --profile development`).
- Puedes seguir usando EAS Build/Update si mantienes el `projectId`.
- El `app.json` sigue siendo la fuente de verdad para lo que Expo controla; lo nativo crudo se edita en las carpetas generadas (y `prebuild --clean` las regenera, cuidado con ediciones manuales).

Para el 95 % de las apps de este roadmap, **no hará falta salir del managed
workflow**. `prebuild` es la válvula de escape, no el camino por defecto.

## Errores comunes

| Error típico | Causa | Solución |
|--------------|-------|----------|
| `Project not found` al buildear | Falta `eas init` o el `projectId` | Ejecuta `eas init` en la raíz del proyecto Expo |
| El build de Android no instala en el móvil | Usaste el perfil `production` (AAB) en vez de `preview` (APK) | `eas build --profile preview` genera APK instalable |
| iOS build falla por certificados | Sin cuenta Apple Developer o sin acceso a los certs | Crea la app en App Store Connect y deja que EAS gestione los perfiles, o importa los tuyos |
| `eas update` no llega a los usuarios | Runtime incompatibles o app sin canal de updates | Configura `runtimeVersion` con `eas update:configure` y verifica el canal en `app.json` |
| OTA "no se aplica" | Cambiaste una dependencia nativa | Eso requiere nuevo build, no update; el update es solo para JS/assets |
| `expo prebuild` borra cambios manuales | Regenera `android/`/`ios/` desde cero | No edites a mano esas carpetas si piensas volver a prebuild; usa plugins de config |

## Conceptos clave

| Término | Qué significa en humano |
|---------|-------------------------|
| **EAS Build** | Compilación en la nube de Android/iOS sin toolchains locales |
| **EAS Submit** | Envío del binario a Play Store / App Store |
| **EAS Update** | Actualización OTA de JS/assets sin pasar por la tienda |
| **Development build** | Binario con tu código + dev client (sustituye a Expo Go cuando hay módulos nativos propios) |
| **Preview build** | Binario interno (APK/link) para QA |
| **`eas.json`** | Perfiles de build/submit del proyecto |
| **`expo prebuild`** | Genera `android/` e `ios/` (workflow bare) desde `app.json` |
| **OTA** | *Over The Air*: actualizar por descarga, no por reinstalación |

## Autoevaluación

**1. Quiero que un compañero de equipo pruebe mi app en su Android. ¿Qué comando y perfil?**

<details>
<summary>Respuesta</summary>

`eas build --platform android --profile preview`. El perfil `preview` con
`buildType: apk` produce un APK instalable que puedes compartir por link o QR,
sin necesidad de Play Console.

</details>

**2. Descubrí un bug de JavaScript en producción. ¿EAS Build o EAS Update?**

<details>
<summary>Respuesta</summary>

`eas update` (OTA), si el cambio es solo JS/assets y el runtime es compatible:
llega a los usuarios en minutos sin nueva versión en la tienda. Si tocaste
código nativo o añadiste una librería nativa, hace falta `eas build` y submit.

</details>

**3. ¿Cuándo tiene sentido `npx expo prebuild`?**

<details>
<summary>Respuesta</summary>

Cuando necesitas tocar la capa nativa (configurar plugins a mano, añadir libs
fuera de Expo, editar AndroidManifest/Info.plist) o quieres un flujo tipo React
Native CLI conservando Expo. No es el paso habitual mientras Expo Go o un
módulo `expo-*` cubra lo que necesitas.

</details>

**4. Mi app ya está en la App Store y quiero cambiar un texto del onboarding. ¿Qué hago y cuánto tarda en llegar?**

<details>
<summary>Respuesta</summary>

Si es un cambio de JS: `eas update --branch production`. Las apps actualizan el
bundle al abrir (según la política de actualización de EAS configurada), en
horas/minutos, sin revisión de Apple. Si fuera un cambio de UI nativa o
permisos, haría falta nuevo build y pasaría de nuevo por la revisión.

</details>

**5. ¿Por qué el primer build de iOS falla con un error de certificados si el de Android va bien?**

<details>
<summary>Respuesta</summary>

Android con EAS firma en la nube con claves gestionadas por Expo (o las tuyas si
subes la de uploads). iOS exige una cuenta **Apple Developer Program** de pago y
certificados/perfiles de distribución vinculados a tu App ID en App Store
Connect; sin esa cuenta y esos permisos, el builder no puede firmar el `.ipa`.

</details>

---

> 🧭 **Navegación:** [← Anterior: Unidad 05 — APIs del dispositivo: cámara, GPS, archivos, notificaciones, permisos](Unidad_05_APIs_dispositivo.md) · [Índice del tema](../README.md) · [Siguiente: tema_016 · Unidad 01 — REST y GraphQL →](../../tema_016/docs/Unidad_01_REST_y_GraphQL.md)

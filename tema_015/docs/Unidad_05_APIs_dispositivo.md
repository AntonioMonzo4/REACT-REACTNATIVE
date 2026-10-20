# Unidad 05 — APIs del dispositivo: cámara, GPS, archivos, notificaciones, permisos
> 🧭 **Navegación:** [← Anterior: Unidad 04 — Estado en React Native (Context, Zustand, persistencia)](Unidad_04_Estado_en_React_Native.md) · [Índice del tema](../README.md) · [Siguiente: Unidad 06 — Publicación: EAS Build, EAS Submit y EAS Update →](Unidad_06_Publicacion_EAS.md)

## Objetivos

Al terminar esta unidad podrás:

- Entender cómo Expo abstrae las APIs nativas del teléfono tras paquetes `expo-*`.
- Solicitar **permisos** correctamente (y manejar su denegación).
- Capturar fotos y vídeo con `expo-camera` / `expo-image-picker`.
- Obtener la ubicación con `expo-location`.
- Leer y escribir archivos con `expo-file-system` y `expo-media-library`.
- Programar **notificaciones locales** y entender el flujo de notificaciones push (conceptos).

## Requisitos

- [Unidad 01](Unidad_01_ReactNative_Expo.md) completada.
- Dispositivo físico con Expo Go recomendado (cámara, GPS y notificaciones no se prueban igual en el navegador).
- La práctica de `MiAplicacion/` no incluye estas librerías para no forzar permisos en la demo: los snippets de esta unidad se prueban en un proyecto tuyo con los comandos `npx expo install` de cada sección.

## El modelo mental: APIs nativas tras un paquete Expo

React Native core (View, Text, FlatList…) no trae cámara, GPS ni notificaciones:
son APIs del SO (Android/iOS). Expo las envuelve en paquetes oficiales
(`expo-camera`, `expo-location`…) que:

1. Exponen una API de JavaScript tipada.
2. Gestionan el permiso nativo (dialogs del sistema).
3. Funcionan en Expo Go (SDK incluidos) o en development builds.

Instálalos siempre con `npx expo install` (no `pnpm add` a secas): el comando
elige la versión exacta compatible con tu SDK.

## Permisos: el paso que todos se saltan

Toda API sensible (cámara, micrófono, ubicación, notificaciones, galería)
requiere **pedir permiso en tiempo de ejecución**. El patrón es siempre el mismo:

```tsx
import * as Location from 'expo-location';

async function pedirUbicacion() {
  // 1. Comprobar el estado actual
  const { status: existente } = await Location.getForegroundPermissionsAsync();

  let status = existente;
  if (status !== 'granted') {
    // 2. Pedir permiso (muestra el diálogo del sistema)
    const respuesta = await Location.requestForegroundPermissionsAsync();
    status = respuesta.status;
  }

  if (status !== 'granted') {
    // 3. Denegado: explicar por qué hace falta y ofrecer ajustes
    Alert.alert(
      'Permiso necesario',
      'Necesitamos tu ubicación para mostrarte contenido cercano. Actívalo en Ajustes.',
      [{ text: 'Cancelar' }, { text: 'Abrir ajustes', onPress: () => Linking.openSettings() }],
    );
    return null;
  }

  return Location.getCurrentPositionAsync({});
}
```

Reglas de oro:

- **Nunca assumes `granted`**: el usuario puede denegar, o denegar "solo esta vez".
- **Justifica el permiso** en la UI *antes* del diálogo del sistema (los stores rechazan apps que piden permisos sin contexto).
- En iOS, la descripción se declara en `app.json` (`ios.infoPlist.NSLocationWhenInUseUsageDescription`, `NSCameraUsageDescription`…). Expo los rellena desde los plugins de cada paquete.
- Permisos sensibles se piden **una vez**; si el usuario denega en firme, solo puede reactivarlos desde Ajustes de la app (`Linking.openSettings()`).

## Cámara: expo-camera y expo-image-picker

Hay dos niveles:

- **`expo-image-picker`**: ¿solo quieres una foto o un vídeo rápido desde la cámara o la galería? Es el más fácil.
- **`expo-camera`**: ¿quieres la vista previa en vivo, escanear códigos QR, el flash, cambiar de cámara? Es la cámara completa.

```bash
npx expo install expo-image-picker expo-camera
```

### Foto rápida con image-picker

```tsx
import * as ImagePicker from 'expo-image-picker';

async function tomarFoto() {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') return null;

  const resultado = await ImagePicker.launchCameraAsync({
    mediaTypes: ['images'],           // o ['images', 'videos']
    quality: 0.7,                     // 0–1, comprime el tamaño
    allowsEditing: true,              // recorte antes de guardar
    aspect: [4, 3],
  });

  if (resultado.canceled) return null;
  return resultado.assets[0].uri;     // archivo local temporal (file://)
}
```

La `uri` devuelta es un archivo temporal: súbelo a tu backend o muévelo con
`expo-file-system` a un directorio permanente si necesitas conservarlo.

### Cámara en vivo con expo-camera

```tsx
import { CameraView, useCameraPermissions } from 'expo-camera';

function Camara() {
  const [permiso, solicitar] = useCameraPermissions();
  const camaraRef = useRef<CameraView>(null);

  if (!permiso?.granted) {
    return <Button title="Permitir cámara" onPress={solicitar} />;
  }

  return (
    <>
      <CameraView ref={camaraRef} style={{ flex: 1 }} facing="back" />
      <Button
        title="Foto"
        onPress={async () => {
          const foto = await camaraRef.current?.takePictureAsync();
          console.log(foto?.uri);
        }}
      />
    </>
  );
}
```

`useCameraPermissions` es el hook oficial que combina leer + pedir permiso.
`CameraView` reemplazó al antiguo `Camera` de SDK anteriores.

## GPS: expo-location

```bash
npx expo install expo-location
```

```tsx
import * as Location from 'expo-location';

// Una posición (foreground)
const posicion = await Location.getCurrentPositionAsync({
  accuracy: Location.Accuracy.Balanced,
});
console.log(posicion.coords.latitude, posicion.coords.longitude);

// Geocodificación inversa: coordenadas → dirección
const [direccion] = await Location.reverseGeocodeAsync({
  latitude: posicion.coords.latitude,
  longitude: posicion.coords.longitude,
});
console.log(direccion?.city);

// Seguimiento continuo (ej. app de running) — cancela al desmontar
const suscripcion = await Location.watchPositionAsync(
  { accuracy: Location.Accuracy.High, distanceInterval: 10 },
  (nueva) => console.log(nueva.coords),
);
suscripcion.remove();
```

**Foreground vs background:** lo anterior es `ForegroundPermissions` (solo cuando
la app está visible). Para rastrear con la app en segundo plano necesitas
`BackgroundPermissions` + configuración extra en `app.json`/Xcode/gradle, y las
tiendas revisan mucho ese permiso. Empieza siempre por foreground.

## Archivos y galería: expo-file-system y expo-media-library

```bash
npx expo install expo-file-system expo-media-library
```

`expo-file-system` da acceso al directorio de la app (y, con permisos, a
directorios compartidos):

```tsx
import * as FileSystem from 'expo-file-system';

const destino = FileSystem.documentDirectory + 'notas.json';

await FileSystem.writeAsStringAsync(destino, JSON.stringify(notas));
const contenido = await FileSystem.readAsStringAsync(destino);
console.log(JSON.parse(contenido));

// Copiar un archivo temporal de la cámara a almacenamiento permanente
const guardado = FileSystem.documentDirectory + 'foto-' + Date.now() + '.jpg';
await FileSystem.copyAsync({ from: uriTemporal, to: guardado });
```

`expo-media-library` guarda en la **galería** del usuario (Fotos/Álbumes), lo
que requiere su propio permiso:

```tsx
import * as MediaLibrary from 'expo-media-library';

const { status } = await MediaLibrary.requestPermissionsAsync();
if (status === 'granted') {
  await MediaLibrary.saveToLibraryAsync(fotoUri);
}
```

## Notificaciones (introducción)

```bash
npx expo install expo-notifications
```

Las notificaciones tienen dos mundos:

1. **Locales**: las programa el propio dispositivo (recordatorios, alarmas). Sin servidor.
2. **Push**: las envía tu backend vía el servicio de Expo (o FCM/APNs). Requieren proyecto, cuentas de desarrollador y tokens por dispositivo.

Ejemplo mínimo de **notificación local** (se prueba en dispositivo físico; en web
no existe la API):

```tsx
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function programarRecordatorio() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '¡A practicar React Native!',
      body: 'Dedica 20 minutos al módulo 16.',
    },
    trigger: { type: 'timeInterval', seconds: 60 },
  });
}
```

Para push reales, el flujo es: registrar el dispositivo → obtener el
`ExpoPushToken` → enviarlo a tu backend → el backend llama a la API de Expo
Push. Es tema de un proyecto completo, no de esta unidad introductoria.

## Errores comunes

| Error típico | Causa | Solución |
|--------------|-------|----------|
| El diálogo de permiso no aparece | Ya se pidió y se denegó en firme | `Linking.openSettings()` para que el usuario lo active a mano |
| La cámara está negra en el simulador | No hay cámara (o GPS) real | Prueba siempre en un dispositivo físico con Expo Go |
| `getForegroundPermissionsAsync` lanza en web | Muchas APIs no existen en `react-native-web` | Comprueba `Platform.OS !== 'web'` o degrada con un mensaje |
| La foto "desaparece" al reiniciar | Era un archivo temporal del picker | Cópialo con `FileSystem.copyAsync` a `documentDirectory` antes de referenciarla en tu estado |
| Notificaciones no llegan en iOS | Falta configuración en el simulador/dispositivo | Permisos en Ajustes del iPhone; en desarrollo suele requerir device real |
| `npx expo install` vs `pnpm add` | Versiones incompatibles con el SDK | Usa siempre `npx expo install expo-*` |

## Conceptos clave

| Término | Qué significa en humano |
|---------|-------------------------|
| **Permisos runtime** | Autorizaciones que el SO pide al usuario en uso, no al instalar |
| **`expo-image-picker`** | Fotos/vídeos rápidos desde cámara o galería |
| **`expo-camera`** | Cámara en vivo con vista previa y controles |
| **`expo-location`** | GPS: posición, seguimiento y geocodificación |
| **`expo-file-system`** | Leer/escribir archivos en el almacenamiento de la app |
| **`expo-media-library`** | Guardar en la galería del usuario (Fotos) |
| **`expo-notifications`** | Notificaciones locales y push vía Expo Push Service |
| **Foreground vs Background** | Permisos mientras la app está visible vs en segundo plano |

## Autoevaluación

**1. Mi app pide permiso de ubicación en el primer render y el usuario lo rechaza. ¿Qué comportamiento es correcto?**

<details>
<summary>Respuesta</summary>

No insistir en bucle. Mostrar una UI de "funcionalidad no disponible" con un
botón que lleve a `Linking.openSettings()` si quiere activarlo, y desactivar las
features que dependan del GPS. Los stores penalizan apps que re-piden permisos
de forma agresiva.

</details>

**2. Capturé una foto con `expo-image-picker` y la subo en la siguiente pantalla. ¿Guardo la `uri` en el estado global?**

<details>
<summary>Respuesta</summary>

Solo temporalmente: esa `uri` apunta a un archivo **temporal** que el sistema
puede limpiar. Lo robusto es copiarlo con `expo-file-system` a
`documentDirectory` (o subirlo ya al backend) antes de depender de él.

</details>

**3. ¿Qué paquete uso si solo necesito "hacer una foto y subirla"?**

<details>
<summary>Respuesta</summary>

`expo-image-picker` con `launchCameraAsync`. `expo-camera` es para vista previa
en vivo, QR o controles avanzados; para un disparo simple, image-picker ahorra
permisos y código.

</details>

**4. ¿Las notificaciones push las envía el propio teléfono?**

<details>
<summary>Respuesta</summary>

No. Las **locales** las programa el dispositivo con `scheduleNotificationAsync`.
Las **push** las envía tu backend (o Expo Push API) hacia el token del
dispositivo; el cliente solo se suscribe y muestra.

</details>

**5. ¿Por qué `npx expo install expo-location` y no `pnpm add expo-location`?**

<details>
<summary>Respuesta</summary>

`expo install` resuelve la versión del paquete exactamente compatible con el SDK
de tu proyecto (SDK 57). `pnpm add` coge la última, que puede ser de un SDK
distinto y romper el build o Expo Go.

</details>

---

> 🧭 **Navegación:** [← Anterior: Unidad 04 — Estado en React Native (Context, Zustand, persistencia)](Unidad_04_Estado_en_React_Native.md) · [Índice del tema](../README.md) · [Siguiente: Unidad 06 — Publicación: EAS Build, EAS Submit y EAS Update →](Unidad_06_Publicacion_EAS.md)

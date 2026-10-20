# Unidad 02 — FlatList, SectionList e Image
> 🧭 **Navegación:** [← Anterior: Unidad 01 — React Native y Expo (SDK 57)](Unidad_01_ReactNative_Expo.md) · [Índice del tema](../README.md) · [Siguiente: Unidad 03 — Navegación: Stack y Drawer (expo-router) →](Unidad_03_Navegacion_Stack_Drawer.md)

## Objetivos

Al terminar esta unidad podrás:

- Diferenciar cuándo usar `ScrollView`, `FlatList` y `SectionList`.
- Renderizar listas grandes de forma eficiente con `FlatList` (`renderItem`, `keyExtractor`, virtualización).
- Agrupar datos en secciones con `SectionList`.
- Añadir cabeceras, pies, separadores, estados vacíos y *pull-to-refresh* a una lista.
- Mostrar imágenes remotas y locales con `Image` (core) y `expo-image`.

## Requisitos

- Haber completado la [Unidad 01](Unidad_01_ReactNative_Expo.md): proyecto Expo funcionando y diferencias React web ↔ React Native.
- Conocimientos de `map` y arrays en JavaScript.
- La app de práctica `ReactNative/MiAplicacion/` arrancada (`pnpm start`) para probar los snippets en la pantalla `Listas`.

## ScrollView vs FlatList: la diferencia clave

En web, listas largas casi siempre se meten en un `div` con `overflow: auto`. En
móvil, eso tiene un coste real: **`ScrollView` renderiza (monta en memoria) todos
sus hijos**, aunque solo veas una parte de la pantalla. Con 2.000 filas, la app se
queda sin memoria o va a tirones.

`FlatList` (y su hermana `SectionList`) usan **virtualización**: solo mantienen
montados los elementos visibles más un pequeño margen. Al desplazarte, reciclan
el espacio de las filas que salen de pantalla para pintar las que entran. Por eso
la regla es sencilla:

| Situación | Componente |
|-----------|------------|
| Contenido corto, que cabe entero o casi (un formulario, una tarjeta, una pantalla de ajustes) | `ScrollView` |
| Lista larga o potencialmente larga (chats, feeds, resultados de búsqueda, contactos) | `FlatList` |
| Lista larga **agrupada** por categorías/con encabezados (agenda, secciones de ajustes, contactos por letra) | `SectionList` |

`FlatList` y `SectionList` comparten casi toda la API; si dominas una, la otra
es trivial.

## FlatList paso a paso

Las tres props imprescindibles:

- `data`: el array de elementos.
- `renderItem`: función que recibe `{ item, index, separators }` y devuelve el JSX de cada fila.
- `keyExtractor`: función que devuelve un string único por elemento (el equivalente a la prop `key` de React web). **Nunca uses el `index` como key** si la lista puede reordenarse o filtrarse: provocará parpadeos y estado en el sitio equivocado.

```tsx
import { FlatList, StyleSheet, Text, View } from 'react-native';

type Tarea = { id: string; titulo: string; hecha: boolean };

const TAREAS: Tarea[] = [
  { id: '1', titulo: 'Aprender FlatList', hecha: false },
  { id: '2', titulo: 'Practicar keyExtractor', hecha: true },
  { id: '3', titulo: 'Probar pull-to-refresh', hecha: false },
];

export default function ListaTareas() {
  return (
    <FlatList
      data={TAREAS}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.fila}>
          <Text style={item.hecha ? styles.hecha : styles.pendiente}>
            {item.titulo}
          </Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  fila: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  pendiente: { fontSize: 16 },
  hecha: { fontSize: 16, textDecorationLine: 'line-through', color: '#888' },
});
```

### Props que vas a usar sí o sí en producción

| Prop | Para qué sirve |
|------|----------------|
| `ListHeaderComponent` | Cabecera de la lista (título, buscador, contador). Ojo: no se fija al hacer scroll como en web. |
| `ListFooterComponent` | Pie: indicador de "cargando más", aviso legal, botón. |
| `ListEmptyComponent` | Se muestra cuando `data` está vacío (estado vacío sin `if` extra). |
| `ItemSeparatorComponent` | Separador entre filas (mejor que poner `borderBottom` a ciegas). |
| `refreshing` + `onRefresh` | Activa el gesto *pull-to-refresh* y controla su spinner. |
| `onEndReached` + `onEndReachedThreshold` | Paginación infinita: se dispara cerca del final. |
| `estimatedItemSize` | Tamaño estimado de cada fila en píxeles; mejora el scroll en listas muy largas (React Native moderno). |

Ejemplo combinado con estado vacío, separadores y refresh:

```tsx
const [refrescando, setRefrescando] = useState(false);

const alRefrescar = async () => {
  setRefrescando(true);
  await recargarDatos(); // tu fetch
  setRefrescando(false);
};

<FlatList
  data={tareas}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <FilaTarea tarea={item} />}
  ItemSeparatorComponent={() => <View style={styles.separador} />}
  ListHeaderComponent={<Text style={styles.titulo}>Mis tareas</Text>}
  ListEmptyComponent={<Text>No hay tareas todavía.</Text>}
  refreshing={refrescando}
  onRefresh={alRefrescar}
  onEndReached={cargarMasPagina}
  onEndReachedThreshold={0.5}
/>
```

> **Errores comunes:** olvidar `keyExtractor` (React avisa en desarrollo);
> usar `renderItem` con una función anónima definida *fuera* del componente
> (pierde el cierre de estado); montar un `ScrollView` infinito dentro de otro
> scroll (rompe el gesto); poner `flex: 1` solo en el contenedor y no dejar que
> `FlatList` ocupe el resto (la lista no scrollea).

## SectionList: la misma idea, con grupos

`SectionList` recibe `sections`: un array de objetos `{ title, data }`. Cada
sección pinta su encabezado con `SectionHeader` (o la prop `SectionHeaderComponent`)
y sus filas con el mismo `renderItem` de siempre.

```tsx
import { SectionList, StyleSheet, Text, View } from 'react-native';

const CONTACTOS = [
  { title: 'A', data: ['Ana', 'Álvaro'] },
  { title: 'B', data: ['Beatriz', 'Bruno'] },
  { title: 'C', data: ['Carla', 'Carlos'] },
];

export default function ListaContactos() {
  return (
    <SectionList
      sections={CONTACTOS}
      keyExtractor={(item, index) => item + index}
      renderItem={({ item }) => <Text style={styles.item}>{item}</Text>}
      renderSectionHeader={({ section: { title } }) => (
        <Text style={styles.header}>{title}</Text>
      )}
    />
  );
}

const styles = StyleSheet.create({
  header: { fontSize: 18, fontWeight: 'bold', padding: 8, backgroundColor: '#eee' },
  item: { padding: 12, fontSize: 16 },
});
```

Cuando los datos vengan de una API, el patrón habitual es **agrupar en cliente**
con `reduce` o `Map` antes de pasarlo a `sections`.

## Image: imágenes en React Native

React Native incluye un componente `Image` en el core. Dos formas de cargar:

```tsx
import { Image } from 'react-native';

// Remota (https obligatorio; http necesita configuración extra en Android)
<Image
  source={{ uri: 'https://picsum.photos/id/237/200/200' }}
  style={{ width: 200, height: 200 }}
  resizeMode="cover"
  onLoad={() => console.log('cargada')}
  onError={() => console.log('error')}
/>

// Local (requiere require, no string)
<Image source={require('../assets/images/logo.png')} style={{ width: 64, height: 64 }} />
```

`resizeMode` acepta `cover`, `contain`, `stretch`, `center` o `repeat`. En listas,
dale siempre un `style` con ancho y alto (o `aspectRatio`): sin dimensiones, la
imagen no se pinta.

### expo-image: el reemplazo recomendado

Para apps reales, el ecosistema Expo usa **`expo-image`** (ya instalado en la app
de práctica): caching automático, transiciones, soporte de GIF/AVIF y mejor
rendimiento en listas.

```tsx
import { Image } from 'expo-image';

<Image
  source={{ uri: 'https://picsum.photos/id/237/200/200' }}
  style={{ width: 200, height: 200 }}
  contentFit="cover"
  transition={300}
  placeholder={{ blurhash: 'L6PZfSjE.AyE_3t7t7R**0o#DgR4' }}
/>
```

La prop `placeholder` (blurhash o URI de baja resolución) evita el "flash" blanco
mientras carga la imagen real: la práctica de este módulo la usa en las fotos de
lista.

## Errores comunes

| Error típico | Causa | Solución |
|--------------|-------|----------|
| La lista no scrollea | `FlatList` dentro de un `ScrollView`, o sin `flex: 1` en un contenedor con altura | Quita el `ScrollView` externo o asegúrate de que el `FlatList` es el scroll principal |
| Las filas se "reordenan" al filtrar | `keyExtractor` usa el `index` | Usa un id estable del dato |
| Imagen remota no aparece en Android | URL `http://` (no `https`) | Usa `https` o configura `usesCleartextTraffic` solo en desarrollo |
| Imagen local no carga | Pasaste un string en `source` | Usa `require('ruta')`, no `'/ruta.png'` |
| `ListEmptyComponent` no se ve | `data` no es un array (es `undefined` mientras carga) | Normaliza: `data={items ?? []}` y gestiona la carga aparte |
| Scroll lento con muchas imágenes | `Image` core sin cache | Usa `expo-image` con `placeholder` y cache por defecto |

## Conceptos clave

| Término | Qué significa en humano |
|---------|-------------------------|
| **Virtualización** | Solo se montan en memoria las filas visibles; el resto se pinta al acercarse |
| **`FlatList`** | Lista virtualizada de una dimensión (una "capa" de filas) |
| **`SectionList`** | Lista virtualizada agrupada con encabezados de sección |
| **`keyExtractor`** | Función que da una identidad estable a cada fila (como la prop `key` en web) |
| **Pull-to-refresh** | Gesto de "tirar hacia abajo" para recargar; se activa con `refreshing`/`onRefresh` |
| **Paginación infinita** | Cargar la siguiente página al acercarse al final (`onEndReached`) |
| **`expo-image`** | Componente de imágenes de Expo: cache, transiciones, blurhash |

## Autoevaluación

**1. Tengo una pantalla con un formulario y, debajo, una lista de 5 comentarios. ¿Qué combino?**

<details>
<summary>Respuesta</summary>

Un `ScrollView` para envolver pantalla si el contenido total es corto y no hay
interacción de scroll compleja, o mejor: el `FlatList` de comentarios con
`ListHeaderComponent` renderizando el formulario. Así el formulario scrollea
junto a la lista sin duplicar scrollers. Evita siempre `ScrollView` + `FlatList`
anidados.

</details>

**2. ¿Por qué no usar el `index` de la lista como `key`?**

<details>
<summary>Respuesta</summary>

Porque si la lista se reordena, se filtra o se insertan elementos, React asocia
el estado de cada fila a su posición, no a su identidad: aparecen textos en la
fila equivocada, parpadeos y resets de animación. Usa un id real del dato.

</details>

**3. ¿Qué tres props controlan el pull-to-refresh?**

<details>
<summary>Respuesta</summary>

`refreshing` (booleano: ¿se muestra el spinner?), `onRefresh` (función async que
recarga) y, opcionalmente, el estilo del contenedor. El gesto lo ofrece
`FlatList`/`SectionList` de serie en móvil.

</details>

**4. Estoy construyendo un feed con fotos y al hacer scroll rápido se ve lento. ¿Qué reviso?**

<details>
<summary>Respuesta</summary>

1) Que uses `FlatList` y no `ScrollView` (virtualización). 2) Que las imágenes
se carguen con `expo-image` (cache + placeholder) en vez de `Image` sin cache.
3) `estimatedItemSize` o `getItemLayout` si conoces el alto fijo de las filas.
4) Que `keyExtractor` sea estable y no recicules componentes pesados por fila.

</details>

**5. ¿Cómo muestro algo cuando la API devuelve una lista vacía?**

<details>
<summary>Respuesta</summary>

Con `ListEmptyComponent` en la `FlatList`/`SectionList`, y asegurando que
`data` siempre es un array (`data={items ?? []}`). Así no necesitas un `if`
extra fuera de la lista.

</details>

---

> 🧭 **Navegación:** [← Anterior: Unidad 01 — React Native y Expo (SDK 57)](Unidad_01_ReactNative_Expo.md) · [Índice del tema](../README.md) · [Siguiente: Unidad 03 — Navegación: Stack y Drawer (expo-router) →](Unidad_03_Navegacion_Stack_Drawer.md)

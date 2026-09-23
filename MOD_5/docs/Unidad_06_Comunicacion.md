# Unidad 06 — Comunicación entre componentes

## Objetivos

- Entender el flujo de datos de React: **hacia abajo con props, hacia arriba con callbacks**.
- Comunicar padre → hijo pasando datos y callbacks como props.
- Comunicar hijo → padre sin mutar props, llamando a la función que el padre le dio.
- Sincronizar hermanos subiendo el estado al **menor ancestro común**.
- Reconocer el **prop drilling** y saber cuándo subir de nivel (Context en M6, estado global en M9).
- Aplicar la tabla de patrones útiles y el checklist de diseño a casos reales.

## Requisitos

- Unidad 02 del curso **o** Módulo 4: dominar props, eventos (`onClick`, `onChange`...) y `useState`.
- Saber componer componentes anidados y renderizar listas.
- Si no tienes claro "quién posee el estado", repasa M4: aquí solo vamos a mover ese estado de lugar.

---

## 1. Padre → Hijo (props)

### Qué significa

Los datos en React fluyen en **una sola dirección: hacia abajo**. Un padre manda a sus hijos la información y los callbacks que estos necesitan, mediante props. El hijo no "busca" datos: los recibe en su lista de parámetros y los pinta.

Es como una empresa: la dirección (padre) distribuye instrucciones y recursos (props) a los equipos (hijos); los equipos no se reparten el trabajo entre ellos, suben peticiones a la dirección.

### Por qué importa

Este flujo unidireccional es lo que hace predecible la UI: si quieres saber de dónde sale un dato, solo tienes que subir por el árbol de componentes hasta quien lo posee. No hay variables globales escondidas ni eventos que revientan por cualquier lado.

### Ejemplo

Flujo normal: el padre pasa datos y callbacks.

```jsx
function Padre() {
  const [count, setCount] = useState(0)
  return <Hijo count={count} onAdd={() => setCount((c) => c + 1)} />
}
```

Aquí el padre posee el estado `count`, se lo pasa como prop `count`, y además le regala `onAdd`, una función que el hijo podrá invocar para pedirle que incremente. El hijo solo *sabe* qué mostrar y *qué llamar*; el quién-decide es el padre.

---

## 2. Hijo → Padre (callback)

### Qué significa

Un hijo **no puede** escribir en las props: son inmutables por diseño (las recibe de su padre, y modificarlas sería como cambiarle el discurso a quien te lo dio). Si el hijo necesita "avisar" o "pedir" un cambio, llama a una **función callback** que el padre le pasó como prop.

La idea clave: **el hijo no muta props; llama a la función que el padre le dio.** El padre, al ejecutar su propio callback, actualiza su estado y React propaga las nuevas props hacia abajo. Se cierra el ciclo: hijo avisa → padre cambia → hijo recibe props nuevas.

### Ejemplo

```jsx
function Hijo({ count, onAdd }) {
  return <button onClick={onAdd}>Soy hijo: {count}</button>
}
```

El botón no hace `count++` (eso sería mutar una prop, imposible); simplemente invoca `onAdd`, que es la función del padre `() => setCount((c) => c + 1)`. Quien decide y quién posee el estado sigue siendo el padre.

### Por qué importa

Este patrón —**estado arriba, notificación hacia arriba**— es la base de toda la comunicación en React. Lo usarás en formularios (`onSubmit`), en modales (`onClose`), en listas (`onSelect`) y en cualquier componente "controlado" por su padre.

---

## 3. Hermanos (subir al padre)

### Qué significa

Dos componentes hermanos están en el mismo nivel: ninguno es propietario del otro, así que **no se pasan estado directamente**. La solución es subir: el estado vive en el **menor ancestro común** (el padre que ambos comparten), que reparte los datos y callbacks a izquierda y derecha.

### Diagrama

```text
      Padre (estado: selected)
       /              \
   HermanoA         HermanoB
  (dispara)        (lee selected)
```

HermanoA no le manda nada a HermanoB. HermanoA llama a un callback del Padre, el Padre actualiza `selected`, y en el siguiente render HermanoB recibe `selected` por props. El estado nunca se movió de nivel: solo lo "descubrieron" dos ramas distintas.

### Ejemplo

```jsx
function Padre() {
  const [selected, setSelected] = useState(null)
  return (
    <>
      <Lista onSelect={setSelected} />
      <Detalle item={selected} />
    </>
  )
}
```

`Lista` dispara `onSelect(id)`; `Detalle` lee `item={selected}`. Clásico patrón **lista/detalle**: seleccionar en un lado, ver los datos en el otro, sincronizados porque el estado común está un nivel arriba.

### Por qué importa

Casi toda UI real tiene hermanos que deben sincronizarse (menú + contenido, filtros + resultados, carrito + resumen). Entender "sube el estado al menor ancestro común" resuelve la gran mayoría de los casos sin necesidad de librerías externas.

---

## 4. "Prop drilling" y cuándo subir de nivel

### Qué significa

**Prop drilling** (perforado de props) es pasar una prop a través de varios componentes intermedios que no la usan, solo para que llegue a uno que sí la necesita. Es como pasar una nota de mano de sala en sala hasta quien la espera: a veces es rápido, a veces el recorrido es absurdo.

### Cuándo subir de nivel

- **2–3 niveles de props: normal**, no hace falta Context todavía. Es explícito, fácil de seguir y de depurar.
- El mismo estado/callback atraviesa **muchos** niveles sin usarlo en los intermedios → candidato a **Context** (Módulo 6) o estado global (Módulo 9). Si tres o más componentes seguidos solo hacen de conducto, es señal de que el diseño conviene moverlo.

### Por qué importa

El drilling no es un error grave, es un **síntoma**: te dice dónde el árbol de componentes está mal orientado. Corregirlo a tiempo (moviendo estado o usando Context) te ahorra callbacks fantasma que nadie entiende.

---

## 5. Patrones útiles

La siguiente tabla recoge los patrones que más vas a usar; léela como un menú de opciones para el diseño de componentes:

| Patrón | Cuándo |
|--------|--------|
| Estado en el padre | hermanos deben sincronizarse |
| Callback + estado en hijo | hijo controlado por el padre |
| Render props / children function | el padre decide qué renderiza el hijo |
| Componente controlado (`isOpen`, `onClose`) | modals, drawers, tabs |

**Explicación de cada fila:**

- **Estado en el padre**: cuando dos o más ramas dependen del mismo dato, el estado sube al ancestro común (sección 3).
- **Callback + estado en hijo**: el padre posee un valor y lo baja; el hijo notifica cambios. El hijo es "controlado": su UI depende de props que el padre ajusta.
- **Render props / children function**: en vez de pasar datos, pasas *cómo pintar*. El padre decide qué renderiza el hijo; útil para casillas, listas con plantilla, o proveedores de contexto visual.
- **Componente controlado (`isOpen`, `onClose`)**: el componente no decide si está abierto; el padre sí. Patrón estándar de modals, drawers y tabs: props `isOpen`/`onClose` (o `open`/`onClose`) y el estado vive fuera.

---

## Checklist de diseño

Antes de colocar un estado, hazte estas **cuatro preguntas**:

1. ¿Quién **necesita** el dato para pintarlo? → ahí suele vivir el estado. Si lo pintan dos ramas, sube al ancestro común.
2. ¿Quién **provoca** el cambio? → recibe el callback. El que dispara no tiene por qué ser el que posee: suele ser un hijo notificando a un padre.
3. ¿Se repite el drilling sin sentido? → extraer contexto o mover estado hacia arriba. Si tres conductos seguidos no usan la prop, es momento de Context (M6) o estado global (M9).
4. ¿Dos hermanos comparten datos? → estado en el padre (o store en M9). Nunca intentes que los hermanos se pasen cosas directamente.

Ampliación práctica: contesta estas preguntas **antes** de escribir `useState`. La mayoría de los dolores de cabeza de "¿por qué no se actualiza?" se resuelven con un minuto de diseño, no con más código.

---

## En el ejemplo del proyecto

Ver `../EJEMPLO_REACT_INTERMEDIO/src/components/Comunicacion.jsx`: padre con contador, hijo que notifica y dos hermanos (lista + resumen) sincronizados. Es el caso de estudio completo de esta unidad: padr→hijo con callback, y hermanos compartiendo estado vía el menor ancestro común.

---

## Errores comunes

| Error | Solución |
|-------|----------|
| El hijo intenta mutar una prop (`count++`, `count = 5`) | No modifiques props: llama al callback que el padre te pasó (`onAdd()`) |
| Dos hermanos no se "ven" aunque el uno cambie | El estado no está en un ancestro común: súbelo al padre que ambos comparten |
| Pasar la misma prop por 4-5 componentes seguidos | Prop drilling excesivo → Context (M6) o estado global (M9) |
| "No se actualiza" al modificar el estado | Estabas mutando el objeto/array antiguo: crea uno nuevo (`setEstado({...estado, x: 1})`) |
| El modal/pestaña abre y cierra solo | Aplica el patrón controlado: `isOpen` y `onClose` viven en el padre, no dentro del modal |

Ejemplo de callback bien usado vs. mutación:

```jsx
// MAL: intentar mutar la prop
function Hijo({ count }) {
  return <button onClick={() => (count += 1)}>{count}</button>
}

// BIEN: invocar el callback del padre
function Hijo({ count, onAdd }) {
  return <button onClick={onAdd}>{count}</button>
}
```

---

## Conceptos clave

- Los datos fluyen hacia abajo (props) y las notificaciones hacia arriba (callbacks).
- Padre → hijo: el padre pasa datos y callbacks como props.
- Hijo → padre: el hijo **no muta props**, llama a la función que el padre le dio.
- Hermanos: el estado vive en el **menor ancestro común**; patrón lista/detalle con `Lista` + `Detalle`.
- Prop drilling: atravesar niveles con props; 2–3 niveles es normal, muchos niveles → Context (M6) o estado global (M9).
- Patrones útiles: estado en el padre, callback + estado en hijo, render props / children function, componente controlado (`isOpen`, `onClose`).
- Checklist de diseño: ¿quién pinta? ¿quién cambia? ¿drilling repetido? ¿hermanos comparten?
- Componente controlado: el padre decide si está abierto/cerrado; típico en modals, drawers y tabs.
- Referencia del proyecto: `../EJEMPLO_REACT_INTERMEDIO/src/components/Comunicacion.jsx` (padre contador, hijo notifica, hermanos lista + resumen).

---

## Autoevaluación

**1. Un hijo necesita incrementar un contador que posee el padre. ¿Puede hacer `count + 1` directamente sobre la prop? ¿Qué hace en su lugar?**

<details>
<summary>Respuesta</summary>

No: las props son inmutables. El hijo recibe el estado (`count`) y un callback (`onAdd`) como props, y al producirse el evento (p. ej. `onClick`) invoca `onAdd()`. El padre ejecuta su `setCount((c) => c + 1)`, actualiza el estado y React le pasa `count` nuevo al hijo en el siguiente render.

</details>

**2. Tienes `Lista` y `Detalle`, dos hermanos: al hacer clic en un elemento de la lista debe mostrarse su detalle. ¿Dónde vive el estado `selected` y por qué?**

<details>
<summary>Respuesta</summary>

En el **menor ancestro común** de ambos (el padre que los renderiza): `const [selected, setSelected] = useState(null)`. `Lista` recibe `onSelect={setSelected}` y lo dispara; `Detalle` recibe `item={selected}`. Los hermanos no se pasan estado directamente; lo comparten subiéndolo un nivel.

</details>

**3. ¿Cuándo el prop drilling es aceptable y cuándo hay que subir de nivel?**

<details>
<summary>Respuesta</summary>

Con 2–3 niveles es normal, explícito y fácil de depurar: no hace falta Context. Cuando el mismo estado o callback atraviesa **muchos** niveles y los intermedios solo lo transportan sin usarlo, es candidato a Context (Módulo 6) o a un estado global (Módulo 9).

</details>

**4. Aplica el checklist de diseño: llega una petición "haz un modal que se abra desde el botón y también desde el menú". ¿Quién posee `isOpen` y qué recibe el componente del modal?**

<details>
<summary>Respuesta</summary>

Como **dos ramas distintas** necesitan abrirlo (botón y menú = hermanos o ramas hermanas), `isOpen` vive en el **menor ancestro común**. El componente del modal es **controlado**: recibe `isOpen` (props) y `onClose` (callback) para que el padre sea quien decida abrir/cerrar, siguiendo el patrón de la tabla de patrones útiles.

</details>

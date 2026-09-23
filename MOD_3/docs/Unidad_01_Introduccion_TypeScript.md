# Unidad 01 — Introducción a TypeScript

## Objetivos

- Entender qué es TypeScript y cómo se diferencia de JavaScript.
- Conocer los beneficios y las desventajas de usar TypeScript en un proyecto.
- Instalar TypeScript en un proyecto con `pnpm` o `npm`.
- Ejecutar los comandos esenciales de `tsc`: compilar, `--init` y `--noEmit`.
- Leer y modificar las opciones clave del `tsconfig.json` (`strict`, `rootDir`/`outDir`, `noEmit`, `sourceMap`/`declaration`).
- Diferenciar los archivos `.ts` de los `.tsx` y saber por qué `<string>input` falla en JSX (y usar `as` en su lugar).

## Requisitos

- Haber completado las unidades anteriores del módulo (o tener nociones básicas de programación: variables, funciones, ejecutar un script).
- Saber abrir una terminal y ejecutar comandos básicos.
- No hace falta conocer JavaScript a fondo: en este mismo módulo iremos viendo lo necesario. Si ya sabes JS, mejor todavía; si no, aquí te explicamos las diferencias.
- Durante toda esta unidad usaremos el ejemplo [`../hello-world/`](../hello-world/): assúmelo como tu laboratorio de prácticas.

---

## ¿Qué es TypeScript?

TypeScript es un lenguaje de programación construido **sobre JavaScript**. Imagina JavaScript como el idioma que el navegador y Node.js entienden de verdad, y TypeScript como JavaScript al que le añadimos **anotaciones de tipos**: pequeñas etiquetas que describen qué clase de dato guarda cada variable o qué recibe cada función.

La idea central es:

> TypeScript añade **tipos estáticos opcionales**. Esos tipos existen solo mientras escribes el código; al **compilar**, se eliminan y el resultado es JavaScript puro.

Es decir, el navegador **nunca** ve TypeScript: solo ve JavaScript. Alguien (normalmente el compilador `tsc`, o herramientas como Vite/SWC) se encarga de "quitarle la etiqueta" a tu código antes de que llegue a ejecutarse.

### Analogía

Piensa en los tipos como las etiquetas de un archivador:

- Sin etiquetas (JavaScript puro): todo cabe en cualquier cajón, pero cuando buscas "el contrato de alquiler" puedes encontrarte una factura y darte cuenta tarde.
- Con etiquetas (TypeScript): en el momento de guardar ya te avisan si intentas meter un número donde dijiste que iría un texto. El archivador funciona igual; solo que tienes un revisor que comprueba antes de cerrarlo.

### ¿Qué significa "estático"?

- **Estático** = se comprueba **antes de ejecutar** el programa (en tiempo de compilación / al guardar el archivo), leyendo el código.
- **Dinámico** = se comprueba **mientras el programa corre** (en tiempo de ejecución), si es que se comprueba algo.

JavaScript es dinámico: puedes guardar un texto en una variable y, cinco líneas más abajo, un número, sin que el navegador proteste. TypeScript, en cambio, te avisa al escribir: "esta variable la declaraste como texto, no le pongas un número".

### ¿Qué significa "opcional"?

Que puedes usar TypeScript **sin anotar un solo tipo** y seguir teniendo un archivo válido: muchas anotaciones se deducen solas. Los tipos son una ayuda, no una obligación de escritura constante (aunque en este curso sí los escribiremos para practicar).

---

## Beneficios

- **Tipado estático: errores en compilación, no en runtime.** Un error clásico de JS es llamar `.length` a un `number` o pasar `undefined` a una función. Ese fallo, en JS, aparece cuando el usuario ya está usando la app; en TS, te aparece en la terminal o en el editor **antes** de que nadie ejecute nada.
- **Mejor refactor.** Si cambias el nombre de una propiedad de un objeto o el tipo que devuelve una función, el compilador **marca todos los sitios** que quedaron desactualizados. En JS puro tendrías que buscarlos a mano o descubrirlos en producción.
- **Autocompletado / IDE.** Los tipos alimentan el IntelliSense de VS Code: al escribir `miObjeto.` te propone exactamente las propiedades que existen, con su documentación y tipo. Es, probablemente, el beneficio que notas al primer día.
- **Documentación viva.** La firma de una función (`function add(a: number, b: number): number`) documenta sola qué entrada espera y qué devuelve. No hay que adivinar leyendo el cuerpo.
- **Compatibilidad total con JS.** Puedes mezclar archivos `.ts` y `.js`, e importar librerías de JS sin problema (especialmente si publican o incluyen tipos).

## Desventajas

- **Compilador extra.** Hay que pasar por `tsc` (o dejar que Vite/SWC lo haga por ti). Añade un paso y, a veces, un tiempo de espera al build.
- **Disciplina.** Hay que escribir y mantener los tipos. Si mientes con anotaciones o casts (`as any` por todas partes), el sistema de seguridad se apaga aunque "compile".
- **Curva de aprendizaje.** Al principio las anotaciones y los mensajes de error pueden parecer ruido; con la práctica se leen como frases normales.
- **Configuración.** El `tsconfig.json` tiene muchas opciones; al principio solo necesitas unas pocas (las verás más abajo).

> Nota honesta: en proyectos con React + Vite, la configuración ya viene hecha y el paso de compilación lo lleva Vite. Las desventajas pesan mucho menos de lo que parecen.

---

## Instalación

TypeScript se instala como **dependencia de desarrollo** (`-D`): es una herramienta de construcción, no algo que tu app necesita en producción.

```bash
pnpm add -D typescript
# o npm i -D typescript
```

Verificar que está instalado (imprime la versión):

```bash
pnpm exec tsc --version
# o npx tsc --version
```

Si el proyecto es con **React + Vite**, TypeScript suele venir ya configurado: plantillas como `npm create vite@latest mi-app -- --template react-ts` incluyen `typescript`, el `tsconfig.json` y los scripts de comprobación. En ese caso no instales nada extra; solo comprueba que existe el archivo `tsconfig.json` en la raíz del proyecto.

---

## Ejecutar y configurar: los comandos `tsc`

`"Con qué entra`pnpm run <script>`. A no ser que se indique lo contrario, los ejemplos de esta unidad van pensados para el ejemplo [`../hello-world/`](../hello-world/`.

### Compilar un archivo suelto

```bash
pnpm tsc index.ts     # compilar un archivo
```

Esto toma `index.ts`, elimina los tipos y escribe `index.js` al lado. Es la forma más básica de ver TypeScript "en acción": mira el `.js` generado y comprobarás que las anotaciones han desaparecido.

### Generar la configuración

```bash
tsc --init            # generar tsconfig.json
```

Crea un `tsconfig.json` en la raíz con **todas** las opciones (muchas comentadas). A partir de ahí, `tsc` sin argumentos compila el proyecto entero siguiendo ese archivo, en vez de fichero a fichero.

### Solo validar, sin escribir JavaScript

```bash
pnpm run check        # tsc --noEmit (solo validar)
```

Equivale a ejecutar `tsc --noEmit`: recorre el código, comprueba los tipos y **no escribe ningún archivo**. Es el comando que usarás constantemente mientras programas: te da el veredicto ("¿compila o no?") sin ensuciar tu carpeta con salidas intermedias.

### Build completo

```bash
pnpm run build        # tsc → dist/
```

Compila todo el proyecto según el `tsconfig.json` y deja el JavaScript resultante en la carpeta de salida (`dist/`, según configure `outDir`). Este es el paso que, en un proyecto real, se ejecuta antes de desplegar.

### Resumen de comandos

| Comando | Qué hace | Cuándo usarlo |
|---------|----------|---------------|
| `pnpm tsc index.ts` | Compila un archivo a JS al lado | Pruebas rápidas de un archivo suelto |
| `tsc --init` | Genera `tsconfig.json` | Solo una vez, al crear el proyecto |
| `tsc --noEmit` / `pnpm run check` | Valida tipos sin generar JS | Constantemente, mientras programas |
| `pnpm run build` | Compila todo el proyecto hacia `dist/` | Al construir/desplegar |

---

## El `tsconfig.json` del ejemplo `hello-world/`

Tras `tsc --init` verás decenas de opciones. Estas son las que importan al empezar (todas están presentes, directa o comentadas, en el [`tsconfig.json`](../hello-world/tsconfig.json) del ejemplo):

| Opción | Efecto |
|--------|--------|
| `strict: true` | Activa el chequeo estricto (recomendado) |
| `rootDir` / `outDir` | `src/` → `dist/` |
| `noEmit` (script check) | Valida sin escribir JS |
| `sourceMap` / `declaration` | Depuración y `.d.ts` |

Qué significa cada una:

- **`strict: true`** — El interruptor principal. Enciende de golpe todo el conjunto de comprobaciones estrictas (por ejemplo, te obliga a tratar `undefined` con cuidado, comprueba `null`, impide parámetros implícitos...). Si solo recuerdas una opción del `tsconfig`, que sea esta. Desactivarlo hace que TS pase de "guardia riguroso" a "guardia amable": sigue avisando de cosas, pero se le escapan bastantes bugs.
- **`rootDir` / `outDir`** — Indican la carpeta de **origen** y la de **destino**. Con `rootDir: "src"` y `outDir: "dist"`, el `src/index.ts` se convierte en `dist/index.js`, manteniendo la estructura. Así tu código fuente y los artefactos compilados nunca se mezclan (y puedes mandar `dist/` a `.gitignore`).
- **`noEmit`** — Cuando es `true`, `tsc` **no escribe** el JavaScript resultante: solo comprueba. Es la base del script `check` (`tsc --noEmit`): ideal para CI o para validar en caliente sin generar basura. (Ojo: si pones `noEmit: true` en el `tsconfig.json` de forma permanente, el `build` dejará de producir JS; por eso el ejemplo lo define como una opción del *script*, no del archivo.)
- **`sourceMap`** — Genera archivos `.js.map` que **relacionan** el JS compilado con tu TS original. Sin ellos, cuando depuras en el navegador o en Node y pones un breakpoint, te marca la línea del archivo `.js` minificado/compilado, no la tuya. Con `sourceMap: true`, el depurador salta a tu `index.ts` real. Imprescindible para depurar con comodidad.
- **`declaration`** — Genera archivos `.d.ts` junto al JS: son ficheros que contienen **solo los tipos**, sin implementación. Si tu proyecto es una librería que otros importarán, tus usuarios reciben autocompletado y chequeo de tipos aunque no tengan tu código fuente. Para una app que nadie importa, puedes dejarlo en `false`.

---

## Archivos: `.ts` vs `.tsx`

- **`.ts`** → TypeScript "plano": JavaScript con tipos. No puede contener sintaxis JSX.
- **`.tsx`** → lo mismo + **JSX** (la sintaxis `<div>...</div>` de React). El `x` es de JSX.

La extensión importa porque **JSX reinterpreta los símbolos `<` y `>`**. Dentro de un archivo JSX, `<string>input` no se lee como una "aserción de tipo a `string`": el compilador lo interpreta como la creación de un elemento `<string>` con hijo `input`. Por eso **no compila en JSX** (o compila a algo que no querías).

### La forma correcto en `.tsx`: el operador `as`

```typescript
// ✅ Válido en .ts y en .tsx
const len: number = (input as string).length;
```

```typescript
// ❌ Falla en archivos .tsx (JSX interpreta <string> como un elemento)
const len: number = (<string>input).length;
```

> En `.tsx` usa `input as string`; `<string>input` no compila en JSX. En archivos `.ts` planos, ambas formas suelen funcionar, pero en este curso usaremos **siempre `as`** para que el mismo código sirva en cualquier archivo.

**¿Qué hace `as`?** Le dice al compilador: "confía, este valor es de tipo `string`". Es un **cast** (una afirmación), no una conversión: no transforma el dato en runtime, solo cambia lo que TS cree saber sobre él. Si mientes, el error aparecerá después, en tiempo de ejecución — úsalo con cuidado y, siempre que puedas, deja que el *narrowing* automático haga el trabajo (lo verás en la Unidad 02).

---

## En el ejemplo

Práctica en [`../hello-world/`](../hello-world/): `src/index.ts` y `src/fundamentals.ts`.

Sugerencia de recorrido para esta unidad:

1. Abre [`../hello-world/tsconfig.json`](../hello-world/tsconfig.json) y localiza en la tabla las opciones `strict`, `rootDir`, `outDir`, `sourceMap` y `declaration`.
2. Abre [`../hello-world/package.json`](../hello-world/package.json) y mira cómo los scripts `check` y `build` invocan `tsc --noEmit` y `tsc`.
3. Ejecuta `pnpm run check` desde la carpeta del ejemplo y comprueba que termina sin errores.
4. Provoca un error a propósito en `src/index.ts` (por ejemplo, `const x: number = "hola"`), vuelve a ejecutar `check` y **lee el mensaje** que devuelve `tsc`. Fíjate en el archivo, la línea y la explicación: así se leerán todos los errores de este curso.
5. Deshaz el cambio y vuelve a pasar el `check`.

---

## Errores comunes

### 1. Intentar asignar un tipo incompatible

**Qué error verás** (mensaje orientativo; el texto exacto varía según la versión de TS):

```text
Type 'string' is not assignable to type 'number'.
```

**Por qué pasa.** Declaraste la variable como `number` y le metes un `string`. Recordemos: los tipos se comprueban *antes* de ejecutar.

```typescript
let edad: number = 25;
edad = "veinticinco"; // ❌ Error de compilación
```

**Cómo evitarlo.** Asegúrate de que el valor coincide con el tipo declarado, o cambia el tipo de la variable si esa era tu intención:

```typescript
let edad: number = 25;
edad = 26; // ✅
let etiqueta: string = "veinticinco"; // ✅ si necesitas texto, usa string
```

### 2. Usar una variable antes de darle un valor

**Qué error verás:**

```text
Variable 'x' is used before being assigned.
```

**Por qué pasa.** Con `strict` activo, TS exige que una variable tenga valor antes de leerla; en runtime eso sería `undefined` y un fallo posible.

```typescript
let mensaje: string;
console.log(mensaje.length); // ❌ mensaje aún no tiene valor
```

**Cómo evitarlo.** Inicializa en la declaración o asigna antes de usar:

```typescript
let mensaje: string = "hola";
console.log(mensaje.length); // ✅
```

### 3. Ejecutar `tsc` sin `tsconfig.json` y "no hace nada" como esperabas

**Qué error verás:** no hay error como tal: `tsc` sin argumentos y sin `tsconfig.json` no encuentra proyecto, o compila solo los archivos que le indiques y luego te olvidas de mirar la salida.

**Por qué pasa.** Sin `tsconfig.json`, `tsc` no sabe qué archivos abarcar, ni dónde escribir, ni si debe ser estricto.

**Cómo evitarlo.** Genera la configuración una vez y trabaja con scripts:

```bash
tsc --init          # una sola vez
pnpm run check      # validación diaria (tsc --noEmit)
pnpm run build      # compilación completa
```

### 4. Instalar TypeScript como dependencia normal (no de desarrollo)

**Qué error verás:** no es un error de compilación, pero verás `typescript` en las dependencias de producción y un paquete pesado de más en tu bundle/despliegue.

**Por qué pasa.** El compilador solo se necesita para construir, no en el navegador ni en el servidor en producción.

**Cómo evitarlo:**

```bash
pnpm add -D typescript   # -D = dependencia de desarrollo ✅
npm i -D typescript      # equivalente con npm
```

### 5. Escribir `<string>miVariable` dentro de un `.tsx`

**Qué error verás:**

```text
JSX element type 'string' does not have any construct or call signatures.
```

(o un error similar apuntando a que `<string>` se interpreta como un elemento JSX)

**Por qué pasa.** En `.tsx`, `<` y `>` son sintaxis de JSX: `<string>input` se lee como "crear el elemento `<string>` con dentro `input`", no como aserción de tipo.

```typescript
// ❌ En un archivo .tsx esto falla
const len = (<string>input).length;
```

**Cómo evitarlo.** Usa el operador `as`:

```typescript
// ✅ Funciona en .ts y en .tsx
const len = (input as string).length;
```

### 6. Confundir `check` con `build`

**Qué pasa.** Ejecutas `pnpm run check` y te preguntas por qué no aparece nada compilado en `dist/`.

**Por qué.** `check` es `tsc --noEmit`: **solo valida**, no escribe JS. Es el comportamiento deseado: sirve para comprobaciones rápidas y para CI.

**Cómo evitarlo.** Usa cada comando para lo que es: `check` para validar mientras programas, `build` para generar `dist/`.

---

## Conceptos clave

- **TypeScript** = JavaScript + tipos estáticos opcionales que se eliminan al compilar.
- **Estático vs dinámico**: los tipos de TS se revisan antes de ejecutar; JS solo en runtime (y poco).
- **Tipado opcional**: puedes anotar poco y dejar que TS deduzca; el chequeo sigue activo.
- **Beneficios**: errores tempranos, refactor seguro, autocompletado/IntelliSense, documentación en las firmas.
- **Desventajas**: paso de compilación extra, disciplina para mantener tipos, curva de aprendizaje, configuración.
- **Instalación**: `pnpm add -D typescript` / `npm i -D typescript` (dependencia de desarrollo).
- **`tsc file.ts`**: compila un archivo concreto a JS.
- **`tsc --init`**: crea el `tsconfig.json` del proyecto.
- **`tsc --noEmit`** (script `check`): solo valida tipos, no genera archivos.
- **Script `build`** (`tsc` → `dist/`): compilación completa según el `tsconfig`.
- **`strict: true`**: conjunto de chequeos estrictos; la opción más importante del `tsconfig`.
- **`rootDir` / `outDir`**: de dónde sale el código (`src/`) y a dónde va el JS (`dist/`).
- **`noEmit`**: impide escribir la salida JS (validación pura).
- **`sourceMap`**: mapa para depurar el TS original desde el JS compilado.
- **`declaration`**: genera `.d.ts` (solo tipos) para quien consuma tu librería.
- **`.ts` vs `.tsx`**: `.tsx` añade JSX; en JSX, `<string>x` no es una aserción → usa `x as string`.
- **Aserción `as`**: afirma un tipo al compilador sin convertir el valor en runtime.
- **Ejemplo de práctica**: [`../hello-world/`](../hello-world/) (`src/index.ts`, `src/fundamentals.ts`).

---

## Autoevaluación

**1. ¿Por qué los errores de tipos en TypeScript aparecen antes de ejecutar el programa que en JavaScript?**

<details>
<summary>Respuesta</summary>

Porque TypeScript es un lenguaje con **tipado estático**: el compilador (`tsc`) revisa las anotaciones y las operaciones **en tiempo de compilación**, antes de generar el JavaScript que luego se ejecuta. JavaScript no tiene ese paso de comprobación previa: las incompatibilidades de tipos solo estallan (si estallan) mientras el programa corre, es decir, en tiempo de ejecución.

</details>

**2. ¿Para qué sirven `rootDir` y `outDir` en el `tsconfig.json`?**

<details>
<summary>Respuesta</summary>

`rootDir` indica la carpeta de **origen** del código fuente (por ejemplo `src/`) y `outDir` la carpeta de **destino** donde se escribe el JavaScript compilado (por ejemplo `dist/`). Así, `src/index.ts` acaba como `dist/index.js` sin mezclar fuentes y compilados en el mismo sitio.

</details>

**3. Tengo un archivo `Componente.tsx` con `let x: unknown` y quiero leer `x.length`. ¿Puedo escribir `(<string>x).length`? ¿Y `(x as string).length`? ¿Por qué?**

<details>
<summary>Respuesta</summary>

- `(<string>x).length` **no**: en un archivo `.tsx` el JSX interpreta `<string>` como la creación de un elemento, no como aserción de tipo, y el compilador da error.
- `(x as string).length` **sí**, es la forma correcta en `.tsx` (y también vale en `.ts`). Además, como `x` es `unknown`, antes de usar sus propiedades hay que afirmar o narrowar su tipo; `as string` es una afirmación (no convierte el dato en runtime).

</details>

**4. ¿Qué diferencia hay entre `pnpm run check` y `pnpm run build` en el ejemplo `hello-world/`?**

<details>
<summary>Respuesta</summary>

`check` ejecuta `tsc --noEmit`: **solo valida** los tipos y no escribe ningún archivo. `build` ejecuta `tsc` con la configuración del `tsconfig.json` y **genera** el JavaScript en `outDir` (`dist/`), listo para ejecutarse o desplegarse.

</details>

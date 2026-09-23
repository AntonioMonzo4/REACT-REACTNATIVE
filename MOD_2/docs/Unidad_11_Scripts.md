# Unidad 11 — Scripts

## Objetivos

- Entender qué son los scripts definidos en `package.json` y por qué existen.
- Aprender qué ocurre por dentro cuando ejecutas `npm run dev`.
- Conocer la carpeta `node_modules/.bin` y cómo npm la usa para encontrar herramientas.
- Saber crear scripts personalizados, encadenarlos, pasarles argumentos y usar variables de entorno.
- Aplicar buenas prácticas de nombrado y automatización en un proyecto de React.

## Requisitos

- Haber creado al menos un proyecto con npm (haber ejecutado `npm install` alguna vez).
- Tener instalado Node.js y npm (o pnpm) en tu equipo.
- Saber abrir una terminal y ejecutar comandos básicos.
- Conocer de forma mínima qué es un `package.json` (lo viste en unidades anteriores).

---

Cuando empiezas con React ejecutas comandos como:

```bash
npm run dev
```

o

```bash
pnpm dev
```

Y parece magia.

Pero realmente solo estás diciéndole a npm:

> "Busca un script llamado `dev` y ejecútalo."

Ese "nombre mágico" no está escrito en ninguna parte de la terminal: vive dentro de tu `package.json`, en el campo `scripts`. En esta unidad vamos a ver exactamente cómo funciona todo ese mecanismo.

## ¿Qué problema resuelven los scripts?

Imagina un proyecto sin scripts.

Cada desarrollador tendría que recordar comandos como:

```bash
vite --host --port 3000
```

o

```bash
eslint src --fix
```

o

```bash
tsc --noEmit
```

o

```bash
vitest --watch
```

No solo serían largos, sino que cada miembro del equipo podría escribirlos de forma distinta (unas veces con `--watch`, otras sin él; unas veces apuntando a `src`, otras a toda la carpeta). Eso produce resultados diferentes entre compañeros y muchos errores difíciles de detectar.

### La solución

Asignar un nombre sencillo a cada comando.

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "test": "vitest"
  }
}
```

Ahora basta con escribir:

```bash
npm run dev
```

Así, todo el equipo ejecuta exactamente lo mismo, sin memorizar comandos largos ni discutir sobre los flags correctos.

## ¿Qué ocurre internamente?

Cuando escribes:

```bash
npm run dev
```

npm hace aproximadamente esto:

```text
Terminal
   ↓
npm
   ↓
Lee package.json
   ↓
Busca "scripts"
   ↓
Busca "dev"
   ↓
Encuentra: "vite"
   ↓
Ejecuta vite
```

Es decir:

```bash
npm run dev
```

es equivalente a:

```bash
vite
```

pero con una diferencia muy importante: la forma con `npm run` es portable, está documentada en el proyecto y funciona igual en la máquina de cualquier compañero.

## ¿Cómo encuentra Vite?

Supongamos esta estructura:

```text
mi-proyecto/
├── node_modules/
│      └── .bin/
│            └── vite
│
└── package.json
```

Cuando ejecutas:

```bash
npm run dev
```

npm añade automáticamente la carpeta:

```text
node_modules/.bin
```

al `PATH` del proceso (a la lista de lugares donde la terminal busca ejecutables).

Por eso puede encontrar el ejecutable de Vite aunque no esté instalado globalmente en tu equipo: no hace falta instalar Vite "en el ordenador entero", basta con que exista dentro del proyecto.

## ¿Qué es node_modules/.bin?

Dentro de `node_modules` existe una carpeta especial:

```text
node_modules/
└── .bin/
```

Aquí npm coloca enlaces (atajos) a los ejecutables de muchas dependencias.

Ejemplo:

```text
.bin/
├── vite
├── eslint
├── prettier
├── tsc
└── vitest
```

Gracias a esto puedes ejecutar cualquiera de esas herramientas desde un script sin indicar la ruta completa (no necesitas escribir algo interminable como `./node_modules/vite/bin/vite.js`).

## Scripts automáticos

Hay algunos nombres que se han convertido en convenciones de la comunidad.

Por ejemplo:

```json
{
  "scripts": {
    "dev": "...",
    "build": "...",
    "test": "...",
    "lint": "...",
    "start": "..."
  }
}
```

No son obligatorios, pero casi todos los proyectos modernos los utilizan porque resultan familiares para cualquier desarrollador: si mañana entras en un proyecto nuevo y ves `npm run build`, ya sabes, sin preguntar, qué hace.

## Scripts personalizados

Puedes crear cualquier nombre.

```json
{
  "scripts": {
    "saludar": "echo Hola Mundo"
  }
}
```

Después:

```bash
npm run saludar
```

Salida:

```text
Hola Mundo
```

Esto demuestra que un script es simplemente un alias para un comando: no hay nada mágico, solo un nombre que tú inventas y un comando que tú escribes.

## Encadenar scripts

Supongamos que quieres ejecutar varias tareas seguidas.

```json
{
  "scripts": {
    "build": "vite build && vite preview"
  }
}
```

Flujo:

```text
vite build
   ↓
termina correctamente
   ↓
vite preview
```

El operador `&&` ejecuta el segundo comando solo si el primero finaliza sin errores. Si la compilación falla, `vite preview` no se lanza (y así evitas publicar una versión rota por accidente).

## Pasar argumentos

También puedes enviar argumentos al script:

```bash
npm run test -- --watch
```

El primer `--` indica a npm:

> "A partir de aquí, no interpretes más opciones; pásalas al comando."

Internamente se ejecutaría algo equivalente a:

```bash
vitest --watch
```

Sin ese `--` extra, npm intentaría interpretar `--watch` como una opción suya y fallaría.

## Variables de entorno

Un script puede utilizar variables de entorno.

Por ejemplo:

```json
{
  "scripts": {
    "start": "NODE_ENV=production vite"
  }
}
```

Sin embargo, este formato no funciona igual en todos los sistemas operativos.

En Windows y Unix hay diferencias en la sintaxis (en Windows esa misma línea daría error porque no entiende `VAR=valor` delante del comando).

Por eso es habitual utilizar herramientas como `cross-env` para escribir scripts portables:

```json
{
  "scripts": {
    "start": "cross-env NODE_ENV=production vite"
  }
}
```

Así el mismo script funciona en Windows, macOS y Linux.

## Automatización en React

Piensa en todo lo que haces en un proyecto:

```text
Desarrollar
   ↓
Compilar
   ↓
Analizar código
   ↓
Ejecutar tests
   ↓
Crear versión final
```

Cada paso puede asociarse a un script.

```json
{
  "scripts": {
    "dev": "...",
    "build": "...",
    "lint": "...",
    "test": "...",
    "preview": "..."
  }
}
```

Esto permite que cualquier desarrollador ejecute exactamente las mismas tareas con los mismos comandos, en cualquier orden y sin depender de la memoria de nadie.

## Ejemplo real

Un `package.json` de un proyecto React podría incluir:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "format": "prettier --write .",
    "test": "vitest"
  }
}
```

Fíjate en este script:

```text
"build": "tsc && vite build"
```

No solo compila la aplicación.

Primero ejecuta TypeScript para comprobar errores y, solo si todo está correcto, genera la versión optimizada con Vite.

Este tipo de automatización es muy habitual en proyectos profesionales: el propio equipo de build se convierte en una red de seguridad contra errores de tipos.

## Scripts en npm vs pnpm

Si usas npm:

```bash
npm run dev
```

Si usas pnpm:

```bash
pnpm dev
```

pnpm detecta automáticamente que `dev` es un script y permite omitir la palabra `run` para los scripts más comunes. (Con npm, `npm dev` no funciona: siempre necesitas `npm run` + nombre, salvo unos pocos casos especiales como `npm test` o `npm start`.)

## Buenas prácticas

- Utiliza nombres estándar (`dev`, `build`, `test`, `lint`, `preview`) siempre que sea posible, porque cualquier compañero los reconocerá al instante.
- Evita incluir lógica muy compleja en un único script; si crece demasiado, considera moverla a un archivo independiente (por ejemplo, un script de Node o un archivo `.sh`) y llamarlo desde el script.
- Documenta los scripts importantes en el `README.md` del proyecto, para que una persona nueva sepa qué comando usar para levantar el proyecto.
- Aprovecha los scripts para automatizar tareas repetitivas y reducir errores humanos: si se hace más de una vez a mano, probablemente debería ser un script.

## Conceptos clave

- Los scripts son alias definidos en `package.json` (campo `scripts`) para ejecutar comandos.
- `npm run` lee el campo `scripts` y ejecuta el comando asociado al nombre indicado.
- npm añade temporalmente `node_modules/.bin` al `PATH`, permitiendo usar herramientas instaladas localmente sin rutas largas.
- Puedes crear scripts personalizados, encadenarlos con `&&` y pasarles argumentos usando un `--` separador.
- Las variables de entorno en scripts pueden requerir herramientas como `cross-env` para funcionar en Windows y Unix por igual.
- Los scripts son una de las herramientas de automatización más importantes del ecosistema JavaScript.

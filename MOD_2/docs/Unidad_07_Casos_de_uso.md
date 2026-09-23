# Unidad 07 — Casos de Uso de Node.js

## Objetivos

- Conocer los principales usos de Node.js en el desarrollo moderno.
- Entender cuándo Node.js es una buena elección y cuándo conviene usar otras tecnologías.
- Reconocer cómo usarás Node.js como desarrollador Frontend en el día a día.
- Identificar casos reales de empresas que utilizan Node.js.

## Requisitos

- Unidad 06: diferencias entre navegador y Node.js.
- Saber ejecutar comandos básicos en la terminal (`pnpm dev`, etc.).
- Tener una idea general de qué es un servidor y una API.

## Índice

1. ¿Por qué Node.js tuvo tanto éxito?
2. Desarrollo Frontend
3. Desarrollo Backend
4. APIs REST
5. Aplicaciones en tiempo real
6. Microservicios
7. Automatización
8. Herramientas de desarrollo
9. Server Side Rendering (SSR)
10. ¿Cuándo NO usar Node.js?
11. Casos reales de empresas
12. Conceptos clave
13. Ejercicios

## 1. ¿Por qué Node.js tuvo tanto éxito?

Antes de Node.js era habitual encontrar esta situación:

```text
Frontend
│
└── JavaScript

Backend
│
├── Java
├── PHP
├── Python
└── C#
```

Esto implicaba:

- Dos lenguajes.
- Dos equipos especializados.
- Mayor tiempo de desarrollo.
- Mayor coste de mantenimiento.

**¿Qué problema había?** El frontend y el backend hablaban "idiomas distintos": había que traducir requisitos, mantener dos bases de código y contratar perfiles diferentes.

Con Node.js apareció la posibilidad de utilizar JavaScript en ambos lados:

```text
Frontend
│
└── JavaScript

Backend
│
└── JavaScript (Node.js)
```

Esto facilitó el trabajo de muchos equipos, aunque no significa que JavaScript sea siempre la mejor opción para el backend.

**Error típico:** asumir que porque "ya sé JavaScript" no hace falta aprender nada más del backend (bases de datos, seguridad, diseño de APIs). El lenguaje es el mismo; los problemas, no.

## 2. Desarrollo Frontend

Aunque parezca curioso, el uso más común de Node.js para un desarrollador frontend no es crear servidores, sino **ejecutar herramientas**.

Cuando escribes:

```bash
pnpm dev
```

ocurre algo parecido a esto:

```text
Terminal
      │
      ▼
   Node.js
      │
      ▼
     Vite
      │
      ▼
Compila React
      │
      ▼
Servidor de desarrollo
      │
      ▼
http://localhost:5173
```

Node.js también ejecuta:

- Vite
- Webpack
- Babel
- TypeScript
- ESLint
- Prettier
- Vitest
- Jest

**¿Por qué importa?** Sin Node.js, el desarrollo moderno con React sería muy diferente: no tendrías servidor de compilación en caliente, ni linters, ni formateadores, ni test runners funcionando con un solo comando.

**Error típico:** ver `npm ERR!` en rojo y no saber qué mirar. Lo primero es leer el mensaje: casi siempre indica que un paquete no se instaló o que un script falló.

## 3. Desarrollo Backend

Uno de los usos más conocidos: con Node.js puedes crear servidores web.

Ejemplo:

```javascript
import http from "node:http";

const server = http.createServer((req, res) => {
    res.end("Hola Mundo");
});

server.listen(3000);
```

**¿Qué hace este código?** Crea un servidor HTTP que escucha en el puerto 3000 y responde "Hola Mundo" a cualquier petición. Es el equivalente mínimo a "tener una web abierta" pero sin interfaz gráfica.

En proyectos reales suele utilizarse un framework como:

- Express
- Fastify
- NestJS
- Hono

Estos frameworks simplifican la creación de APIs y aplicaciones web (enrutado, middlewares, parsing de cuerpos, etc.).

**Error típico:** intentar usar `http` de Node.js tal cual para una API grande. A partir de cierto tamaño, un framework ahorra mucho trabajo y evita errores.

## 4. APIs REST

Imagina una aplicación React. Cuando el usuario inicia sesión:

```text
React
  ↓
POST /login
  ↓
Servidor Node
  ↓
Base de datos
  ↓
Respuesta JSON
  ↓
React
```

**¿Qué es una API REST?** Un contrato de comunicación por HTTP donde el cliente (React) envía peticiones (`GET`, `POST`...) y el servidor devuelve datos, normalmente en JSON.

Node.js es muy utilizado para desarrollar este tipo de APIs porque maneja muy bien operaciones de entrada/salida (I/O): mientras espera la base de datos, puede atender otras peticiones.

**Error típico:** guardar contraseñas en texto plano en la base de datos. El backend es el lugar donde se valida y se protege la información sensible.

## 5. Aplicaciones en tiempo real

Aquí es donde Node.js destaca especialmente. Ejemplos:

- Chats.
- Videojuegos online.
- Notificaciones.
- Colaboración en tiempo real.
- Edición compartida de documentos.
- Sistemas de seguimiento en directo.

Ejemplo de un chat:

```text
Usuario A
  ↓
Servidor Node
  ↓
Usuario B
```

Gracias a tecnologías como WebSockets, el servidor puede enviar información a los clientes sin que estos tengan que preguntar constantemente (a diferencia de la petición clásica cliente→servidor).

**¿Por qué importa Node.js aquí?** Sostener miles de conexiones abiertas es justo lo que su modelo de E/I no bloqueante está diseñado para hacer.

**Error típico:** usar peticiones HTTP normales con temporizadores (`setInterval`) para simular un chat. Funciona mal y consume muchos recursos; lo correcto es WebSockets o similar.

## 6. Microservicios

En lugar de tener una única aplicación enorme, muchas empresas dividen el sistema en pequeños servicios independientes. Por ejemplo:

```text
                API Gateway
                     │
 ┌──────────┬──────────┬──────────┐
 ▼          ▼          ▼          ▼
Usuarios   Pagos     Pedidos   Notificaciones
```

Cada servicio puede estar desarrollado con una tecnología distinta. Node.js es una opción frecuente para servicios que realizan muchas operaciones de red.

**¿Por qué importa?** Si un servicio falla o necesita escalar, se toca solo él y no toda la aplicación.

**Error típico:** fragmentar en exceso una app pequeña. Los microservicios añaden complejidad (comunicación, despliegues); no son gratuitos.

## 7. Automatización

Node.js también se utiliza para crear scripts. Por ejemplo:

- Renombrar miles de archivos.
- Generar documentación.
- Convertir imágenes.
- Leer archivos CSV.
- Enviar correos automáticamente.
- Generar informes.

Ejemplo de flujo:

```text
Script Node
   ↓
Lee carpeta
   ↓
Procesa imágenes
   ↓
Guarda resultados
```

**¿Por qué importa?** Tareas repetitivas hechas a mano producen errores. Un script las hace en segundos y de forma reproducible.

**Error típico:** no probar el script en una copia de los datos. Si borra o renombra mal, puedes perder trabajo.

## 8. Herramientas de desarrollo

Muchísimas herramientas que utilizas diariamente están escritas en Node.js. Algunos ejemplos:

- Vite
- ESLint
- Prettier
- TypeScript Compiler (tsc)
- npm
- pnpm
- Yarn

Cuando ejecutas:

```bash
pnpm lint
```

o

```bash
pnpm build
```

es Node.js quien ejecuta esas herramientas.

**Error típico:** tener una versión de Node incompatible con la herramienta y recibir errores crígitos confusos. Solución habitual: revisar la versión requerida en la documentación y usar nvm para cambiar de versión.

## 9. Server Side Rendering (SSR)

React puede renderizarse de dos formas.

### Renderizado en el navegador (CSR)

```text
Navegador
   ↓
Descarga JavaScript
   ↓
React genera el HTML
```

### Renderizado en el servidor (SSR)

```text
   Cliente
      ↓
Servidor Node.js
      ↓
Genera HTML
      ↓
Envía HTML al navegador
      ↓
React se hidrata
```

Este enfoque ofrece ventajas como:

- Mejor SEO.
- Primera carga más rápida.
- Mejor experiencia en conexiones lentas.

Frameworks como Next.js utilizan Node.js para realizar este tipo de renderizado.

**¿Qué significa "hidratar"?** El navegador recibe HTML ya montado por el servidor; React "se adueña" de ese HTML y le añade la interactividad (eventos, estado).

**Error típico:** usar en el cliente APIs solo del servidor (como `fs`) en una app SSR: el renderizado en servidor puede funcionar, pero al llegar al navegador se rompe.

## 10. ¿Cuándo NO usar Node.js?

Aunque es una herramienta muy potente, no siempre es la mejor elección. No suele ser la opción ideal para:

### Cálculos intensivos

Ejemplo:

- Simulaciones científicas.
- Procesamiento matemático complejo.
- Modelos físicos.

**¿Por qué?** Porque esas tareas pueden bloquear el hilo principal. Node.js procesa JavaScript en un solo hilo: si ocupas mucho tiempo en cálculo, no responde a peticiones.

### Procesamiento de vídeo

Ejemplos:

- Edición de vídeo.
- Conversión de formatos.
- Renderizado 3D.

Suelen utilizarse herramientas especializadas o lenguajes como C++ o Rust para estas tareas.

### Inteligencia Artificial

Aunque puedes consumir modelos de IA desde Node.js, el entrenamiento y la mayoría de bibliotecas de ciencia de datos están más desarrollados en Python.

**Error típico:** intentar calcular un conjunto enorme de datos dentro de un request de Node y ver cómo la API deja de responder. Solución: workers, tareas en segundo plano, o un servicio especializado.

## 11. Casos reales

Piensa en una aplicación como una plataforma de streaming:

```text
React
  ↓
API Node.js
  ↓
Base de datos
  ↓
Servicio de autenticación
  ↓
Servicio de pagos
  ↓
Servicio de recomendaciones
  ↓
Almacenamiento de vídeos
```

Node.js puede encargarse de:

- API.
- Autenticación.
- Notificaciones.
- Comunicación en tiempo real.

Mientras que otros servicios especializados realizan tareas más exigentes.

### ¿Qué usarás tú como desarrollador Frontend?

En tu día a día utilizarás Node.js para:

- Crear proyectos con React.
- Instalar dependencias.
- Ejecutar Vite.
- Lanzar el servidor de desarrollo.
- Compilar la aplicación.
- Ejecutar pruebas.
- Ejecutar ESLint y Prettier.
- Automatizar tareas.

Si más adelante desarrollas backend con Node.js, ya tendrás una base sólida para trabajar con frameworks como Express o NestJS.

## Conceptos clave

- Node.js se utiliza mucho más que para crear servidores: es el motor de casi toda la herramienta frontend.
- Es una pieza esencial del ecosistema moderno de JavaScript (un solo lenguaje para frontend y backend).
- Destaca en aplicaciones con muchas operaciones de entrada/salida y en tiempo real (chats, WebSockets).
- Es el motor que permite ejecutar herramientas de desarrollo como Vite, ESLint o TypeScript.
- También sirve para automatización (scripts), microservicios y Server Side Rendering (SSR).
- No es la mejor opción para cargas de cálculo intensivo, procesamiento de vídeo o entrenar modelos de IA; conocer sus fortalezas y limitaciones es parte de elegir la tecnología adecuada.

## Ejercicios

1. Lista 5 programas que ejecutas con Node.js sin darte cuenta (pistas: Vite, ESLint...).
2. Dibuja el flujo de una petición `POST /login` desde React hasta la base de datos y de vuelta.
3. Explica con tus palabras por qué Node.js es bueno para chats y malo para simulaciones físicas.
4. Investiga qué es SSR y anota dos ventajas y un inconveniente de usarlo.

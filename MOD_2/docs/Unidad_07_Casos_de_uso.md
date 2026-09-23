# Unidad 07 — Casos de Uso de Node.js

Objetivo

Conocer los principales usos de Node.js en el desarrollo moderno, cuándo es una buena elección y cuándo conviene utilizar otras tecnologías.

Índice
¿Por qué Node.js tuvo tanto éxito?
Desarrollo Frontend
Desarrollo Backend
APIs REST
Aplicaciones en tiempo real
Microservicios
Automatización
Herramientas de desarrollo
Server Side Rendering (SSR)
¿Cuándo NO usar Node.js?
Casos reales de empresas
Resumen
Ejercicios
1. ¿Por qué Node.js tuvo tanto éxito?

Antes de Node.js era habitual encontrar esta situación:

Frontend
│
└── JavaScript

Backend
│
├── Java
├── PHP
├── Python
└── C#

Esto implicaba:

Dos lenguajes.
Dos equipos especializados.
Mayor tiempo de desarrollo.
Mayor coste de mantenimiento.

Con Node.js apareció la posibilidad de utilizar JavaScript en ambos lados.

Frontend
│
└── JavaScript

Backend
│
└── JavaScript (Node.js)

Esto facilitó el trabajo de muchos equipos, aunque no significa que JavaScript sea siempre la mejor opción para el backend.

2. Desarrollo Frontend

Aunque parezca curioso, el uso más común de Node.js para un desarrollador frontend no es crear servidores, sino ejecutar herramientas.

Cuando escribes:

pnpm dev

ocurre algo parecido a esto:

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

Node.js también ejecuta:

Vite
Webpack
Babel
TypeScript
ESLint
Prettier
Vitest
Jest

Sin Node.js, el desarrollo moderno con React sería muy diferente.

3. Desarrollo Backend

Uno de los usos más conocidos.

Con Node.js puedes crear servidores web.

Ejemplo:

import http from "node:http";

const server = http.createServer((req, res) => {
    res.end("Hola Mundo");
});

server.listen(3000);

En proyectos reales suele utilizarse un framework como:

Express
Fastify
NestJS
Hono

Estos frameworks simplifican la creación de APIs y aplicaciones web.

4. APIs REST

Imagina una aplicación React.

Cuando el usuario inicia sesión:

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

Node.js es muy utilizado para desarrollar este tipo de APIs porque maneja muy bien operaciones de entrada/salida (I/O).

5. Aplicaciones en tiempo real

Aquí es donde Node.js destaca especialmente.

Ejemplos:

Chats.
Videojuegos online.
Notificaciones.
Colaboración en tiempo real.
Edición compartida de documentos.
Sistemas de seguimiento en directo.

Ejemplo de un chat:

Usuario A

↓

Servidor Node

↓

Usuario B

Gracias a tecnologías como WebSockets, el servidor puede enviar información a los clientes sin que estos tengan que preguntar constantemente.

6. Microservicios

En lugar de tener una única aplicación enorme, muchas empresas dividen el sistema en pequeños servicios independientes.

Por ejemplo:

                API Gateway
                     │
 ┌──────────┬──────────┬──────────┐
 ▼          ▼          ▼          ▼
Usuarios   Pagos     Pedidos   Notificaciones

Cada servicio puede estar desarrollado con una tecnología distinta.

Node.js es una opción frecuente para servicios que realizan muchas operaciones de red.

7. Automatización

Node.js también se utiliza para crear scripts.

Por ejemplo:

Renombrar miles de archivos.
Generar documentación.
Convertir imágenes.
Leer archivos CSV.
Enviar correos automáticamente.
Generar informes.

Ejemplo:

Script Node

↓

Lee carpeta

↓

Procesa imágenes

↓

Guarda resultados
8. Herramientas de desarrollo

Muchísimas herramientas que utilizas diariamente están escritas en Node.js.

Algunos ejemplos:

Vite
ESLint
Prettier
TypeScript Compiler (tsc)
npm
pnpm
Yarn

Cuando ejecutas:

pnpm lint

o

pnpm build

es Node.js quien ejecuta esas herramientas.

9. Server Side Rendering (SSR)

React puede renderizarse de dos formas.

Renderizado en el navegador (CSR)
Navegador

↓

Descarga JavaScript

↓

React genera el HTML
Renderizado en el servidor (SSR)
Cliente

↓

Servidor Node.js

↓

Genera HTML

↓

Envía HTML al navegador

↓

React se hidrata

Este enfoque ofrece ventajas como:

Mejor SEO.
Primera carga más rápida.
Mejor experiencia en conexiones lentas.

Frameworks como Next.js utilizan Node.js para realizar este tipo de renderizado.

10. ¿Cuándo NO usar Node.js?

Aunque es una herramienta muy potente, no siempre es la mejor elección.

No suele ser la opción ideal para:

Cálculos intensivos

Ejemplo:

Simulaciones científicas.
Procesamiento matemático complejo.
Modelos físicos.

¿Por qué?

Porque esas tareas pueden bloquear el hilo principal.

Procesamiento de vídeo

Ejemplos:

Edición de vídeo.
Conversión de formatos.
Renderizado 3D.

Suelen utilizarse herramientas especializadas o lenguajes como C++ o Rust para estas tareas.

Inteligencia Artificial

Aunque puedes consumir modelos de IA desde Node.js, el entrenamiento y la mayoría de bibliotecas de ciencia de datos están más desarrollados en Python.

11. Casos reales

Piensa en una aplicación como una plataforma de streaming.

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

Node.js puede encargarse de:

API.
Autenticación.
Notificaciones.
Comunicación en tiempo real.

Mientras que otros servicios especializados realizan tareas más exigentes.

¿Qué usarás tú como desarrollador Frontend?

En tu día a día utilizarás Node.js para:

Crear proyectos con React.
Instalar dependencias.
Ejecutar Vite.
Lanzar el servidor de desarrollo.
Compilar la aplicación.
Ejecutar pruebas.
Ejecutar ESLint y Prettier.
Automatizar tareas.

Si más adelante desarrollas backend con Node.js, ya tendrás una base sólida para trabajar con frameworks como Express o NestJS.

Conceptos clave
Node.js se utiliza mucho más que para crear servidores.
Es una pieza esencial del ecosistema moderno de JavaScript.
Destaca en aplicaciones con muchas operaciones de entrada/salida y tiempo real.
Es el motor que permite ejecutar herramientas de desarrollo como Vite o TypeScript.
No es la mejor opción para todas las cargas de trabajo; conocer sus fortalezas y limitaciones es parte de elegir la tecnología adecuada.

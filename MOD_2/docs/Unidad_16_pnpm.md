# Unidad 16 — pnpm

## Objetivos

- Comprender por qué nació pnpm y qué problemas resuelve respecto a npm.
- Entender qué es el Store Global y para qué sirve.
- Saber qué son los Hard Links y los Symlinks, sin profundizar en teoría de sistema de archivos.
- Comparar npm y pnpm con una tabla clara.
- Conocer los comandos principales de pnpm y sus buenas prácticas.

## Requisitos

- Haber trabajado antes con npm e `node_modules` (Unidades anteriores del curso).
- Tener Node.js instalado.
- (Opcional) Tener pnpm instalado para practicar: `npm install -g pnpm`.
- No se requieren conocimientos previos de sistemas de archivos: los enlaces se explican desde cero.

---

## 1. ¿Por qué nació pnpm?

Volvamos a un ejemplo.

Tenemos dos proyectos.

```text
Proyecto A
   ↓
React, Axios, ESLint

Proyecto B
   ↓
React, Axios, Vite
```

Con npm ocurre algo parecido a esto:

```text
Disco duro
│
├── Proyecto A
│      └── node_modules
│            ├── react
│            ├── axios
│            └── ...
│
└── Proyecto B
       └── node_modules
             ├── react
             ├── axios
             └── ...
```

- Hay dos copias de React.
- Dos copias de Axios.
- Dos copias de muchas dependencias.

**¿Cuál es el problema?**

Supongamos que React ocupa **15 MB**.

Y tienes **20 proyectos React**.

Todos utilizan la misma versión.

Con npm tendrás aproximadamente:

```text
20 × 15 MB = 300 MB
```

Solo para React.

Lo mismo ocurre con cientos de paquetes más. Tu disco duro se llena de copias idénticas.

---

## 2. ¿Qué problemas intenta resolver pnpm?

Principalmente tres.

### Espacio en disco

- npm duplica paquetes entre proyectos.

### Velocidad

- Cada instalación requiere copiar muchos archivos.

### Integridad

- Con npm es posible que un paquete acceda accidentalmente a dependencias que no ha declarado (dependiendo de la estructura del árbol de dependencias).
- pnpm fuerza una estructura más estricta, lo que ayuda a detectar errores antes.

---

## 3. ¿Qué es pnpm?

pnpm significa:

**Performant npm** (npm con rendimiento).

- Es un gestor de paquetes compatible con npm.
- Lee el mismo `package.json`.
- Utiliza el mismo registro oficial de npm (npm Registry).

Pero instala las dependencias de una forma completamente distinta.

---

## 4. ¿Cómo instala npm?

Supongamos:

```bash
npm install react
```

El flujo simplificado es:

```text
Descarga React
      ↓
Lo copia
      ↓
node_modules/react
```

Cada proyecto tendrá su propia copia.

---

## 5. ¿Cómo instala pnpm?

Con pnpm ocurre algo diferente.

```bash
pnpm add react
```

Flujo:

```text
Descarga React
      ↓
Lo guarda en un almacén global (Store)
      ↓
Crea enlaces al proyecto
```

Es decir:

```text
        Store Global
             │
             └── React
                   ▲
                   │
 ──────────────────┼──────────────────
                   │
        ┌──────────┼──────────┐
        │          │          │
   Proyecto A  Proyecto B  Proyecto C
```

- Una única copia.
- Muchos proyectos.

---

## 6. El Store Global

Esta es la pieza más importante de pnpm.

Existe una carpeta especial en tu ordenador.

Algo parecido a:

```text
C:\Users\Antonio\AppData\Local\pnpm-store
```

(o la ruta equivalente en Linux o macOS).

Allí pnpm guarda una sola copia de cada versión de cada paquete.

Por ejemplo:

```text
Store
├── React 19.0.0
├── Axios 1.8.0
├── Vite 7.0.0
└── ESLint 9.0.0
```

Nunca volverá a descargarlos mientras esa versión ya exista en el Store.

### Analogía

Imagina una biblioteca.

Con npm sería como si cada estudiante comprara su propio libro:

```text
Alumno A → Libro React
Alumno B → Libro React
Alumno C → Libro React
```

Tres libros iguales.

Con pnpm:

Existe una biblioteca.

Todos consultan el mismo libro.

```text
         Biblioteca
              │
              └── Libro React
                   ▲    ▲    ▲
                   │    │    │
              Alumno A  Alumno B  Alumno C
```

---

## 7. Hard Links

Aquí aparece uno de los conceptos más importantes.

Cuando pnpm instala React en un proyecto...

- no copia los archivos.
- Crea un **Hard Link**.

**¿Qué es un Hard Link?**

Un Hard Link es una segunda referencia al mismo archivo físico.

Imagina un archivo: `React.js`.

Con npm:

```text
Proyecto A
   ↓
Copia React.js

Proyecto B
   ↓
Otra copia React.js
```

Dos archivos.

Con pnpm:

```text
         Store
           │
        React.js
          ▲    ▲
          │    │
     Proyecto A  Proyecto B
```

- Existe un único archivo.
- Los dos proyectos apuntan al mismo.

**Ventajas:**

- Muchísimo menos espacio.
- Instalaciones más rápidas.
- Menos duplicación.

---

## 8. Symlinks

Además de Hard Links, pnpm utiliza **Symlinks** (Enlaces simbólicos).

Los Symlinks funcionan como accesos directos.

Imagina Windows:

```text
Acceso directo
      ↓
   Chrome
```

- No contiene Chrome.
- Solo sabe dónde está.

Eso mismo hace pnpm para construir la estructura de `node_modules`.

---

## 9. ¿Cómo es node_modules con pnpm?

Con npm:

```text
node_modules
├── react
├── axios
├── vite
```

Todo parece estar directamente dentro.

Con pnpm:

```text
node_modules
│
├── .pnpm
│
├── react  -> enlace
├── axios  -> enlace
└── vite   -> enlace
```

Internamente la estructura es bastante más compleja.

Pero para Node.js todo funciona exactamente igual.

**¿Por qué Node.js no nota la diferencia?**

Porque Node.js sigue enlaces simbólicos de forma transparente.

Cuando encuentra `react`, no le importa si es:

- una carpeta real,
- un enlace simbólico,
- un Hard Link.

Simplemente carga el módulo.

---

## 10. Comparativa: npm vs pnpm

| Característica | npm | pnpm |
|---|---|---|
| Registro | npm Registry | npm Registry |
| package.json | ✅ Compatible | ✅ Compatible |
| Lock File | `package-lock.json` | `pnpm-lock.yaml` |
| Espacio en disco | Alto | Muy bajo |
| Velocidad | Buena | Muy alta |
| Duplicación | Sí | No (usa Store) |
| Monorepos | Bueno | Excelente |

---

## 11. Comandos principales

Instalar dependencias:

```bash
pnpm install
```

Añadir una dependencia:

```bash
pnpm add react
```

Dependencia de desarrollo:

```bash
pnpm add -D eslint
```

Eliminar:

```bash
pnpm remove react
```

Actualizar:

```bash
pnpm update
```

Ejecutar scripts:

```bash
pnpm dev
pnpm build
pnpm test
```

No hace falta escribir `run` en los scripts habituales (aunque `pnpm run dev` también funciona).

---

## 12. Monorepos

Aquí es donde pnpm brilla especialmente.

Imagina:

```text
Empresa
│
├── Frontend
├── Backend
├── Shared UI
├── Mobile
└── Design System
```

Con npm podrías terminar con muchas dependencias duplicadas.

pnpm comparte el Store entre todos los paquetes y gestiona las relaciones entre ellos de forma muy eficiente.

Por eso herramientas como Turborepo y Nx suelen recomendar su uso.

---

## 13. Errores comunes

### Error 1: Mezclar los dos gestores en el mismo proyecto

**Qué ves:** en el repo hay a la vez `package-lock.json` (de npm) y `pnpm-lock.yaml` (de pnpm), y los installs dan resultados distintos según quién lo ejecute.

**Por qué pasa:** alguien instaló con npm y otro con pnpm, o se clonó un proyecto y se ejecutó el comando equivocado por costumbre.

**Cómo evitarlo:** elige un gestor por proyecto y úsalo de forma coherente. Elimina el lock file que no corresponda. Si el equipo usa pnpm, instala y actualiza siempre con pnpm.

### Error 2: No versionar pnpm-lock.yaml en Git

**Qué ves:** el `pnpm-lock.yaml` está en `.gitignore`; tus compañeros instalan versiones distintas de las mismas dependencias y "en mi máquina funciona".

**Por qué pasa:** se copia el hábito de ignorar archivos generados, pero el lock file **debe** ir al repositorio: es lo que garantiza que todos instalen exactamente las mismas versiones.

**Cómo evitarlo:** versiona siempre el `pnpm-lock.yaml` en Git (y nunca el `node_modules`).

### Error 3: Ejecutar un script como si fuera npm

**Qué ves:** escribes `npm run dev` dentro de un proyecto con pnpm, o `pnpm run` falla porque cambió la instalación.

**Por qué pasa:** costumbre de npm; además, si instalaste con un gestor y ejecutas scripts con otro, puedes acabar usando una instalación incompleta.

**Cómo evitarlo:** dentro de un proyecto con pnpm, instala con `pnpm install` y ejecuta scripts con `pnpm dev`, `pnpm build`, etc. Lee el `README` del proyecto para confirmar qué gestor recomienda.

### Error 4: Borrar o vaciar el Store Global "para liberar espacio"

**Qué ves:** borras la carpeta del Store creando que es un residuo temporal.

**Por qué pasa:** se confunde la caché con basura; en realidad el Store es la base del ahorro de espacio y velocidad de pnpm.

**Cómo evitarlo:** no lo borres a mano. Si necesitas limpiar, usa el comando oficial de pnpm para la caché y ten en cuenta que la próxima instalación tardará más mientras se vuelve a poblar el Store.

---

## 14. Buenas prácticas

- Usa pnpm en proyectos nuevos siempre que el equipo esté de acuerdo.
- No mezcles `package-lock.json` y `pnpm-lock.yaml`; utiliza solo el correspondiente al gestor elegido.
- Versiona siempre el `pnpm-lock.yaml` en Git.
- Aprovecha `pnpm dlx` para ejecutar herramientas de forma temporal (el equivalente a `npx`).
- Familiarízate con la estructura de `node_modules`, aunque sea más compleja internamente.

---

## Conceptos clave

- pnpm utiliza el mismo `package.json` que npm.
- Descarga los paquetes una única vez y los almacena en un **Store Global**.
- Usa **Hard Links** para evitar duplicar archivos (referencias al mismo archivo físico).
- Usa **Symlinks** (accesos directos) para construir la estructura de `node_modules`.
- Consume menos espacio y suele instalar dependencias más rápido que npm.
- Su lock file es `pnpm-lock.yaml` (no confundir con `package-lock.json`).
- Es una opción excelente para proyectos grandes y monorepos.

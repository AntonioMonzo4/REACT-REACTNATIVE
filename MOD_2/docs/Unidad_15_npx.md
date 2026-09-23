# Unidad 15 — npx

## Objetivos

- Entender por qué surgió npx y qué problema resuelve.
- Saber qué es npx y cómo funciona por debajo.
- Distinguir las tres formas de usar una herramienta: global, local y temporal.
- Diferenciar claramente npm (gestiona paquetes) de npx (ejecuta paquetes).
- Detectar y evitar los errores más comunes al usar npx.

## Requisitos

- Tener Node.js y npm instalados (npx viene incluido con npm desde la versión 5.2).
- Haber abierto una terminal y haber ejecutado algún comando básico de npm (por ejemplo `npm install`).
- No se necesita experiencia previa con npx: se explica desde cero.

---

## 1. El problema antes de npx

Imagina que quieres crear un proyecto React.

Hace unos años hacíamos algo como esto:

```bash
npm install -g create-react-app
```

Después:

```bash
create-react-app mi-app
```

Funcionaba.

Pero tenía varios problemas.

### Problema 1: Herramientas desactualizadas

Supongamos que instalaste:

```bash
npm install -g create-react-app
```

Hace un año.

Hoy ejecutas:

```bash
create-react-app mi-app
```

Y sigues utilizando la versión instalada hace un año, salvo que la actualices manualmente.

**¿Por qué pasa esto?** Porque la instalación global guarda una copia fija de la herramienta en tu sistema. Nadie la actualiza sola: tú tendrías que volver a ejecutar `npm install -g create-react-app` para conseguir la versión nueva. Mientras tanto, todos tus proyectos nuevos nacen con una plantilla vieja.

### Problema 2: Contaminación del sistema

Cada herramienta instalada globalmente ocupa espacio.

Con el tiempo podrías terminar con:

```text
Sistema
├── create-react-app
├── vite
├── eslint
├── typescript
├── prettier
├── firebase-tools
├── expo-cli
└── ...
```

Muchas de ellas quizá ya no las utilices.

**¿Por qué es un problema?** Cada herramienta global ocupa disco, puede conflictuar versiones entre sí y, encima, la mayoría solo la necesitas unos minutos (por ejemplo, la que crea un proyecto nuevo). Después ya no vuelves a usarla… pero sigue ahí para siempre.

### La solución

En lugar de instalar una herramienta para siempre...

¿Y si solo la descargamos cuando la necesitemos?

Ahí nace **npx**.

---

## 2. ¿Qué es npx?

**npx** es una herramienta incluida con npm que permite ejecutar paquetes sin necesidad de instalarlos globalmente.

Por ejemplo:

```bash
npx create-vite@latest
```

Aunque nunca hayas instalado Vite.

¿Cómo puede funcionar?

Parece magia.

Pero internamente no lo es: simplemente npx descarga el paquete a una caché temporal, lo ejecuta y listo.

---

## 3. ¿Cómo funciona?

Cuando escribimos:

```bash
npx create-vite@latest
```

ocurre algo parecido a esto:

```text
Terminal
   ↓
  npx
   ↓
¿Está instalado localmente en el proyecto?
   ├── SÍ → lo ejecuta
   └── NO → ¿Está instalado globalmente?
                ├── SÍ → lo ejecuta
                └── NO → lo descarga temporalmente
                            ↓
                        lo ejecuta
                            ↓
                        finaliza (se usa la caché la próxima vez)
```

Una vez termina, la herramienta ya no forma parte de tu proyecto como dependencia: no aparece en tu `package.json`.

---

## 4. Tres formas de utilizar una herramienta

### Opción 1: Instalación global

```bash
npm install -g eslint
```

Disponible en cualquier proyecto.

**Problemas:**

- Puede quedarse desactualizada.
- Todas las aplicaciones compartirán la misma versión.

### Opción 2: Instalación local

```bash
npm install -D eslint
```

Solo existe dentro del proyecto.

**Ventajas:**

- Cada proyecto puede utilizar una versión distinta.
- Es la práctica habitual para herramientas de desarrollo.

### Opción 3: Ejecución temporal (npx)

```bash
npx create-vite@latest
```

- No la instalas globalmente.
- Solo la ejecutas cuando la necesitas.

### Comparativa

| Método | ¿Se instala? | ¿Dónde? | ¿Cuándo usarlo? |
|---|---|---|---|
| `npm install -g` | Sí | Sistema | Herramientas de uso continuo (cada vez menos frecuente) |
| `npm install` | Sí | Proyecto | Dependencias del proyecto |
| `npx` | Temporal | Caché temporal | Herramientas de creación o ejecución puntual |

---

## 5. ¿Qué ocurre internamente?

Supongamos:

```bash
npx cowsay Hola
```

Flujo simplificado:

```text
npx
 ↓
Busca cowsay (¿local? ¿global?)
 ↓
No existe
 ↓
Descarga el paquete a la caché temporal
 ↓
Ejecuta el binario
 ↓
Muestra:

 ______
< Hola >
 ------
```

Todo esto ocurre sin añadir `cowsay` a `package.json`.

**Dato útil:** la segunda vez que ejecutes el mismo comando, npx reutiliza lo que ya guardó en la caché y va mucho más rápido.

---

## 6. Casos de uso reales

### Crear un proyecto Vite

```bash
npx create-vite@latest
```

### Crear una aplicación con herramientas modernas

Muchos asistentes de creación de proyectos funcionan de esta forma.

Por ejemplo:

```bash
npx create-next-app@latest
```

o

```bash
npx create-expo-app@latest
```

La idea es la misma: descargar la herramienta más reciente, ejecutarla y terminar.

### Ejecutar una herramienta puntual

También puedes lanzar utilidades que no necesitas mantener instaladas permanentemente.

Ejemplo:

```bash
npx eslint .
```

Aunque, si ESLint ya forma parte de tu proyecto, lo normal es ejecutarlo mediante un script:

```bash
npm run lint
```

---

## 7. Diferencias entre npm y npx

Es una duda muy habitual.

### npm

Gestiona paquetes.

Ejemplos:

```bash
npm install react
npm uninstall react
npm update
```

Su función principal es instalar, eliminar y actualizar dependencias.

### npx

- No instala dependencias en tu proyecto.
- Su objetivo es ejecutar un paquete.

Ejemplo:

```bash
npx create-vite@latest
```

### ¿Y pnpm dlx?

pnpm tiene un comando equivalente:

```bash
pnpm dlx create-vite
```

Hace prácticamente lo mismo que npx.

- Descarga la herramienta temporalmente y la ejecuta.

Si en el futuro trabajas con pnpm, utilizarás con frecuencia `pnpm dlx` en lugar de `npx`.

---

## 8. Errores comunes

### Error 1: Instalar globalmente todo

**Qué ves:**

```bash
npm install -g vite
```

**Por qué pasa:** viendo que Vite se usa en todos los proyectos, parece lógico instalarlo "una vez para siempre" a nivel de sistema.

**Cómo evitarlo:** no es necesario para crear proyectos con Vite. Basta con `npx create-vite@latest` para generar el proyecto; dentro de él, Vite quedará instalado como dependencia local.

### Error 2: Pensar que npx añade paquetes al proyecto

**Qué ves:** ejecutas `npx create-vite@latest` y esperas encontrar `create-vite` dentro de `package.json`.

**Por qué pasa:** se confunde "ejecutar" con "instalar". npx solo usa la herramienta el tiempo que dura la ejecución.

**Cómo evitarlo:** recordar que npx **no** añade paquetes al proyecto. Después de ejecutar:

```bash
npx create-vite@latest
```

no encontrarás `create-vite` en el `package.json` del proyecto recién creado. La herramienta solo se utilizó para generar la estructura inicial.

### Error 3: Confundir el generador con la librería final

**Qué ves:** usas `npx create-vite@latest` y luego buscas `create-vite` como parte de tu app.

**Por qué pasa:** el nombre invita a la confusión: `create-vite` "crea" proyectos con Vite, pero no es Vite en sí.

**Cómo evitarlo:** `create-vite` no es Vite. Es un programa cuya única misión es crear un nuevo proyecto configurado con Vite. Después de generar el proyecto, quien queda instalado como dependencia es `vite`, no `create-vite`.

#### Ejemplo completo

```bash
npx create-vite@latest mi-app
```

```text
npx create-vite@latest mi-app
        ↓
Descarga create-vite
        ↓
Ejecuta el asistente
        ↓
Crea la carpeta mi-app
        ↓
Escribe package.json
        ↓
Añade Vite como dependencia del proyecto
        ↓
Termina
```

- El generador desaparece.
- El proyecto permanece.

---

## Buenas prácticas

- Utiliza npx (o pnpm dlx) para herramientas de creación de proyectos.
- Instala localmente (devDependencies) las herramientas que utilizarás durante el desarrollo, como ESLint o TypeScript.
- Evita instalar globalmente herramientas que cada proyecto puede gestionar por sí mismo.
- Comprueba siempre el comando oficial de la documentación, ya que algunos proyectos recomiendan `pnpm dlx`, otros `npx` y otros incluso `bunx`.

---

## Conceptos clave

- npm **gestiona** dependencias (instala, elimina, actualiza).
- npx **ejecuta** paquetes.
- npx descarga temporalmente una herramienta si es necesario.
- npx no modifica el `package.json` del proyecto cuando ejecuta herramientas puntuales.
- `pnpm dlx` cumple el mismo papel en el ecosistema de pnpm.
- Regla práctica: **crear** un proyecto → npx; **usar** una herramienta a diario → dependencia local.

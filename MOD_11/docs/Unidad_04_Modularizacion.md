# Unidad 04 — Modularización

## Objetivos

- Definir qué es un "módulo" y qué es su contrato.
- Conocer las tres estrategias de modularización y cuándo elige cada una.
- Escribir la estructura `public/` + `internal/` de un módulo.
- Aplicar reglas de ESLint que impidan imports prohibidos entre módulos.
- Evaluar el tamaño de un módulo con los criterios de cohesión y acoplamiento.
- Decidir qué estado va dentro del módulo y qué estado va al store global.

## Requisitos

- Haber leído la [Unidad 02 — Feature Based](Unidad_02_Feature_Based.md) (las features son un tipo de módulo).
- Entender `export` e `import` de módulos de ES.
- Saber qué es un archivo de configuración (aquí, `.eslintrc` / `eslint.config.js`).
- Conocer la idea de store global (M9) ayuda, pero no es imprescindible.

## Qué es

Partir el código en **módulos con contratos claros** (imports permitidos, estado propio, tests).

**Analogía:** piensa en las secciones de una biblioteca. Cada sección (módulo) tiene su catálogo (contrato): "de esta sección solo puedes sacar estos libros (exports)". Si cualquiera pudiera entrar al almacén y sacar lo que quisiera, en cuanto reorganizaran una estantería se perderían mil cosas. El contrato es lo que hace que el sistema escale: puedes rehacer el interior de un módulo sin que el resto del mundo se entere, **siempre que respetes su API pública**.

Un módulo no es solo "una carpeta": es una carpeta **más** sus reglas de convivencia:

| Pieza del contrato | Ejemplo |
|--------------------|---------|
| Qué exporta | `index.js` con `useCarrito` |
| Qué no se importa fuera | `api/clienteInterno.js` es privado |
| Estado propio | el store interno del módulo |
| Tests | `tests/` que solo prueban este módulo |

## Estrategias

| Estrategia | Cuándo |
|------------|--------|
| Por feature (M2) | default en apps de producto |
| Por capa + dominio | herencia de arquitectura empresarial |
| Monorepo / packages | varios apps o libs compartidas (pnpm workspaces, Turbo) |

**Explicación de cada una:**

- **Por feature:** es la recomendación por defecto (y la de la Unidad 02). Cada módulo = un concepto de negocio. Es la que usará el 90% de los proyectos de producto.
- **Por capa + dominio:** algunas empresas heredan estructuras tipo `backend/presentation/...` y las replican en el frontend (`ui/`, `services/`, `domain/` por dominio). Es válida si tu organización ya la usa; no la elijas por moda.
- **Monorepo / packages:** cuando tienes varias apps (web + móvil) o librerías compartidas, cada módulo se convierte en un paquete con su `package.json` (por ejemplo `@miorg/carrito`). Herramientas: **pnpm workspaces** y **Turborepo**.

## Contrato de un módulo

```text
modulo-carrito/
  public/ (index.js)   ← export permitido
  internal/            ← no se importa fuera
  tests/
```

**Qué significa cada parte:**

- `public/` (o directamente el `index.js` de la raíz) es el **escaparate**: lo único que el resto del mundo puede importar. Todo lo que exportes aquí es oficial y prometido.
- `internal/` es el **almacén**: implementación libre. Mañana puedes renombrar, borrar o reescribir todo lo de aquí sin romper a nadie, porque nadie de fuera lo importa.
- `tests/` vive dentro del módulo porque las pruebas son parte de él: si cambias el contrato, las pruebas fallan ahí mismo.

Reglas automatizables con ESLint:

```js
// no-restricted-imports / boundaries
'import/no-restricted-paths': ['error', {
  zones: [
    { target: './src/features/auth/**', from: './src/features/carrito/**' },
  ],
}]
```

**Cómo leer esa configuración:** dice "dado el destino `features/auth/**`, está prohibido importar desde `features/carrito/**`". Es decir: el carrito no puede meterse en el interior de auth. Fíjate en que la regla está escrita como **prohibición**, no como permiso: ESLint es mejor vigilando los límites que declarando los permisos uno a uno. Guarda esta receta: aparece igual en la Unidad 05 y en los READMEs.

## Tamaño de módulo

- **Cohesivo**: todo cambia por la misma razón.
- **Acoplado mínimo**: depende de `shared` y de pocos contratos.
- Si un módulo tiene 2 roles de equipo distintos, probablemente es dos.

**Qué significan esos términos:**

- **Cohesión (todo cambia por la misma razón):** si al tocar `carrito/` siempre acabas tocando también `facturación/`, esos dos "módulos" en realidad son uno mal partido o dos que están pegados. Un módulo cohesivo: cuando cambia una cosa del negocio, cambias una carpeta.
- **Acoplamiento mínimo:** un módulo sano solo importa de `shared/` y de los `index.js` de otros módulos. Si importa 15 cosas de 5 módulos por todos lados, estás ante un plate of spaghetti: cualquier cambio reverbeará por toda la app.
- **Dos equipos, dos módulos:** si Ana (equipo de pagos) y Beto (equipo de catálogo) tienen que leer y editar la misma carpeta, vuestros módulos están mal cortados. La frontera del equipo es una pista excelente de dónde poner la frontera del código (así lo hacen, por ejemplo, las "inverse Conway maneuvers").

## Estado y módulos

- Estado local del módulo → `useState`/store interno.
- Estado compartido → store global (M9) **exponiendo acciones**, no el árbol entero.

**Cómo decidir dónde vive cada estado:**

1. ¿Solo lo usa un componente? → `useState` local. No compliques.
2. ¿Lo usa una feature entera? → hook o store **dentro** de esa feature (`useCarrito`).
3. ¿Lo usan varias features (tema, sesión del usuario)? → store global.

**La regla de oro del store global:** expón **acciones** (`añadirAlCarrito(prod)`), no el árbol entero. Si `features/productos` puede leer y mutar libremente el estado interno del carrito, ya no hay frontera: cualquier pantalla puede corromper cualquier dato. Es como dar a todo el personal la llave del almacén de caja fuerte: mejor que cada uno pida lo que necesita por el mostrador (la acción).

## En el ejemplo

`features/` con fronteras por `index.js` y nota de ESLint boundaries en README.

Mira en `EJEMPLO_ARQUITECTURA` cómo `features/carrito/index.js` es la única puerta de esa feature, y cómo el README del ejemplo recuerda configurar ESLint para que esas fronteras no se violen.

## Errores comunes

**Error 1: Módulos "públicos" que exportan demasiado.**

```js
// ❌ Mal: el index.js exporta hasta el almacén interno
export * from './api/clienteInterno'
export * from './hooks/useCarritoInterno'

// ✅ Bien: solo la API pública
export { useCarrito } from './hooks/useCarrito'
export { CarritoLista } from './components/CarritoLista'
```

**Solución:** revisa cada línea de tu `index.js` y pregúntate "¿de verdad otra feature necesita esto?". Si la respuesta es no, no lo exportes. El `export *` a lo bruto es la forma más rápida de romper el contrato.

**Error 2: Crear módulos de 3 archivos o de 300 archivos.**

```text
src/features/moneda/   ← 1 helper de 4 líneas (módulo de más)
src/features/admin/    ← 300 archivos, 4 responsabilidades (módulo de menos)
```

**Solución:** aplica los criterios de tamaño. Lo de 4 líneas va a `shared/`. Lo de 300 archivos y varios equipos se parte en submódulos (`admin/usuarios/`, `admin/pedidos/`). Un buen tamaño es el que puede describir su responsabilidad en **una frase**.

**Error 3: Estado compartido expuesto "en crudo".**

```jsx
// ❌ Mal: otra feature muta el store como si fuera suyo
dispatch({ type: 'carrito/SET_ITEMS', payload: [] })

// ✅ Bien: la feature expone una acción con significado
dispatch(agregarProducto(prod))
```

**Solución:** la feature define las acciones válidas (agregar, quitar, vaciar). El resto solo las invoca. Así conservas invariantes ("el total nunca es negativo") dentro del módulo dueño del dato.

## Conceptos clave

- **Módulo:** carpeta + contrato (exports permitidos, estado, tests).
- **Contrato:** lo que el módulo promete por fuera; el interior es libre.
- **Estrategias:** por feature (default), por capa, monorepo/packages.
- **`public/` vs `internal/`:** escaparate vs almacén.
- **ESLint boundaries (`import/no-restricted-paths`):** reglas automáticas que impiden imports entre módulos prohibidos.
- **Cohesión:** todo el módulo cambia por la misma razón del negocio.
- **Acoplamiento mínimo:** pocas dependencias, solo hacia `shared` y `index.js` ajenos.
- **Dos roles de equipo ⇒ dos módulos:** la frontera del equipo delata la frontera del código.
- **Acciones vs. estado crudo:** el store global expone intenciones, no mutaciones libres.

## Autoevaluación

**1. ¿Qué debe exportar el `index.js` de una feature?**

<details>
<summary>Respuesta</summary>

Solo la API pública: los componentes, hooks y acciones que otras features realmente necesitan. Los helpers internos, el cliente API privado y los tipos de detalle no se exportan; eso se queda en `internal/`.

</details>

**2. ¿Para qué sirve `import/no-restricted-paths` en ESLint?**

<details>
<summary>Respuesta</summary>

Para automatizar las fronteras: convierte en error de lint los imports que cruzan de un módulo a los internos de otro (por ejemplo, que `carrito` importe de `auth/api/...`). Así nadie puede romper el contrato sin que el `pnpm lint` lo note.

</details>

**3. ¿Cómo detectas que un módulo es demasiado grande?**

<details>
<summary>Respuesta</summary>

Indicios: dos roles/equipos distintos lo editan, contiene varias responsabilidades de negocio o no puedes describirlo en una frase. La solución es partirlo en submódulos con sus propios contratos.

</details>

**4. Tengo el tema (claro/oscuro) usado por toda la app. ¿Lo dejo en `useState` de una feature?**

<details>
<summary>Respuesta</summary>

No. Es estado compartido por varias features, así que va al store global (o a un Context de nivel app) exponiendo acciones claras como `alternarTema()`, no el objeto entero para que cada uno lo muta a su manera.

</details>

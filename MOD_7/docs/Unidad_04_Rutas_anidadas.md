# Unidad 04 — Rutas anidadas

## Objetivos

- Entender **por qué** existen las rutas anidadas (evitar repetir layouts).
- Comprender el rol de `<Outlet />`: dónde y cuándo se pinta el componente hijo.
- Aplicar las 4 reglas de React Router v6 (`index`, paths relativos, layouts en cadena, `element` del padre siempre montado).
- Escribir links relativos (`..`, ruta absoluta) correctamente desde una ruta hija.
- Diagnosticar los 3 errores clásicos (olvidar `Outlet`, path absoluto duplicado, hijo fuera del padre).
- Revisar el ejemplo real: `../EJEMPLO_REACT_ROUTER/src/pages/Dashboard.jsx` + rutas en `App.jsx`.

## Requisitos

- Haber completado **U01** (rutas, `<NavLink>`, `<Outlet>` como concepto) y conocer la idea de layout.
- Conveniente haber visto U02 (params) y U03 (query), aunque no son estrictos para esta unidad.

---

## El problema

Imagina un panel de administración con **layout propio**: un sidebar fijo a la izquierda, una barra superior, y varias páginas dentro (resumen, ajustes, usuarios, reportes…). El sidebar **siempre** debe estar visible mientras navegas por esas páginas.

Sin anidamiento, la solución ingenua sería repetir el layout en cada ruta:

```jsx
// ❌ Sin anidamiento: el layout se repite 3 veces
<Route path="/dashboard" element={<><Sidebar /><Overview /></>} />
<Route path="/dashboard/ajustes" element={<<Sidebar /><Settings /></>} />
<Route path="/dashboard/resumen" element={<><Sidebar /><Overview /></>} />
```

Esto es un desastre por varias razones, y entender **por qué importa** te va a convencer de usar anidamiento:

1. **Duplicación**: si mañana cambias el sidebar (un ícono, un enlace nuevo), tienes que editarlo en 3, 10 o 20 sitios.
2. **Bugs silenciosos**: en una ruta te olvidaste del `className` nuevo y ahí el menú se ve distinto.
3. **Estado del layout perdido**: si el sidebar tuviera estado (abierto/cerrado), al navegar entre páginas se **desmontaría y remontaría** cada vez, y perderías ese estado.
4. **Sin punto único de montaje**: no hay dónde "colgar" una lógica común (proteger la sesión, cargar datos del usuario) para toda la zona.

La solución es **anidar**: un componente *padre* que renderiza el layout una sola vez, y *hijos* que se pintan dentro de él.

---

## `<Outlet />`

La pieza clave es `<Outlet />`. Su funcionamiento es sencillo y conviene memorizarlo:

> **El hijo se pinta donde el padre ponga `<Outlet />`.**

El componente padre (`DashboardLayout`) dibuja su sidebar, su nav, su `<main>`, y en el punto exacto donde escribe `<Outlet />`, React Router **inserta el componente de la ruta hija activa**. Si no hay hijo activo, el `Outlet` queda vacío.

### Definición de rutas

```jsx
<Route path="/dashboard" element={<DashboardLayout />}>
  <Route index element={<Overview />} />          {/* /dashboard */}
  <Route path="resumen" element={<Overview />} />
  <Route path="ajustes" element={<Settings />} />
</Route>
```

Fíjate en tres detalles:

- Las rutas hija van **dentro** del `Route` padre (como hijos entre `<Route>...</Route>`).
- Los `path` de los hijos son **relativos**: `"ajustes"`, no `"/dashboard/ajustes"`.
- El hijo con `index` no tiene `path`: es el que se muestra en la URL exacta del padre.

### El layout completo

```jsx
function DashboardLayout() {
  return (
    <div className="dashboard">
      <nav>
        <NavLink to="resumen">Resumen</NavLink>
        <NavLink to="ajustes">Ajustes</NavLink>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
```

Aquí **qué significa** cada parte:

- `<div className="dashboard">` y `<nav>`: el **layout**, pintado una sola vez mientras estés en cualquier ruta `/dashboard/...`.
- `<NavLink to="resumen">`: links **relativos**; desde `/dashboard` llevan a `/dashboard/resumen`.
- `<main><Outlet /></main>`: el hueco donde aparecerá `Overview` o `Settings` según la URL.

Al visitar `/dashboard/ajustes`, el navegador pinta: el sidebar del padre **una vez**, y dentro del `<main>`, el componente `Settings`. El padre no se desmonta al cambiar de hijo: solo cambia lo que hay dentro del `Outlet`. Por eso el estado del sidebar (si lo tuviera) se conserva.

---

## Reglas clave (React Router v6+)

### 1. `index`: hijo por defecto

La ruta `index` es la que se muestra cuando la URL coincide **exactamente** con la del padre (`/dashboard`, sin nada más). No lleva `path`, solo `element`:

```jsx
<Route path="/dashboard" element={<DashboardLayout />}>
  <Route index element={<Overview />} />
  ...
</Route>
```

Sin `index`, al entrar a `/dashboard` verías el layout… con el `Outlet` vacío (un hueco en blanco). Muchos errores de "mi dashboard abre en blanco" se resuelven aquí.

### 2. Paths relativos: sin repetir `/dashboard`

Dentro del padre, escribe solo el segmento nuevo:

```jsx
<Route path="ajustes" element={<Settings />} />   // → /dashboard/ajustes
```

React Router **une** el path del padre con el del hijo. Escribir `"/dashboard/ajustes"` (absoluto) dentro del padre duplicaría la ruta y la dejaría rota (lo ves en "Errores comunes"). La ventaja práctica: si algún día mueves todo el panel a `/admin`, solo cambias el `path` del padre y los hijos siguen funcionando sin tocarlos.

### 3. Layouts en cadena

Un `<Route>` con `element` **y** con hijos puede anidarse más veces. Ejemplo típico: un layout general, dentro un layout con "crumbs" (migas de pan), dentro un layout de tabs, y al final la página:

```jsx
<Route path="/dashboard" element={<DashboardLayout />}>
  <Route element={<BreadcrumbsLayout />}>
    <Route element={<TabsLayout />}>
      <Route path="ajustes" element={<Settings />} />
    </Route>
  </Route>
</Route>
```

Cada nivel pinta su `Outlet` dentro del siguiente. Se usa para **crumbs**, **tabs**, o cualquier UI compartida por un subconjunto de rutas.

### 4. `element` del padre siempre montado

Mientras haya un hijo activo bajo el padre, el `element` del padre **siempre está montado**. El hijo solo "cambia" dentro del `Outlet`. Consecuencias prácticas:

- Al navegar de `resumen` a `ajustes`, `DashboardLayout` **no** se desmonta (el sidebar no parpadea, su estado sobrevive).
- Si el padre hace un `useEffect` (traer el usuario logueado), no se repite en cada cambio de hijo.

---

## Links relativos

Dentro de rutas anidadas, los `to` pueden ser **relativos** o **absolutos**:

```jsx
// Dentro de /dashboard/ajustes:
<Link to="..">        // sube a /dashboard
<Link to="/dashboard/ajustes">   // absoluto
```

- **`to=".."`** sube **un nivel** respecto a la ruta actual. Desde `/dashboard/ajustes` te lleva a `/dashboard`. Es como el `..` de las carpetas en una terminal: no hardcodeas la estructura completa, y si el prefijo cambia, el link sigue funcionando.
- **`to="/dashboard/ajustes"`** (absoluto) va siempre a esa URL exacta, sin importar dónde estés. Útil cuando quieres un destino fijo e inequívoco (por ejemplo, el logo que siempre debe volver al inicio del panel).

Regla práctica: usa **relativo** dentro de la zona anidada (acoplamiento bajo) y **absoluto** solo cuando necesites el destino exacto sin ambigüedad. También puedes combinar: `to="../ajustes"` para hermanos, `to="../usuarios/5"` para subir y bajar.

---

## Errores comunes

### 1. Olvidar `<Outlet />` → no se ve ningún hijo

**Síntoma:** entras a `/dashboard/ajustes`, la URL cambia, el sidebar se pinta… pero el contenido principal está **en blanco**. No hay error en consola.

```jsx
// ❌ Layout sin Outlet: el hijo no tiene dónde pintarse
function DashboardLayout() {
  return (
    <div className="dashboard">
      <nav>
        <NavLink to="ajustes">Ajustes</NavLink>
      </nav>
      {/* falta <main><Outlet /></main> */}
    </div>
  )
}
```

**Solución:** añadir el `Outlet` en el punto donde debe aparecer el hijo:

```jsx
// ✅
function DashboardLayout() {
  return (
    <div className="dashboard">
      <nav>
        <NavLink to="ajustes">Ajustes</NavLink>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
```

### 2. Path absoluto duplicado dentro del padre → ruta rota

**Síntoma:** al pulsar el enlace, la URL queda rara o llegas a una ruta que no existe / no matchea. A veces se duplica el segmento (`/dashboard/dashboard/ajustes`).

```jsx
// ❌ Path absoluto dentro del padre
<Route path="/dashboard" element={<DashboardLayout />}>
  <Route path="/dashboard/ajustes" element={<Settings />} />
</Route>
```

**Solución:** dentro del padre, escribe el path **relativo** (solo el segmento nuevo):

```jsx
// ✅
<Route path="/dashboard" element={<DashboardLayout />}>
  <Route path="ajustes" element={<Settings />} />
</Route>
```

React Router une `/dashboard` + `ajustes` → `/dashboard/ajustes`.

### 3. Definir el hijo fuera del padre → pierde el layout

**Síntoma:** `/dashboard/ajustes` muestra `Settings`, pero **sin sidebar** (el layout no aparece), o la ruta "no entra" en el layout esperado.

```jsx
// ❌ El hijo está suelto, fuera del Route padre
<Route path="/dashboard" element={<DashboardLayout />}>
  <Route index element={<Overview />} />
</Route>
<Route path="/dashboard/ajustes" element={<Settings />} />
```

**Solución:** mover el hijo **dentro** del `Route` padre, para que React Router lo trate como parte de esa zona y pinte su `element` en el `Outlet` del layout:

```jsx
// ✅
<Route path="/dashboard" element={<DashboardLayout />}>
  <Route index element={<Overview />} />
  <Route path="ajustes" element={<Settings />} />
</Route>
```

---

## Conceptos clave

- El **problema**: repetir el layout (sidebar/nav) en cada ruta → duplicación, bugs y pérdida de estado.
- **`<Outlet />`**: el hijo se pinta exactamente donde el padre ponga su `<Outlet />`.
- **Reglas v6**: (1) `index` = hijo por defecto; (2) paths **relativos** sin repetir `/dashboard`; (3) layouts **en cadena** (crumbs, tabs); (4) el `element` del padre **siempre está montado** mientras haya hijo activo.
- **Links relativos**: `to=".."` sube un nivel; `to="/ruta/absoluta"` va al destino fijo.
- **Errores típicos**: olvidar `Outlet` (hijo invisible), path absoluto duplicado (ruta rota), hijo fuera del padre (pierde layout).
- Ejemplo real: `../EJEMPLO_REACT_ROUTER/src/pages/Dashboard.jsx` (layout + Outlet) con rutas hijas `resumen` y `ajustes` en `App.jsx`.

---

## Autoevaluación

**1. Entras en `/dashboard` y ves el sidebar pero el área de contenido está vacía. ¿Qué revisas primero?**

<details>
<summary>Respuesta</summary>

Que el layout tenga su `<Outlet />` en el sitio correcto. Sin `Outlet`, el hijo no tiene dónde pintarse y el hueco queda en blanco. También conviene comprobar que exista una ruta `index` (o `resumen`) para esa URL exacta.
</details>

**2. Dentro del `Route` de `/dashboard`, ¿qué path escribo para `/dashboard/ajustes`? ¿Por qué?**

<details>
<summary>Respuesta</summary>

`path="ajustes"` (relativo). React Router concatena el path del padre con el del hijo, así que no hay que repetir `/dashboard`. Escribir `"/dashboard/ajustes"` (absoluto) dentro del padre duplica la ruta y la deja rota.
</details>

**3. ¿Qué pasa con el estado del sidebar (p. ej. abierto/cerrado) al navegar de `resumen` a `ajustes`?**

<details>
<summary>Respuesta</summary>

Se conserva. El `element` del padre (`DashboardLayout`) **siempre está montado** mientras haya un hijo activo; solo cambia lo que se renderiza dentro del `<Outlet />`, así que el padre no se desmonta y su estado sobrevive.
</details>

**4. Estoy en `/dashboard/ajustes` y pongo `<Link to="..">`. ¿A dónde lleva? ¿Y si pongo `to="/dashboard"`?**

<details>
<summary>Respuesta</summary>

`to=".."` sube **un nivel** respecto a la ruta actual → `/dashboard` (relativo). `to="/dashboard"` es **absoluto** y también lleva a `/dashboard`, pero sin importar dónde estés; el relativo es más flexible si cambia la estructura.
</details>

---

## En el ejemplo

`../EJEMPLO_REACT_ROUTER/src/pages/Dashboard.jsx` (layout + Outlet) con rutas hijas `resumen` y `ajustes` en `App.jsx`.

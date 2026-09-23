# Unidad 04 — Rutas anidadas

## El problema

Una zona con **layout propio** (sidebar, nav interna) y varias páginas dentro: sin anidamiento repetirías el layout en cada ruta.

## Outlet

El hijo se pinta donde el padre ponga `<Outlet />`:

```jsx
<Route path="/dashboard" element={<DashboardLayout />}>
  <Route index element={<Overview />} />          {/* /dashboard */}
  <Route path="resumen" element={<Overview />} />
  <Route path="ajustes" element={<Settings />} />
</Route>
```

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

## Reglas clave (React Router v6+)

1. **`index`**: hijo por defecto cuando el path del padre coincide exacto.
2. **Paths relativos**: en un hijo, `"ajustes"` → `/dashboard/ajustes` (no hace falta repetir `/dashboard`).
3. **Layouts en cadena**: un `<Route>` con elemento y con hijos puede anidarse más (crumb, tabs…).
4. `element` del padre **siempre** está montado mientras haya hijo activo; el hijo solo cambia dentro del `Outlet`.

## Links relativos

```jsx
// Dentro de /dashboard/ajustes:
<Link to="..">        // sube a /dashboard
<Link to="/dashboard/ajustes">   // absoluto
```

## Errores comunes

- Olvidar `<Outlet />` en el layout → **no se ve ningún hijo**.
- Escribir `<Route path="/dashboard/ajustes">` dentro del padre (path absoluto duplicado) → ruta rota; usa `"ajustes"`.
- Definir el hijo fuera del padre → pierde el layout.

## En el ejemplo

`src/pages/Dashboard.jsx` (layout + Outlet) con rutas hijas `resumen` y `ajustes` en `App.jsx`.

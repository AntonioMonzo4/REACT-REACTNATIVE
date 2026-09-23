# Unidad 03 — Screen Readers y ARIA

## Regla de oro del ARIA

> Si existe un elemento HTML nativo que hace el trabajo, **úsalo**.
> `aria-*` solo rellena huecos.

| Atributo | Cuándo |
|----------|--------|
| `aria-label` | texto accesible invisible (icon-button) |
| `aria-labelledby` / `aria-describedby` | referencias a ids |
| `aria-live="polite"` | cambios asíncronos (toast, total) |
| `aria-live="assertive"` + `role="alert"` | errores urgentes |
| `aria-current="page"` | nav activa |
| `role="status"` | loading informativo |

```jsx
<button aria-label="Buscar">
  <IconLupa />
</button>

<p role="status" aria-live="polite">
  {cargando ? 'Cargando…' : `${n} resultados`}
</p>
```

## Imágenes

```jsx
<img alt="Gráfico de ventas 2024" />       // informativa
<img alt="" />                              // decorativa
// icon decorativo dentro de botón con texto: alt="" y no duplicar
```

## Formularios

```jsx
<label htmlFor="email">Email</label>
<input
  id="email"
  type="email"
  required
  aria-invalid={!!error}
  aria-describedby={error ? 'email-err' : undefined}
/>
{error && <p id="email-err" role="alert">{error}</p>}
```

## Prueba manual

1. Navegar **solo con teclado** una pantalla.
2. Chrome + **VoiceOver/NVDA** (o Accessibility Tree en DevTools).
3. ESLint: `eslint-plugin-jsx-a11y` (opcional pero recomendado).

## Errores comunes

- `aria-hidden="true"` en contenedor con botones enfocables.
- `aria-label` pisa el texto visible (confunde).
- Live region montada y desmontada → anuncios perdidos (mantener nodo).

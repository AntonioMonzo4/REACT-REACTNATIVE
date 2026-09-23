# Unidad 06 — Comparativa y cuándo usar cada uno

## Resumen

| Librería | Modelo | Provider | Mejor para |
|----------|--------|----------|------------|
| **Context** | un valor/objeto | sí | tema, sesión, config global lenta |
| **Redux Toolkit** | store + slices + thunks | sí | apps grandes, equipos, devtools, reglas |
| **Zustand** | store único con selectors | no | medio/grande con poco boilerplate |
| **Jotai** | átomos derivados | opcional | muchos estados chicos independientes |
| Server cache | React Query / SWR | hook | datos de API (fuera del checklist base) |

## Flujo de decisión

```text
¿Los datos vienen de una API y cambian con el tiempo?
  sí → React Query / SWR (+ estado mínimo local)
  no → ¿1–2 valores globales lentos?
          sí → Context
          no → ¿estructura de dominio compleja + equipo?
                  sí → Redux Toolkit
                  no → ¿pocos estados chicos? → Jotai
                        ¿dominio mediano simple? → Zustand
```

## Checklist de migración desde useState/context

1. ¿El estado se necesita en >3 niveles no relacionados → global.
2. ¿Se pierde al navegar → store (o URL/query).
3. ¿Solo se lee, casi no cambia → Context barato.
4. ¿Cambios frecuentes + muchos componentes → selector fino (Zustand/Jotai) o slices (RTK).

## Errores de diseño

- Poner en el store datos **ya disponibles en la URL** (filtros) → duplicidad.
- Copiar el server state al store y olvidar revalidar → datos obsoletos.
- Zustand/Jotai “selectores gigantes” (`useStore(s => s)`) → re-render en cada tecla.

## En el ejemplo

La home de `EJEMPLO_REACT_ESTADO` muestra carrito (RTK), favoritos (Zustand persist) y contador (Jotai) en la misma app.

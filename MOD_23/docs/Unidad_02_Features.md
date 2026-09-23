# Unidad 02 — Features del checklist

## Auth y roles

- Registro / login / logout / reset password (teoría M8, práctica M7 routes).
- Roles: `admin | user`; guard en rutas y **en API**.

```text
/auth/login → token → RequireRole admin en /dashboard/*
```

## CRUD y archivos

- Lista paginada + filtros (query params).
- Formularios validados (M5) + errores servidor (400/422).
- Subida: input file → FormData → endpoint con límite de tamaño/tipo.

## Dashboard

- KPIs de API (fetch + estados loading/error).
- Tablas/gráficos **lazy** (M6/M20).

## Notificaciones

- In-app: cola con `aria-live` + toast.
- (Opcional) SSE/WebSocket desde M17.

## Modo oscuro

- `class="dark"` en `<html>` + Tailwind (M12); persistir en localStorage; respetar `prefers-color-scheme`.

## i18n

- Diccionario ES/EN; `lang` en html; no concatenar oraciones (placeholders).

## Testing

- Unit (hooks/lógica) + componentes + 1 integration del happy path.
- CI obligatorio (M19).

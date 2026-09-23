# Unidad 03 — Code review y trabajo en equipo

## Qué revisar (y en qué orden)

1. **Correctitud** — ¿cumple el ticket y los tests?
2. **Diseño** — ¿sigue arquitectura (M11)? ¿acoplamiento raro?
3. **Seguridad** (M22) — inputs, authz, secrets.
4. **Performance obvia** — N+1, renders en bucle.
5. Estilo (al final; que lo diga Prettier/ESLint, no la review).

## Cómo dar feedback

```text
[Pregunta] ¿Por qué no useMemo aquí?
[Sugerencia] Podríamos extraer esto a un hook de usePedidos()
[Bloqueante] Esto rompe a11y: el div no es enfocable
```

- Prioriza: bloqueante → sugerencia → nit.
- Explica **por qué**, no solo qué cambiar.
- Nada de “LGTM” sin leer si eres reviewer.

## Pull requests

- **Pequeños** (≤ 400 líneas útiles si se puede).
- Descripción: contexto, capturas, how to test.
- Draft PR para early feedback.
- Squash o merge según convenio; borra rama.

## Pair programming

- Roles: driver (escribe) / navigator (dirige).
- Alternar cada 20–30 min.
- Objetivo: compartir contexto, no “uno trabaja, otro mira”.

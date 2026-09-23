# Unidad 03 — JWT y buenas prácticas

## Almacenar tokens (trade-offs)

| Ubicación | XSS | CSRF | Notas |
|-----------|-----|------|-------|
| Cookie httpOnly+SameSite | bajo | mitigado | recomendado SPA misma origen |
| Memory (variable) | medio | bajo | refresh al cargar |
| localStorage | **alto** | bajo | roba con cualquier XSS |

## Claims y validación

- `alg`: rechazar `none`; fijar HS256/RS256 esperado.
- Validar `iss`, `aud`, `exp`, `nbf`.
- Minimizar payload: **no** PII sensible en JWT (es legible).
- `jti` + allowlist/denylist para logout real.

## Rotación y vida útil

```text
access 5–15 min  +  refresh 7–30 d (rotación + reuse detection)
```

- Enviar en body o cookie httpOnly + `Secure` + `SameSite`.
- Rate limit `/login` y `/refresh`.

## Checklist frontend

- [ ] No loguear tokens ni headers Authorization
- [ ] No montar secrets en `VITE_*` / `NEXT_PUBLIC_*`
- [ ] Validar contenido en UI como **no confiable**
- [ ] HTTPS siempre; HSTS en prod
- [ ] Dependencias actualizadas (audit)
- [ ] Errores 401 → redirect login sin bucles
- [ ] Subida de archivos: tipos + tamaño + storage no público sin auth

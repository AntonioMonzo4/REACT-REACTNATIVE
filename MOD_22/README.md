# Módulo 22 — Seguridad

Material del **Módulo 22** del roadmap.

## Contenido

| Unidad | Tema |
|--------|------|
| [01 — XSS y CSRF](docs/Unidad_01_XSS_CSRF.md) | Tipos XSS, CSP, tokens CSRF, SameSite |
| [02 — CORS y OAuth](docs/Unidad_02_CORS_OAuth.md) | Preflight, allowlist, PKCE |
| [03 — JWT prácticas](docs/Unidad_03_JWT_practicas.md) | Almacenamiento, rotación, checklist |

## Práctica

1. En un ejemplo, busca `dangerouslySetInnerHTML` / `innerHTML` y documenta por qué es (o no) seguro.
2. Con una API de ejemplo, provoca un error de CORS y lee el mensaje en DevTools (compara con Postman).
3. Refactor del M8: pasa el access token a memoria y el refresh a cookie httpOnly (simula en docs).
4. Añade a un form `aria-invalid` + validación cliente **y** server (server es la fuente de verdad).
5. Revisa `pnpm audit` en un ejemplo y actualiza si hay advisories.

## Mapa con el README

- [x] XSS
- [x] CSRF
- [x] CORS
- [x] OAuth
- [x] Buenas prácticas con JWT
- [ ] Revisión de seguridad guiada en proyecto — *pendiente*

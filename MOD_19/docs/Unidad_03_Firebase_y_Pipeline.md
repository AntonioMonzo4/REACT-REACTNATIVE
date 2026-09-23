# Unidad 03 — Firebase Hosting y CI → deploy

## Objetivos

- Publicar una SPA Vite en **Firebase Hosting** con `firebase init` y `firebase deploy`.
- Entender `firebase.json` (carpeta pública y rewrites de SPA).
- Cerrar el círculo del **CI/CD de verdad**: push → lint + test + build → deploy automático a preview o producción.
- Pasar el checklist de seguridad y rollback de un pipeline real.

## Requisitos

- Unidades 01 y 02 de este módulo (GitHub Actions; Vercel/Netlify ayudan como referencia).
- Un proyecto Vite con `npm run build` funcionando.
- Node.js instalado; cuenta gratuita de Firebase.

---

## Firebase Hosting

Firebase Hosting es el hosting estático de Google: CDN global, HTTPS automático y canales de preview. Encaja especialmente bien si ya usas **Firebase Auth** o **Firestore**, porque todo queda en el mismo proyecto.

```bash
npm i -g firebase-tools
firebase init hosting   # public: dist, SPA: yes
firebase deploy
```

Paso a paso:

1. `npm i -g firebase-tools` — instala la CLI oficial.
2. `firebase init hosting` — asistente interactivo:
   - **public directory**: `dist` (donde Vite escribe el build),
   - **single-page app**: responde *yes* → configura el rewrite a `index.html`,
   - **GitHub deployment**: opcional, despliegue automático desde un repo.
3. `firebase deploy` — sube el contenido de `dist` a la CDN.

```json
// firebase.json (esquema)
{
  "hosting": {
    "public": "dist",
    "rewrites": [{ "source": "**", "destination": "/index.html" }]
  }
}
```

- `public` es la carpeta que se sirve; `rewrites` es el equivalente al `try_files` de Nginx y al redirect `/*` de Netlify: **todas** las rutas caen en `index.html` para que React Router haga su trabajo.
- Soporta staging/`preview` channels.
  - Además del sitio principal, puedes crear canales tipo `mi-feature` con su propia URL para probar cambios sin tocar producción.
- CDN global; bueno con Firebase Auth/Firestore.

---

## CI/CD de verdad (recomendado)

Hasta aquí has desplegado "a mano" (`firebase deploy`, `vercel --prod`). El siguiente nivel es que **cada push** pase primero por la validación y solo después publique:

```text
push/PR → lint + test + build → (si main) deploy automático a preview/prod
```

Flujo en la práctica:

1. **push / PR** — alguien sube código (o abre un Pull Request).
2. **lint + test + build** — GitHub Actions (Unidad 01) falla el pipeline si algo está rojo; el merge queda bloqueado.
3. **deploy condicional** — solo si el código está en `main` (o se creó un tag), se publica. Los PR pueden ir a un entorno de **preview**.

Ejemplo GitHub Actions → Vercel con token secreto:

```yaml
deploy:
  needs: build
  if: github.ref == 'refs/heads/main'
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - run: npx vercel pull --yes --environment=production
    - run: npx vercel build
    - run: npx vercel deploy --prebuilt --yes --token=${{ secrets.VERCEL_TOKEN }}
```

Anatomía del job:

- `needs: build` — no intenta desplegar si el job `build` (lint/tests) falló.
- `if: github.ref == 'refs/heads/main'` — condición: solo en la rama `main`; en un PR se salta.
- `actions/checkout@v4` — trae el código a la VM.
- `npx vercel pull --yes --environment=production` — baja la config/env de producción del proyecto de Vercel.
- `npx vercel build` — construye con la config de Vercel.
- `npx vercel deploy --prebuilt --yes --token=...` — publica el build ya preparado; el token viene de `${{ secrets.VERCEL_TOKEN}}` (Settings → Secrets and variables → Actions), **nunca** escrito en claro en el repo.

---

## Checklist CI/CD

- [ ] Lint + tests en cada PR (bloquean merge)
- [ ] Deploy preview por PR
- [ ] Producción solo desde `main` o tags
- [ ] Rollback = redeploy de versión anterior
- [ ] Secrets en GitHub/Netlify, nunca en repo

---

## Errores comunes

- Desplegar aunque los tests fallen → el paso `needs: build` (y las protection rules de `main`) existen para que un rojo detenga el proceso; si lo saltas a mano, mandas bugs a producción.
- Token de Vercel/Firebase pegado en el YAML → queda en el historial de git. Solo `${{ secrets.VERCEL_TOKEN }}` desde Settings → Secrets.
- Olvidar el rewrite/`try_files` de SPA al cambiar de plataforma → otra vez 404 en rutas deep-link.
- Deploy desde cualquier rama a producción → sin `if: github.ref == 'refs/heads/main'`, un experimento personal puede publicarse. Restringe producción a `main` o a tags.
- Sin plan de rollback → ten claro que volver atrás es redesplegar el tag/commit anterior; practícalo antes de necesitarlo.

---

## Conceptos clave

| Término | Definición corta |
|---------|------------------|
| Firebase Hosting | Hosting estático con CDN, HTTPS y canales preview |
| `firebase.json` | Config: `public`, `rewrites` de SPA, headers… |
| Rewrite SPA | `** → /index.html` para React Router |
| Preview channel | URL temporal de staging en Firebase |
| Pipeline CI/CD | push → validar → (si main) deploy automático |
| `needs` / `if` | Orden de jobs y condición de rama para desplegar |
| Rollback | Redesplegar la versión anterior si algo falla |
| Secrets | Tokens cifrados en la plataforma, jamás en el repo |

---

## Autoevaluación

1. ¿Qué dos piezas de `firebase.json` hacen falta para que una SPA con React Router funcione?

<details>
<summary>Respuesta</summary>

`"public": "dist"` (la carpeta que se sirve, la del build de Vite) y el `rewrites` `** → /index.html` para que cualquier ruta caiga en el `index.html` y React Router haga el enrutado en el cliente.
</details>

2. Explica el flujo "push/PR → lint + test + build → (si main) deploy" con tus palabras.

<details>
<summary>Respuesta</summary>

Cada push o PR dispara la validación automática (lint, tests, build). Si algo falla, no se avanza. Solo cuando el cambio está en `main` (o en un tag) se ejecuta el paso de despliegue a preview o producción. Así la rama principal siempre está publicable.
</details>

3. ¿Para qué sirve `needs: build` en el job `deploy`?

<details>
<summary>Respuesta</summary>

Establece que `deploy` solo se ejecuta después (y si termina bien) el job `build`. Si los tests fallan, `deploy` no corre y no se publica el código roto.
</details>

4. ¿Dónde guardo el `VERCEL_TOKEN` y qué pasa si lo pego en el YAML?

<details>
<summary>Respuesta</summary>

En *Settings → Secrets and variables → Actions* de GitHub y se lee como `${{ secrets.VERCEL_TOKEN }}`. Si lo pegas en claro en el YAML queda en el historial de git: cualquiera con acceso podría desplegar en tu cuenta; habría que rotarlo y limpiar el historial.
</details>

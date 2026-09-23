# Unidad 03 — Firebase Hosting y CI → deploy

## Firebase Hosting

```bash
npm i -g firebase-tools
firebase init hosting   # public: dist, SPA: yes
firebase deploy
```

```json
// firebase.json (esquema)
{
  "hosting": {
    "public": "dist",
    "rewrites": [{ "source": "**", "destination": "/index.html" }]
  }
}
```

- Soporta staging/`preview` channels.
- CDN global; bueno con Firebase Auth/Firestore.

## CI/CD de verdad (recomendado)

```text
push/PR → lint + test + build → (si main) deploy automático a preview/prod
```

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

## Checklist CI/CD

- [ ] Lint + tests en cada PR (bloquean merge)
- [ ] Deploy preview por PR
- [ ] Producción solo desde `main` o tags
- [ ] Rollback = redeploy de versión anterior
- [ ] Secrets en GitHub/Netlify, nunca en repo

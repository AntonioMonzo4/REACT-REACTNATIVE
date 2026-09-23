# Unidad 05 — Integration Testing

## Qué es

Varias unidades juntas **tal como se montan en la app**: componente + hooks + store + fetch mockeado.

Ejemplo: formulario de login que llama a `api.login` (mock) y navega / muestra error.

```jsx
test('login fallido muestra error', async () => {
  vi.mock('../src/api', () => ({
    login: vi.fn().mockRejectedValue(new Error('401')),
  }))

  render(<LoginForm />)
  await userEvent.type(screen.getByLabelText(/email/i), 'a@b.c')
  await userEvent.type(screen.getByLabelText(/password/i), 'x')
  await userEvent.click(screen.getByRole('button', { name: /entrar/i }))

  expect(await screen.findByRole('alert')).toHaveTextContent(/401|inválid/i)
})
```

## Capas típicas del curso

| Nivel | Alcance | Velocidad |
|-------|---------|-----------|
| Unit | 1 función/slice | muy rápida |
| Integration | 1 flujo vertical | rápida |
| E2E (Playwright/Cypress) | flujo completo en browser | lenta (fuera del checklist base) |

## Tips

1. Envuelve el **Provider** real (redux/router) en un `renderConProviders` helper.
2. Mockea **solo la frontera** (red), no el dominio.
3. Prioriza flujos de alto valor: login, checkout, CRUD.
4. `cleanup` automático con RTL + globals; no acumules renders.

## Cobertura

```bash
pnpm coverage
```

Objetivo del roadmap: **> 80 %** en el proyecto, pero **cubrir caminos críticos** importa más que el número.

## En el ejemplo

`FormularioLogin.test.jsx` — submit con fetch mockeado (éxito y error).

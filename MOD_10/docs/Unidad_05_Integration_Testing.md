# Unidad 05 — Integration Testing

## Objetivos

- Entender **qué es un test de integración**: varias unidades juntas tal como se montan en la app.
- Montar **flujos reales** (login, CRUD, checkout) con providers, hooks, store y red mockeada.
- Escribir un test de **éxito y de error** de formulario de login con `userEvent` y `findBy*`.
- Crear un helper `renderConProviders` para no repetir el envoltorio de la app.
- Ejecutar `pnpm coverage` e interpretar el objetivo de **> 80 %** con perspectiva (caminos críticos > número).
- Situar unit / integration / E2E en la **tabla de capas** del roadmap.

## Requisitos

- Haber completado **M4–M8** y, muy especialmente:
  - **M7 — React Router** (si el flujo navega tras el login),
  - **M8 — Consumo de APIs** (`fetch`/`axios`, errores 401),
  - **M9 — Gestión de Estado** (si el flujo usa Redux/Context como provider).
- Haber leído **todas las unidades anteriores**: queries y `userEvent` (02), `vi.mock` de red (03) y buenas prácticas de aserción (04).
- **Secuencia entre unidades**: la 05 **cierra el módulo**; el siguiente paso es aplicarlo en tu proyecto real para desbloquear el checklist de cobertura > 80 %.

## Qué es

Varias unidades juntas **tal como se montan en la app**: componente + hooks + store + fetch mockeado.

Ejemplo: formulario de login que llama a `api.login` (mock) y navega / muestra error.

**Analogía**: si el unit test prueba el **pistón** y el integration prueba el **motor montado**, aquí vas más allá: pruebas el **coche en marcha** con la gasolinera simulada (la red mockeada). Compruebas que todas las piezas **colaboran bien**: el formulario dispara el submit, el hook llama a la API falsa, el store guarda el token y la pantalla muestra el error o navega.

**Qué significa "tal como se montan en la app"**: en tu test renderizas el componente **dentro de sus providers reales** (Router, Redux `Provider`, tema, idioma…), no aislado. Si en producción `LoginForm` necesita el store, en el test también va con el store.

**¿Por qué importa?** Muchos bugs **no están en una función**, sino en las **costuras**: el hook no pasó el dato al componente, el reducer olvidó una acción, el error de red no se tradujo a un mensaje. Esos fallos solo aparecen cuando las piezas se conectan... justo lo que cubre esta unidad.

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

Recorrido del test, paso a paso:

| Paso | Código | Sentido |
|------|--------|---------|
| 1. Mockear la frontera | `vi.mock('../src/api', ...)` | El backend no existe; falla a propósito con `401` |
| 2. Montar la UI | `render(<LoginForm />)` | Con los providers que el flujo necesite |
| 3. Rellenar | `userEvent.type(getByLabelText(...))` | Interacción como una persona, con `await` |
| 4. Enviar | `userEvent.click(getByRole('button', ...))` | Dispara el submit real del formulario |
| 5. Esperar | `findByRole('alert')` | El error aparece de forma **asíncrona** |
| 6. Afirmar | `toHaveTextContent(/401\|inválid/i)` | El mensaje visible es el esperado |

**Regla de oro del integration**: mockea **solo la red** (la frontera); deja correr el resto (validaciones, estado, render) **real**.

## Capas típicas del curso

| Nivel | Alcance | Velocidad |
|-------|---------|-----------|
| Unit | 1 función/slice | muy rápida |
| Integration | 1 flujo vertical | rápida |
| E2E (Playwright/Cypress) | flujo completo en browser | lenta (fuera del checklist base) |

Cómo leer esta tabla:

- **Unit** (Unidad 04): una función, sin DOM. Miles de tests en milisegundos.
- **Integration** (esta unidad): un **flujo vertical** (pantalla → hook → API mock → UI), con DOM pero sin navegador real.
- **E2E**: navegador de verdad y backend de verdad; cubre lo máximo pero es **lenta y frágil**. El checklist base del roadmap **no** la exige; queda para el futuro (Playwright/Cypress).

**Estrategia recomendada del pirámide**: muchos unit, una capa generosa de integración sobre los flujos de alto valor, y pocos E2E.

## Tips

1. Envuelve el **Provider** real (redux/router) en un `renderConProviders` helper.
2. Mockea **solo la frontera** (red), no el dominio.
3. Prioriza flujos de alto valor: login, checkout, CRUD.
4. `cleanup` automático con RTL + globals; no acumules renders.

Detalle de cada tip:

1. **`renderConProviders`**: crea un helper que haga `render(ui, { wrapper: AppProviders })`. Así cada test de integración monta **exactamente** el mismo envoltorio que la app real, sin repetir 10 líneas ni olvidar un `Provider` y fallar con un error críptico de contexto.
2. **Solo la frontera**: mockea `api.login`, no la validación del formulario ni el reducer. Si mockeas el dominio, estás probando tus dobles, no tu app.
3. **Alto valor**: dedica integración a lo que duele si se rompe (login, checkout, CRUD), no a la página "Acerca de".
4. **`cleanup`**: con `globals: true` y RTL, cada test desmonta su árbol automáticamente. No acumules `render` dentro de `render` en un mismo test salvo que sea intencionado: cada test arranca de cero.

## Cobertura

```bash
pnpm coverage
```

Objetivo del roadmap: **> 80 %** en el proyecto, pero **cubrir caminos críticos** importa más que el número.

**Qué significa cobertura**: el porcentaje de líneas/ramas de tu código que **ejecutaron** algún test. Un 80 % dice "la mayor parte del código se ejecuta", **no** "todo está bien probado": puedes tener 80 % de líneas ejecutadas con aserciones tontas.

**¿Por qué importa el equilibrio?** Un equipo puede llegar al 90 % testeando *getters* triviales y dejar sin cubrir el cálculo de pagos. Por eso el checklist marca la cobertura > 80 % como **objetivo a medir en el proyecto real** y, a la vez, exige razonar sobre los **caminos críticos** (login, pagos, datos del usuario).

## Errores comunes

### 1. Falta un Provider y el render revienta

```text
Error: useNavigate() may be used only in the context of a <Router> component.
```

**Solución**: envuelve el componente con su provider/router real (idealmente con tu helper `renderConProviders`), no con `render(<LoginForm />)` suelto si depende del contexto.

### 2. El integration mockea el dominio entero

```text
// MOCKEADO de más: no pruebas nada real
vi.mock('../src/validation')
vi.mock('../src/reducer')
```

**Solución**: deja reales la lógica y el estado; mockea **solo la frontera de red** (`api`, `fetch`).

### 3. Aserción inmediata antes de que aparezca el resultado

```text
AssertionError: Unable to find role 'alert'
```

**Solución**: el resultado llega tras la promesa; usa `await screen.findByRole('alert')` (o `waitFor`) en lugar de `getByRole` síncrono.

## Conceptos clave

- **Integration test**: varias unidades juntas **tal como se montan en la app** (componente + hooks + store + red mockeada).
- **Frontera**: lo único que se mockea en integración (red/API); el dominio corre real.
- **`renderConProviders`**: helper que aplica el envoltorio real (router, store) a cada test.
- **Flujos de alto valor**: login, checkout, CRUD.
- **`cleanup` automático**: RTL + globals desmontan entre tests.
- **Capas**: unit (muy rápida) → integration (rápida) → E2E (lenta, fuera del checklist base).
- **Cobertura** con `pnpm coverage`: objetivo **> 80 %**, pero los **caminos críticos** pesan más que el número.
- **En el ejemplo**: `FormularioLogin.test.jsx` — submit con fetch mockeado (éxito y error).

## Autoevaluación

1. **¿Cuál es la diferencia práctica entre un unit y un integration en este curso?**

   <details><summary>Respuesta</summary>

   El **unit** prueba una unidad aislada (función/reducer) sin DOM ni red. El **integration** monta varias piezas **tal como en la app** (componente + hooks + store + providers) y mockea solo la frontera de red para ejercitar un flujo vertical completo.

   </details>

2. **En el test de login, ¿qué se mockea y qué debe correr real?**

   <details><summary>Respuesta</summary>

   Se mockea **solo la frontera**: el módulo `../src/api` (aquí `login` con `mockRejectedValue`). Todo lo demás —validaciones, estado, reducer, render del formulario y las interacciones con `userEvent`— debe correr **real**, si no el test no verifica nada útil.

   </details>

3. **¿Por qué `findByRole('alert')` y no `getByRole('alert')`?**

   <details><summary>Respuesta</summary>

   Porque el mensaje de error aparece **después** de que la promesa del login rechace (es asíncrono). `findByRole` reintenta hasta el timeout hasta que el nodo exista; `getByRole` fallaría de inmediato si aún no está en el DOM.

   </details>

4. **Mi proyecto tiene 85 % de cobertura. ¿Está "probado"?**

   <details><summary>Respuesta</summary>

   No necesariamente. La cobertura solo mide **líneas ejecutadas**, no la calidad de las aserciones. Puede haber tests que ejecuten el código sin comprobar nada relevante, y los caminos críticos (pagos, login) pueden seguir sin validarse. Revisa primero los flujos de alto valor; el número es una guía, no la meta final.

   </details>

# Unidad 06 — Comparativa y cuándo usar cada uno

## Objetivos

- Tener a la vista **las cinco opciones** del módulo en una sola tabla (modelo, Provider, mejor para).
- Aplicar el **árbol de decisión** para elegir librería en un caso concreto sin "elegir la que suena".
- Usar la **checklist de migración** para detectar cuándo un `useState`/Context ya no da abasto.
- Reconocer los **errores de diseño de estado** que ninguna librería arregla (duplicar URL, copiar server state, selectores gigantes).
- Cerrar el módulo con criterio propio: justificar por escrito la elección para tu proyecto (puente al E-commerce pendiente).

## Requisitos

- **M6 — Unidad 01 (Context)** y **M4–M5 — Hooks**: toda la base de estado local y compartido; sin ella la comparación se queda en memorizar nombres.
- **Unidades 01–05 de este módulo**: esta unidad **resume y contrasta** lo ya visto. No aporta APIs nuevas: exige que conozcas las cinco herramientas (Context, RTK store/slice/async, Zustand, Jotai) mínimamente leídas y, idealmente, tocadas en `EJEMPLO_REACT_ESTADO/`.
- **Secuencia**: es el **cierre** del módulo; se lee **después** de las 01–05, no antes. Su autoevaluación es la "prueba final" del M9.

## Resumen

| Librería | Modelo | Provider | Mejor para |
|----------|--------|----------|------------|
| **Context** | un valor/objeto | sí | tema, sesión, config global lenta |
| **Redux Toolkit** | store + slices + thunks | sí | apps grandes, equipos, devtools, reglas |
| **Zustand** | store único con selectors | no | medio/grande con poco boilerplate |
| **Jotai** | átomos derivados | opcional | muchos estados chicos independientes |
| Server cache | React Query / SWR | hook | datos de API (fuera del checklist base) |

### Cómo leer la tabla sin perderse

- **Modelo** = *cómo se organiza* el estado por dentro: un valor (Context), un árbol con rebanadas (RTK), un objeto plano (Zustand), una nube de piezas (Jotai).
- **Provider** = *necesito tocar la raíz de mi app?*: sí en Context/RTK (patrón del M6), no en Zustand, opcional en Jotai (`scope`).
- **Mejor para** no es "mejor que": es **dónde brilla**. Todas resuelven "estado compartido"; cambian el coste en boilerplate, trazabilidad y granularidad de re-renders.
- La última fila (**server cache**) es un recordatorio: gran parte de lo que un principiante intenta guardar en el store **en realidad es estado del servidor**. Saber que React Query/SWR existen evita construir un Redux a mano para eso.

> Analogía de cierre: Context es **repetir un mensaje por megáfono** (rápido, primitivo); RTK es un **libro de contabilidad** con asientos auditables; Zustand es una **pizarra compartida**; Jotai es una **caja de LEGO**. Un buen arquitecto elige por la obra, no por la moda.

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

Recorramos el árbol con un ejemplo de cada rama:

| Situación | Camino | Respuesta |
|-----------|--------|-----------|
| Lista de productos que se refresca sola | fila 1: sí API | React Query (+ `useState` para filtros locales) |
| Tema + sesión que cambian 2 veces al día | fila 2: 1–2 valores lentos | Context |
| E-commerce con 4 devs, stock, cupones, pedidos | fila 3: dominio complejo + equipo | Redux Toolkit |
| Contadores, sidebar, filtros sueltos | fila 4a: pocos estados chicos | Jotai |
| App mediana, 1–2 devs, lógica clara | fila 4b: dominio mediano | Zustand |

Notas de uso:

- El árbol está pensado para **empezar por arriba** (lo más simple que sirve). Subir de escalón es normal; bajar después es caro.
- "Equipo" no es menor: en cuanto dos personas programan a la vez, la **estructura que impone** RTK (actions con nombre, reducers puros, devtools) ahorra discusiones.
- Ninguna rama es un callejón: puedes tener Context para tema **y** Zustand para favoritos en la misma app (de hecho, el ejemplo del módulo hace exactamente eso).

## Checklist de migración desde useState/context

1. ¿El estado se necesita en >3 niveles no relacionados → global.
2. ¿Se pierde al navegar → store (o URL/query).
3. ¿Solo se lee, casi no cambia → Context barato.
4. ¿Cambios frecuentes + muchos componentes → selector fino (Zustand/Jotai) o slices (RTK).

Qué significa cada punto:

1. **Prop drilling visible**: si contas más de tres saltos de props "de mirar, no de usar", ya estás en estado global. No esperes a sufrirlo.
2. **Persistencia/navegación**: si al cambiar de ruta `useState` se reinicia y el usuario *esperaba* conservar el dato, o es de sesión (global de verdad) o vive en la **URL** (filtros, paginación). La URL es un "store" que no se olvida y que se puede compartir.
3. **Lecturas casi estáticas**: el caso de oro de Context (tema, idioma, feature flags): updates lentos, muchos lectores. Barato en código y en re-renders si partes los Contexts.
4. **Granularidad**: aquí es donde fallan Context (todo el `value` refresca a todos) y los selectores perezosos (`useStore(s => s)`). Si hay cambios frecuentes, la respuesta es **selectores finos** (Zustand/Jotai) o **slices** con `useSelector` fino (RTK).

La checklist es **secuencial en la práctica**: recórrela cada vez que notes incomodidad con tu estado actual. El objetivo no es "migrar a X", es **acertar con el escalón mínimo**.

## Errores de diseño

- Poner en el store datos **ya disponibles en la URL** (filtros) → duplicidad.
- Copiar el server state al store y olvidar revalidar → datos obsoletos.
- Zustand/Jotai "selectores gigantes" (`useStore(s => s)`) → re-render en cada tecla.

Profundicemos, porque son los tres fracasos más típicos de una primera app con store:

**1. Duplicar la URL.** El usuario comparte el enlace `?categoria=react&page=2` y el destinatario ve... la primera página, porque tus filtros solo vivían en el store. Regla: **la URL es la fuente de verdad de "dónde estoy y con qué filtro"**; el store, de "qué ha hecho el usuario en esta sesión".

**2. Copiar el servidor al store.** Guardas `productos` en el store y jamás vuelves a pedirlos: si el precio cambia en el backend, tu app miente. Regla: server cache → React Query/SWR (o, al menos, un `fetch` con política de revalidación clara, como el botón "Recargar" del ejemplo).

**3. Selectores gigantes.** `useCartStore((s) => s)` o `useSelector((s) => s)` convierten cualquier cambio en re-render de todo. Regla: **selecciona el trozo mínimo**; deriva lo calculado (derivados Jotai, `useMemo`, selectores RTK) en vez de meterlo en el store.

## En el ejemplo

La home de `EJEMPLO_REACT_ESTADO` muestra carrito (RTK), favoritos (Zustand persist) y contador (Jotai) en la misma app.

Es tu **banco de pruebas comparativo**: mismo usuario, mismos botones, tres filosofías. Ábrelos en paralelo (`src/components/DemoRedux.jsx`, `DemoZustand.jsx`, `DemoJotai.jsx`) y fíjate en cuántas líneas cuesta cada "añadir", cuánta estructura hay alrededor y qué se recarga al tocar cada uno. Esa observación — no la tabla — es la que recordarás en el E-commerce.

## Conceptos clave

- **Tabla maestra**: Context / RTK / Zustand / Jotai / React Query: modelo, Provider y caso ideal.
- **Árbol de decisión**: API cacheada → React Query; 1–2 valores lentos → Context; equipo + dominio → RTK; pocos estados chicos → Jotai; dominio mediano → Zustand.
- **Empezar simple y escalar** es barato al revés no.
- **Checklist**: >3 niveles → global; se pierde al navegar → store o URL; solo lectura → Context; updates frecuentes → selector fino o slices.
- **URL > store** para filtros y paginación compartibles.
- **Server state ≠ client state**: no copies APIs al store y olvides revalidar.
- **Selectores finos** en cualquier librería: el re-render fino es responsabilidad tuya, no de la librería.
- El ejemplo usa **las tres escuelas a la vez**: coexistencia es la norma, no la excepción.

## Autoevaluación

**1. Tu app tiene: tema claro/oscuro, sesión de usuario, favoritos persistidos y una lista de productos de una API. ¿Qué le asignarías a cada herramienta?**

<details><summary>Respuesta</summary>

Tema y sesión → Context (pocos valores, cambios lentos; o Zustand si ya trabajas con él). Favoritos → Zustand con `persist` (sobreviven a F5, como en el ejemplo). Lista de productos de la API → React Query/SWR idealmente; si no está en el checklist, al menos un `fetch` con `status`/`error` y **sin** duplicar lo que la URL o el servidor ya saben. No meterías todo en un único Context ni en un único store gigante.

</details>

**2. Estás dudando entre "todo en un store de Redux" y "seguir con useState + Context". ¿Qué cuatro preguntas de la checklist usas para decidir?**

<details><summary>Respuesta</summary>

1) ¿El estado lo necesitan >3 niveles no relacionados? → si no, no sube a global. 2) ¿Se pierde al navegar y el usuario lo espera conservado? → store o URL. 3) ¿Solo se lee y casi no cambia? → Context barato basta. 4) ¿Hay cambios frecuentes afectando a muchos componentes? → entonces sí selector fino (Zustand/Jotai) o slices (RTK).

</details>

**3. ¿Qué es un "selector gigante" y por qué provoca re-renders en cada tecla?**

<details><summary>Respuesta</summary>

Es un selector que devuelve **casi todo** el estado, p. ej. `useStore(s => s)` o `useSelector(s => s)`. Como crea/referencia un objeto que cambia con cualquier `set`, React considera que el componente consumidor ha de re-renderizarse con **cualquier** acción del store — por ejemplo, cada tecla que actualiza un input global. Solución: seleccionar solo la ruta necesaria y derivar el resto con memoización.

</details>

**4. Anuncia tu elección para el proyecto "E-commerce" pendiente (del checklist del módulo) y justifícala en 3 líneas.**

<details><summary>Respuesta</summary>

Ejemplo de respuesta válida: **Redux Toolkit** para carrito, catálogo y pedidos (dominio con reglas, varios niños y devtools para auditar) + **Context o un átomo Jotai** para tema/sesión + **React Query** si se cachea el catálogo remoto. Lo importante es justificar con el árbol de decisión y la checklist, no con preferencia personal: estructura para reglas de negocio, piezas pequeñas para lo periférico, server cache para el servidor.

</details>

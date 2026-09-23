# Unidad 03 — Code review y trabajo en equipo

## Objetivos

Al terminar esta unidad deberías poder:

- Aplicar un **orden de revisión** (correctitud → diseño → seguridad → performance → estilo) en vez de mirar el diff al azar.
- Escribir comentarios de review clasificados como **bloqueante / sugerencia / nit**, explicando el *por qué*.
- Abrir un **pull request pequeño** con descripción útil: contexto, capturas y cómo probarlo.
- Explicar en qué consiste el **pair programming** y alternar roles *driver*/*navigator* correctamente.
- Entender por qué la revisión de estilo la debe hacer la herramienta (Unidad 02), no una persona.

## Requisitos

- Haber hecho al menos un commit y una rama en Git (el curso ya lo usa en todos los módulos).
- Conocer el concepto de *rama* y *merge* a nivel de `git checkout -b` / `git merge`.
- Tener presente la arquitectura vista en M11 y lo de seguridad de M22 (se referencian, no se re-expliquen).
- **No** hace falta haber recibido nunca una review formal; de hecho, este módulo está pensado para que la primera no duela.

## ¿Leer código ajeno es raro? La analogía del examen

En el colegio corregir tu propio texto es fácil; corregir el de otro *y que no se enfade* es otra habilidad. La code review tiene dos caras:

1. **Revisor**: mira código que no escribió, sin contexto, con prisa → si no tiene método, comenta comillas y se salta el bug.
2. **Autor**: expone su trabajo → si toma los comentarios como ataques personales, la revisión se pudre.

Las reglas de esta unidad existen para que **ambas caras tengan un guion**. El objetivo de una review no es "demostrar que soy mejor", es **que el código que entra al repo principal no rompa nada y sea mantenible**. El producto es del equipo; el código, también.

## Qué revisar (y en qué orden)

1. **Correctitud** — ¿cumple el ticket y los tests?
2. **Diseño** — ¿sigue arquitectura (M11)? ¿acoplamiento raro?
3. **Seguridad** (M22) — inputs, authz, secrets.
4. **Performance obvia** — N+1, renders en bucle.
5. Estilo (al final; que lo diga Prettier/ESLint, no la review).

El orden importa: **primero si funciona y es seguro**, después si es bonito. Un comentario de "faltan comillas" en un PR que además filtra un token es perder el foco.

### 1. Correctitud

- ¿El código hace lo que pide el ticket/la historia?
- ¿Los tests nuevos fallarían si quitas el cambio? (Si no, el test no prueba nada.)
- ¿Hay caminos sin manejar: errores de red, estados vacíos, permisos denegados?

### 2. Diseño

- ¿Sigue la arquitectura de **M11** (carpetas, capas, dónde vive el estado)?
- ¿Acoplamiento raro? Señales: un componente que importa media app, efectos que escriben en tres stores distintos, una "utils" que crece sin control.
- ¿Se podría extraer un hook/componente y dejar la página como orquestadora?

### 3. Seguridad (recordatorio M22)

- Inputs sin sanitizar, `innerHTML`, URLs con datos sensibles.
- Autorización: ¿solo porque la UI oculta un botón significa que el backend lo permite?
- Secrets hardcodeados: tokens, API keys, cadenas de conexión en el diff → **bloqueante inmediato**.

### 4. Performance obvia

- Consultas **N+1**, listas gigantes sin virtualizar.
- Renders en bucle: derivar estado en el render, crear objetos/arrays como defaults de props, `useEffect` con dependencias mal puestas que refetchea sin parar.
- Recuerda: no buscamos micro-optimizaciones; buscamos lo **obvio**.

### 5. Estilo al final

Que lo diga Prettier/ESLint (Unidad 02). Si en la review aparecen comentarios de formato, es señal de que **faltan las herramientas**, no de que falten ojos.

## Cómo dar feedback

```text
[Pregunta] ¿Por qué no useMemo aquí?
[Sugerencia] Podríamos extraer esto a un hook de usePedidos()
[Bloqueante] Esto rompe a11y: el div no es enfocable
```

- Prioriza: bloqueante → sugerencia → nit.
- Explica **por qué**, no solo qué cambiar.
- Nada de “LGTM” sin leer si eres reviewer.

### Las tres etiquetas

| Etiqueta | Significado | Ejemplo | ¿Bloquea el merge? |
|----------|-------------|---------|--------------------|
| **[Bloqueante]** | No puede entrar así: bug, seguridad, roto | "Esto rompe a11y: el div no es enfocable" | Sí |
| **[Sugerencia]** | Mejora clara, puede discutirse | "Podríamos extraer esto a un hook de usePedidos()" | No (pero opina) |
| **[Nit]** | Detallito, estilo/personal | "Nombre más corto para esta variable" | No |

### Frases útiles (y sus alternativas amables)

| Evita | Mejor |
|-------|-------|
| "Esto está mal." | "[Bloqueante] Esto se cae si `items` viene vacío; fallo `Cannot read properties of undefined`. ¿Añadimos guard?" |
| "¿Por qué no useMemo?" (seco) | "[Pregunta] Aquí se recalcula en cada render; ¿mediste que es costoso? Si lo es, `useMemo` ayudaría." |
| "LGTM" (sin leer) | Comenta algo concreto o pide tiempo: "lo reviso mañana con calma" |
| "Estúpido pero…" | Los nits no necesitan adjetivos: "[Nit] ¿`isLoading` en vez de `loadingFlag`?" |

Reglas de oro:

- **Explica el por qué**: "usa `useMemo`" no enseña; "esta lista de 10 000 ítems se recalcula en cada render del padre" enseña y justifica.
- **Nada de “LGTM” sin leer si eres reviewer**: aprobar a ciegas transfiere el riesgo a producción y al autor.
- **Pregunta antes de afirmar**: a veces el autor sabe algo que tú no (requisito raro, limitación de la API).
- **El comentario va al código, no a la persona**: "falta manejar el error" vs "eres negligente con los errores".

## Pull requests

- **Pequeños** (≤ 400 líneas útiles si se puede).
- Descripción: contexto, capturas, how to test.
- Draft PR para early feedback.
- Squash o merge según convenio; borra rama.

### Tamaño

Un PR de 400 líneas útiles (sin contar generado/formateo) ya cuesta de revisar con atención. Si el diff es enorme, parte el trabajo en varios PRs encadenados. **Pequeño = reviable = entra rápido.**

### Descripción mínima

```markdown
## Contexto
Issue #12 — el carrito se vacía al refrescar la página.

## Qué hace
- Persiste las líneas del carrito en localStorage
- Restaura al montar el CartProvider
- Añade tests de load/save

## Cómo probarlo
1. Añade 2 productos
2. Pulsa F5
3. El contador debe seguir en 2

## Capturas
| antes | después |
|-------|---------|
| (gif) | (gif) |

## Riesgos
Shape del estado cambia; migración incluida en `migrateCart()`.
```

### Draft PR

Marca el PR como **borrador** cuando quieres *early feedback* sobre la dirección ("¿este enfoque os cuadra?") sin que nadie lo mezcle. Es la señal social de "aún no está terminado, no pierdáis 30 minutos revisando detalles".

### Merge y ramas

- **Squash**: todo el historial de la rama se resume en un commit → historial limpio; ideal si haces muchos `wip`/arreglos encima.
- **Merge commit**: conserva la historia de la rama; útil cuando la rama representa mucho trabajo ordenado.
- Elige **convenio de equipo**, no criterio personal por PR; y tras mezclar, **borra la rama** (`git branch -d`) para que el tablero no se llene de ramas muertas.

## Pair programming

- Roles: driver (escribe) / navigator (dirige).
- Alternar cada 20–30 min.
- Objetivo: compartir contexto, no “uno trabaja, otro mira”.

| Rol | Quién hace qué |
|-----|----------------|
| **Driver** | Tiene el teclado. Escribe el código *tal cual* lo pide la pareja. |
| **Navigator** | Mira a dos pantallas de distancia: piensa en el diseño, lee la doc, vigila los tests, anticipa el siguiente paso. |

- **Alternad** cada 20–30 min (timer real). Si el *driver* conduce una hora, el *navigator* se desconecta y el pairing muere.
- **Objetivo**: compartir contexto, no “uno trabaja, otro mira”. Al terminar, *dos* personas entienden ese módulo: si mañana falta una, el conocimiento no se pierde (el "camión factor").
- Funciona de remoto con un editor compartido (VS Code Live Share, `tmux`, etc.) y cámara opcional.

## Errores comunes

- **Revisar estilo primero**: consumes el presupuesto de atención del autor en comillas y dejas el bug de seguridad para "otro día" (que no llega).
- **Reviews de 1 500 líneas**: nadie mira eso con lupa; los bugs sobreviven. Parte el PR.
- **Comentarios vagos**: "¿seguro?" o "esto no me gusta" obligan a adivinar. Siempre: qué, por qué, sugerencia.
- **Aprobar sin leer ("LGTM")**: en la Unidad 04 te preguntan qué harías en una empresa; "firmo a ciegas" no es buena respuesta.
- **Tomarse los comentarios como ataques**: el comentario es sobre el *código*. Pregunta, pide contexto, discute la idea; no la persona.
- **Nadie asignado / PR abierto una semana**: asigna revisores y pon un acuerdo de equipo ("las primeras 24 h laborables alguien mira").
- **Discutir formato en la review**: si pasa, faltan Prettier/ESLint → vuelve a la Unidad 02.
- **Pair programming sin rotar**: convierte a una persona en pasajera y a la otra en manivela.

## Conceptos clave

- **Orden de revisión**: correctitud → diseño → seguridad → performance → estilo.
- **[Bloqueante] / [Sugerencia] / [Nit]**: clasificación que evita discusiones sobre "cuán grave es".
- **Feedback con por qué**: sin razón, el comentario es una orden.
- **PR pequeño** (≤ ~400 líneas útiles): reviable, entra antes.
- **Draft PR**: feedback temprano sin merge.
- **Squash vs merge**: convenio de equipo para el historial.
- **Driver / Navigator**: roles del pair programming; se rotan cada 20–30 min.
- **"LGTM" sin leer**: anti-patrón; la review sin lectura no existe.

## Autoevaluación

**1. Enumera el orden en que revisas un diff y justifica por qué empiezas ahí.**

<details>
<summary>Respuesta</summary>

1. **Correctitud** (¿cumple el ticket y los tests?), 2. **diseño** (¿sigue la arquitectura M11?, ¿acoplamiento?), 3. **seguridad** (M22: inputs, authz, secrets), 4. **performance obvia** (N+1, renders en bucle), 5. **estilo** (al final; que lo digan Prettier/ESLint).

Se empieza por correctitud porque es la base: código bonito que no hace lo pedido o que filtra un token no sirve. El estilo va al final porque es lo menos costoso de corregir y ya lo automatizamos en la Unidad 02.

</details>

**2. Convierte este comentario en uno aceptable: "esto está mal hecho".**

<details>
<summary>Respuesta</summary>

Debe indicar **qué**, **por qué** (con el impacto) y, si es posible, **sugerencia**, más la etiqueta:

```text
[Bloqueante] El useEffect no limpia el timer, así que si el componente
se desmonta en medio, el setState corre sobre un componente muerto
(warning en desarrollo y posible fuga). Devolvemos clearTimeout en el
cleanup.
```

</details>

**3. ¿Cuándo se usa un PR en modo Draft y qué esperas de la gente?**

<details>
<summary>Respuesta</summary>

Cuando quieres **early feedback sobre la dirección** (diseño, enfoque, API propuesta) antes de que el código esté pulido, y dejas claro que **no debe mezclarse aún**. Se espera que los revisores comenten a nivel de arquitectura/enfoque, no detalles finos, y que esperen a que marques "ready for review" para la aprobación formal.

</details>

**4. En pair programming, ¿qué hace el navigator mientras el driver escribe? ¿Cuándo se cambian de sitio?**

<details>
<summary>Respuesta</summary>

El **navigator** no mira pasivamente: dirige el diseño, lee documentación/errors, anticipa el siguiente paso y vigila los tests, mientras el **driver** se limita a plasmar en el teclado lo que acuerdan. Se **cada 20–30 min** (con timer) para que ambos mantengan el contexto y ninguna persona quede "desactualizada".

</details>

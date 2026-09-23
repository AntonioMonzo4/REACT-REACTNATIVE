# Unidad 01 — Scrum, Kanban y herramientas

## Objetivos

Al terminar esta unidad deberías poder:

- Explicar con tus palabras qué es Scrum y nombrar sus tres artefactos y cuatro eventos principales.
- Diferenciar cuándo conviene Scrum y cuándo Kanban (y que pueden combinarse).
- Escribir una historia de usuario válida con criterios de aceptación.
- Definir un límite de WIP y explicar por qué reduce el tiempo de entrega.
- Crear un backlog de 10 historias realistas en Jira o Azure DevOps (o en una tabla Markdown, si aún no tienes cuenta).

## Requisitos

- Haber completado los módulos de React **M4–M15**: no se usan aquí, pero las historias que escribas describirán *ese* tipo de funcionalidades (formularios, listas, estado compartido…).
- Un repositorio Git cualquiera de práctica (por ejemplo el del M10) para simular el flujo.
- **No** se requiere experiencia previa en metodologías ágiles, Jira ni Azure DevOps.

## ¿Por qué existe todo esto? La analogía del fogón

Imagina cocinar una cena para ocho personas solo tú, con **un solo fogón**.

- Sin método: pones a calentar diez sartenes a la vez. Nada está listo, todo está a medias, el aceite se quema. Eso es **desarrollo sin límite de trabajo en progreso (WIP)**.
- Con método: eliges tres platos, los haces en orden, sirves, y luego empiezas el siguiente. Llegas antes a la mesa aunque "trabajes igual de rápido".

Scrum y Kanban son dos formas distintas de "decidir qué sartén va al fogón y cuántas a la vez". Ninguna es religión: son herramientas. En entrevistas, lo que se valora es que **entiendas el problema que resuelven**, no que repitas el libro de Scrum.org.

## Scrum (esencial)

Scrum es un marco de trabajo (no una herramienta, no un cargo) para entregar producto por **incrementos** cortos. La idea central: en lugar de planear el proyecto entero durante meses, trabajas en **sprints** de 1–2 semanas y al final de cada uno tienes algo *potencialmente entregable*.

### Artefactos

| Artefacto | Cadencia | Para qué |
|-----------|----------|----------|
| Product Backlog | priorizado | qué se hace |
| Sprint Backlog | por sprint (1–2 sem) | compromiso |
| Incremento | cada sprint | potencialmente shippable |

- **Product Backlog**: la lista *ordenada* de todo lo que el producto podría necesitar. Ordenado = el Product Owner decide qué es lo más importante de trabajar **ahora**. No es un cajón de sastre: si todo es prioridad, nada lo es.
- **Sprint Backlog**: el recorte del Product Backlog que el equipo **se compromete** a terminar en el sprint en curso, más el plan para lograrlo.
- **Incremento**: el resultado terminado al cerrar el sprint: código integrado, probado, listo para revisión. "Potencialmente shippable" no significa que *vaya* a producción cada sprint, sino que *podría* si el Producto lo decidiera.

### Eventos

| Evento | Duración típica | Pregunta que responde |
|--------|-----------------|-----------------------|
| Sprint Planning | 2–4 h (sprint de 2 sem) | ¿Qué haremos y cómo? |
| Daily (diaria) | ≤ 15 min | ¿ algo nos está bloqueando? |
| Sprint Review | 1–2 h | ¿Qué acabó el cliente/patrocinador? ¿Esto es lo que pedía? |
| Sprint Retro | 30–60 min | ¿Cómo trabajamos mejor el próximo sprint? |

Los cuatro eventos existen para **crear inspección y adaptación**. La Daily no es un informe para el jefe: es sincronización entre compañeros. La Retrospectiva no habla del producto, habla del **proceso**: "los PRs tardaban 3 días en revisarse" es tema de retro; "falta una función de exportación" no.

### Definition of Done

- **Definition of Done** explícita del equipo.

La DoD es la lista de condiciones que algo debe cumplir para llamarse "terminado": por ejemplo *código revisado, tests en verde, sin comentarios `TODO` críticos, desplegado en staging*. Sin DoD, cada uno acaba cuando *cree* que acabó, y "terminado" significa cosas distintas para cada persona. Escríbela en equipo y revísala en las retrospectivas.

### Historias de usuario

- Story: “Como … quiero … para …” + criterios de aceptación.

```text
Como comprador,
quiero añadir productos al carrito desde la lista,
para poder pagar varios artículos de una sola vez.

Criterios de aceptación:
- El contador del carrito se incrementa al pulsar "Añadir".
- Si el producto ya está, se incrementa su cantidad (no se duplica la línea).
- El estado sobrevive a un refresh (localStorage) hasta M23/M22.
- El botón es accesible por teclado (Enter/Espacio).
```

La fórmula **"Como…, quiero…, para…"** obliga a nombrar el *valor* (la última parte). Si no sabes escribir el "para…", probablemente nadie necesita la feature. Los **criterios de aceptación** son la parte verificable: se pueden comprobar con tests (M10) o manualmente en la Review.

## Kanban

Kanban nació en fábricas de Toyota: tarjetas (*kanji*) que señalaban "hay sitio para fabricar más de esto". En software se traduce a un **tablero** con columnas y reglas muy pocas:

- Tabla: `Backlog → In progress → Review → Done`.
- **WIP limit** (p. ej. 3 en In progress) para reducir colas.
- Mide lead time / cycle time; no solo “¿terminado?”.

```text
| Backlog | In progress (WIP 3) | Review (WIP 2) | Done |
|---------|---------------------|----------------|------|
| H-07    | H-01                | H-04           | H-00 |
| H-08    | H-02                | H-05           |      |
| H-09    | H-03                |                |      |
| H-10    |  ← ¡lleno! no se    |                |      |
|         |    arrastra nada    |                |      |
```

¿Qué pasa cuando *In progress* está lleno y quieres mover algo desde Backlog? **No puedes**: primero se mueve algo hacia la derecha (alguien termina, alguien revisa). Eso fuerza a ayudar al compañero bloqueado en lugar de empezar otra cosa nueva. El resultado: menos cosas a medias y, contra lo que parece, **más** cosas terminadas por semana.

### Métricas

- **Lead time**: desde que el cliente *pide* la historia hasta que la *usa*.
- **Cycle time**: desde que el equipo *empieza* hasta que *termina*.

Mide ambas y verás el efecto del WIP limit en una gráfica. Decir "hicimos 12 historias" sin lead time es engañoso: puedes rematar 12 cosas pequeñas mientras la importante lleva tres meses en la columna *In progress*.

### Scrum + Kanban

No son excluyentes: muchísimos equipos usan **Scrum con límites de WIP** en el tablero, o Kanban con revisiones periódicas. En una entrevista, una respuesta madura es: "Scrum aporta la cadencia (sprints, retro), Kanban aporta la visualización del flujo y el límite de trabajo en progreso".

## Jira / Azure DevOps

| | Jira | Azure DevOps |
|---|------|--------------|
| Fuerte en | Scrum clásico, filtros JQL | pipelines + boards |
| Errore común | demasiados campos/proyectos | abusar de work items raros |

Práctica: backlog con 10 historias realistas de tu proyecto final; estima (story points o t-shirt).

### Jira (Atlassian)

- **Fuerte en**: Scrum clásico (sprints, burndown, historias con "épicos") y en **filtros JQL** (`project = APP AND status = "In Progress" AND assignee = currentUser()`), que permiten vistas personalizadas muy potentes.
- **Error común**: configurar demasiados campos, tipos de ticket y proyectos "por si acaso". Un Jira con 40 campos obligatorios se vacía a la fuerza y la información deja de ser fiable. Empieza con: Épico → Historia → Tarea → Bug. Nada más.

### Azure DevOps (Microsoft)

- **Fuerte en**: integrar *boards* (tipo Kanban/Scrum), repositorios y **pipelines CI/CD** en el mismo sitio; muy habitual en empresas .NET/Microsoft.
- **Error común**: abusar de *work items* raros (tipos personalizados, campos heredados de procesos antiguos) hasta que nadie sabe qué significa cada fila.

> Nota: cualquiera de las dos sirve para practicar. Si no quieres cuenta todavía, un archivo `backlog.md` con una tabla Markdown cumple el mismo objetivo pedagógico.

## Errores comunes

- **La Daily como estado para un manager**: si explicas qué hiciste ayer durante 15 minutos para una persona, ya no es daily. Habla de *hoy* y de *bloqueos*.
- **Historias sin "para qué"**: "Como usuario, quiero un botón" no dice nada. Sin valor, no se puede priorizar.
- **Criterios de aceptación vagos**: "funciona bien" no es verificable. Usa condiciones comprobables ("el contador muestra 0 al vaciar el carrito").
- **WIP limit decorativo**: poner "WIP 3" y luego tener 7 tarjetas en *In progress* "porque es urgente" es no tener WIP limit.
- **Estimar para prometer fechas**: los story points miden *tamaño relativo*, no días. "3 puntos = 2 días" es un anti-patrón que rompe la métrica para siempre.
- **Retro sin acuerdos**: una retrospectiva que no produce 1–3 acciones concretas para el próximo sprint es una charla.
- **Demasiados proyectos/tipos en Jira desde el día uno**: la herramienta se vuelve un obstáculo.

## Conceptos clave

- **Sprint**: corte de 1–2 semanas con un compromiso y un incremento.
- **Backlog priorizado**: lista ordenada por valor/urgencia, no un vertedero.
- **Historia de usuario**: “Como … quiero … para …” + criterios de aceptación verificables.
- **Definition of Done**: condiciones explícitas para que algo se llame terminado.
- **WIP limit**: máximo de tarjetas en una columna; reduce colas y acelera el flujo.
- **Lead time / cycle time**: métricas de flujo; miden espera real, no "sensación" de productividad.
- **JQL**: lenguaje de consulta de Jira para filtros.
- **Story points / t-shirt sizing**: estimación relativa de tamaño, no de tiempo.

## Autoevaluación

**1. Menciona los tres artefactos de Scrum y para qué sirve cada uno.**

<details>
<summary>Respuesta</summary>

- **Product Backlog**: lista priorizada de todo lo que el producto podría necesitar → "qué se hace" y en qué orden.
- **Sprint Backlog**: recorte que el equipo se compromete a terminar en el sprint → "compromiso".
- **Incremento**: resultado integrado y probado al cerrar el sprint → "potencialmente shippable".

</details>

**2. ¿Qué problema concreto resuelve un límite de WIP de 3 en la columna *In progress*?**

<details>
<summary>Respuesta</summary>

Impide que haya más de 3 tareas empezadas a la vez. Eso reduce colas y "trabajo a medias", obliga a ayudar a quien está bloqueado antes de arrastrar algo nuevo y baja el *cycle time*. Sin límite, muchas tareas empiezan y ninguna termina: todo el mundo "está ocupado" pero nada sale.

</details>

**3. Escribe una historia de usuario aceptable para una feature de tus módulos previos (M4–M15) e incluye dos criterios de aceptación.**

<details>
<summary>Respuesta</summary>

Ejemplo:

```text
Como visitante de la tienda,
quiero filtrar productos por categoría,
para encontrar rápido lo que me interesa sin recorrer todo el catálogo.

Criterios de aceptación:
- Al elegir una categoría solo se muestran sus productos (los demás se ocultan).
- La URL refleja el filtro seleccionado (ej. ?cat=zapatos).
- Si no hay resultados aparece un mensaje vacío accesible (role/aria-live).
```

</details>

**4. ¿Cuál es la diferencia entre *lead time* y *cycle time*?**

<details>
<summary>Respuesta</summary>

- **Lead time**: desde que la petición existe (entra al backlog / la pide el cliente) hasta que está usada/entregada. Incluye la espera *antes* de empezar.
- **Cycle time**: desde que el equipo *empieza* a trabajar en ella hasta que la termina.

Lead time ≥ cycle time siempre; la diferencia es la cola de espera previa.

</details>

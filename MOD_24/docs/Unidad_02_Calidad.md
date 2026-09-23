# Unidad 02 — Calidad de código

## Objetivos

Al terminar esta unidad deberías poder:

- Instalar y configurar **Prettier**, **Husky**, **lint-staged** y **commitlint** en un repositorio real.
- Explicar la diferencia entre lo que hace ESLint y lo que hace Prettier (y por qué conviven).
- Escribir mensajes de commit que sigan la convención *conventional commits*.
- Comprobar que los hooks de Git **fallan** cuando el código no cumple las reglas.
- Redactar una descripción de PR útil (contexto, capturas, cómo probarlo).

## Requisitos

- Tener **Git** funcionando en tu máquina y un repositorio de práctica (por ejemplo `MOD_10/EJEMPLO_REACT_TESTING` o cualquier ejemplo del curso).
- Node.js y un gestor de paquetes (`pnpm` en los ejemplos; `npm`/`yarn` funcionan igual cambiando el comando).
- Haber visto ESLint en los módulos previos (ya viene en los ejemplos del repo). Aquí **no** se reinstala ESLint desde cero; se le pone compañía: formateo, hooks y convención de commits.
- **No** hace falta haber trabajado nunca en un equipo con CI/CD.

## ¿Por qué esto no es "tontería de formato"? La analogía del semáforo

Dos personas conduciendo sin semáforo en un cruce: cada una asume que la otra cede… y chocan. El semáforo no mejora la conducción de nadie; **elimina la necesidad de adivinar**.

La calidad automatizada hace lo mismo con el código:

- **Prettier** decide dónde van los saltos de línea y las comillas: nadie discute si van a 80 o 100 caracteres; el archivo ya sale igual.
- **ESLint** decide qué patrones son errores y cuáles estilo.
- **commitlint** decide qué formato tiene el mensaje de commit: el *changelog* se puede generar solo.
- **Husky + lint-staged** ponen el semáforo *antes* de que el commit entre al repositorio: si algo no cumple, no entra.

El resultado: el equipo deja de discutir estilo en la code review (Unidad 03) y dedica esa energía a lógica, seguridad y diseño.

## Stack mínimo

| Herramienta | Rol |
|-------------|-----|
| **ESLint** | errores + estilo (ya en todos los ejemplos) |
| **Prettier** | formato canónico (`printWidth: 80/100`) |
| **Husky** | hooks git (`pre-commit`) |
| **lint-staged** | lint solo de archivos staged |
| **commitlint** | convención de mensajes (`feat:`, `fix:`) |

### Cómo encajan entre sí

```text
git commit
   │
   ├─► hook commit-msg ──► commitlint ──► ¿mensaje válido? (feat:, fix:…)
   │
   └─► hook pre-commit ──► lint-staged ──► solo archivos AÑADIDOS al commit
                                           ├─► eslint --fix
                                           └─► prettier --write
```

- **ESLint** (static analysis): detecta `unused variables`, promesas sin `catch`, hooks de React mal usados… Puede *autocorregir* parte de los problemas (`--fix`).
- **Prettier** (formatter): no piensa sobre tu lógica; solo imprime el mismo AST con un estilo único. No debatas comillas con Prettier: es un programa, gana él.
- **Husky** ejecuta scripts en los hooks de Git (`pre-commit`, `commit-msg`). *Husky* = "cerdo" en inglés; los hooks son "arnés" para tu cerdo… el nombre es un chiste interno, lo importante es que **bloquea commits sucios**.
- **lint-staged** evita el coste de lintear todo el repo en cada commit: solo toca lo que estás enviando.

## Configuración típica

### 1. Instalar dependencias

```bash
pnpm add -D prettier husky lint-staged @commitlint/cli @commitlint/config-conventional
npx husky init
```

> `npx husky init` crea la carpeta `.husky/` y un `pre-commit` de ejemplo en los repositorios con Husky v9+. Si tu versión genera otro archivo, revisa la doc oficial de Husky para tu versión; el objetivo es el mismo: que exista `.husky/pre-commit` ejecutable.

### 2. Plantilla de Prettier

Copia la plantilla incluida en este módulo: [`plantillas/.prettierrc`](../plantillas/.prettierrc) → `.prettierrc` en la raíz de tu repo.

```json
{
  "printWidth": 100,
  "singleQuote": true,
  "trailingComma": "all",
  "semi": true
}
```

Opcional: añade un `.prettierignore` con `node_modules`, `dist`, `pnpm-lock.yaml`.

### 3. Configurar lint-staged

```js
// .lintstagedrc o package.json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{md,json}": ["prettier --write"]
  }
}
```

Equivalente en `package.json` (si prefieres no crear otro archivo):

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{md,json}": ["prettier --write"]
  }
}
```

### 4. commitlint

```js
// commitlint.config.js
module.exports = { extends: ['@commitlint/config-conventional'] }
```

Usa la plantilla del módulo si quieres arrancar: [`plantillas/commitlint.config.js`](../plantillas/commitlint.config.js).

Tipos que acepta la convención por defecto: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.

### 5. Conectar los hooks de Git

```bash
echo "pnpm lint-staged" > .husky/pre-commit
echo "pnpm commitlint --edit \$1" > .husky/commit-msg
```

> En Windows con Git Bash estos comandos funcionan; si usas PowerShell, crea los archivos `.husky/pre-commit` y `.husky/commit-msg` a mano con el mismo contenido. Asegúrate de que Git los trate como texto Unix (sin BOM).

### 6. Comprobar que funciona

```bash
# 1) rompe el formato a mano
echo "const x={a:1}" >> src/App.tsx
git add src/App.tsx
git commit -m "wip"
# => lint-staged ejecuta eslint/prettier, corrige el formato y…
#    o falla el commit si ESLint encuentra un error no corregible

# 2) mensaje inválido
git commit -m "arreglado lo del botón"
# => commitlint rechaza el commit (no empieza por tipo:)

# 3) mensaje válido
git commit -m "fix: corrige el contador del carrito"
# => commit aceptado
```

## Convenios de PR

- `feat: añade carrito persistente`
- Título = tipo + resumen; cuerpo = por qué + capturas.
- Changelog a partir de conventional commits (`standard-version` o CI).

### Anatomía de un buen mensaje de commit

```text
feat: añade carrito persistente

El carrito se perdía al refrescar. Guardamos las líneas en
localStorage y las restauramos al montar el provider.

- añade storage.ts con load/save
- añade tests de redondeo de precios
```

- **Primera línea**: `tipo: resumen en imperativo, ≤ 72 caracteres` ("añade", no "añadido", no "Añadí…").
- **Cuerpo (opcional pero recomendado)**: el **porqué**, no el qué (el *qué* ya está en el diff).

### Anatomía de un buen PR

```text
Título:  feat: añade carrito persistente

Cuerpo:
Contexto:  Issue #12 — el carrito se vacía al refesar.
Qué hago:  persistencia en localStorage + tests.
Capturas:  antes/después (gif o png).
How to test: 1) añade 2 productos 2) F5 3) el contador sigue en 2.
Riesgos:   cambio en el shape del estado; migración incluida.
```

- **Changelog automático**: porque los commits siguen la convención, herramientas como `standard-version` (o un paso de CI) pueden generar `CHANGELOG.md` sin escribirlo a mano.
- Títulos de PR = mismos tipos que commit (`feat:`, `fix:`, `docs:`): así el historial de merge requests también es legible y automatizable.

## Errores comunes

- **Que ESLint y Prettier se peleen**: si ESLint formatea (`semi`, `quotes`, `indent`) y Prettier también, cada `--fix` rompe al otro. Usa `eslint-config-prettier` (desactiva las reglas de formato de ESLint) o elimina esas reglas. Regla práctica: **ESLint decide *qué* está mal; Prettier decide *cómo* se ve**.
- **Olvidar `npx husky init` (o el paso equivalente)**: instalas Husky y crees que protege el repo, pero `.husky/pre-commit` no existe → nada se ejecuta. Verifica con `ls .husky/`.
- **Hooks que no se disparan**: normalmente es permiso de ejecución o un hook vacío. En Unix: `chmod +x .husky/pre-commit`. Comprueba también que no estás haciendo `git commit --no-verify` (eso salta los hooks a propósito).
- **Rutas relativas raras en el hook**: dentro de `.husky/pre-commit` ejecuta el binario del proyecto (`pnpm lint-staged`), no una ruta absoluta de tu equipo.
- **Mensajes de commit tipo "fix", "wip", "cosas", "…."**: commitlint los rechaza y en CI se ve feo. Aprende los tipos: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `build`, `ci`, `revert`.
- **Formatear el repo entero en el mismo commit que una feature**: el diff se vuelve inrevisable. Haz un commit `style:` aparte (o `chore:`) cuando apliques Prettier por primera vez a un módulo antiguo.
- **Committear `node_modules` o un lockfile ajeno**: revisa `git status` antes; la plantilla Prettier/`.gitignore` del repo ya debería ignorarlo.
- **`--no-verify` por costumbre**: usarlo a veces está bien (urgencia real), usarlo siempre es desactivar el semáforo.

## Conceptos clave

- **Formatter vs linter**: Prettier imprime; ESLint analiza. Complementan, no compiten (con `eslint-config-prettier`).
- **`printWidth`**: ancho objetivo del formato (80/100). Es una *preferencia*, no una ley de la naturaleza.
- **Husky**: ejecuta scripts en hooks de Git (`pre-commit`, `commit-msg`).
- **lint-staged**: aplica linters/formatters solo a los archivos del commit en curso.
- **commitlint + conventional commits**: valida el mensaje (`tipo: descripción`).
- **Tipos convencionales**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
- **Changelog automático**: se genera a partir de los commits, por eso el formato importa.
- **`--no-verify`**: salta los hooks; úsalo consciente, no por defecto.

## Autoevaluación

**1. ¿Por qué hacen falta ESLint *y* Prettier si los dos "arreglan" el código?**

<details>
<summary>Respuesta</summary>

Porque hacen cosas distintas. **ESLint** analiza el código: variables sin usar, `any` sospechosos, errores de React/hooks, promesas ignoradas… parte es lógica/seguridad, no formato. **Prettier** solo formatea (sangría, comillas, saltos de línea) sin juzgar tu lógica. Si usas solo Prettier, pasas código "bonito pero malo"; si usas solo ESLint, el estilo sigue a merced de cada desarrollador y las reviews discuten comillas. Con `eslint-config-prettier`, ESLint deja de pelearse con Prettier en las reglas de formato.

</details>

**2. Tras `pnpm add -D husky`, ¿por qué puede ser que los hooks no se disparen?**

<details>
<summary>Respuesta</summary>

Porque instalar la dependencia no basta: hay que inicializar Husky en el repo (`npx husky init` o `husky install` según versión) para crear `.husky/` y sus scripts, y ese scripts tiene que estar marcado como ejecutable. Si `.husky/pre-commit` no existe, está vacío o no tiene permisos de ejecución, Git no ejecuta nada. Verifica con `ls .husky/` y leyendo el archivo.

</details>

**3. Clasifica estos mensajes: `fix:`, `arreglado`, `feat añade login`, `docs: actualiza README`.**

<details>
<summary>Respuesta</summary>

- `fix:` → **válido** (tipo correcto; aunque el resumen quedaría mejor como `fix: corrige…`).
- `arreglado` → **inválido** (sin tipo).
- `feat añade login` → **inválido** en commitlint convencional: falta los dos puntos (`feat: añade login`).
- `docs: actualiza README` → **válido**.

</details>

**4. ¿Qué ganas con lint-staged en lugar de ejecutar ESLint/Prettier sobre todo el repo?**

<details>
<summary>Respuesta</summary>

Velocidad y foco: solo se procesan los archivos **ya staged** (los que entran en este commit), no miles de archivos de `node_modules`, `dist` o módulos intocados. Un commit tarda milisegundos en lugar de minutos, y no introducimos cambios de formato no relacionados en el diff.

</details>

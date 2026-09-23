# Unidad 01 — XSS y CSRF

## Objetivos

Al terminar esta unidad serás capaz de:

- Explicar qué es XSS y distinguir sus tres tipos (reflected, stored, DOM-based) con un ejemplo de cada uno.
- Saber por qué React escapa el texto por defecto y en qué situaciones concretas pierdes esa protección.
- Configurar (o al menos leer) una cabecera **CSP** básica.
- Explicar qué es CSRF y por qué una cookie autenticada puede convertirse en un arma.
- Elegir entre SameSite, token CSRF o Bearer JWT según el caso, entendiendo el trade-off de cada opción.

## Requisitos

- Haber completado el Módulo 4 al 15 a nivel de lectura de componentes React (JSX, props, estado).
- Conocer a nivel usuario qué es una cookie y una sesión de login (M8 basta).
- Tener DevTools del navegador a mano para inspeccionar headers y storage.
- **No** se requiere experiencia previa en seguridad ni conocimientos de criptografía.

---

## ¿Por qué empieza la seguridad por aquí?

Imagina que tienes la puerta de tu casa impecable (tu aplicación "funciona"), pero dejas una ventana abierta con un cartel que dice *"aquí se entra fácil"*. XSS y CSRF son esas dos ventanas. No son fallos exóticos: son, año tras año, dos de los vectores más comunes en la web, y la buena noticia es que se entienden perfectamente sin ser experto.

La idea clave de toda la unidad es esta: **nunca confíes en lo que llega desde fuera**. Texto de un usuario, parámetros de una URL, contenido de una base de datos escrita por terceros... todo eso es *dato*, no *instrucción*, y solo debe tratarse como dato.

---

## XSS (Cross-Site Scripting)

XSS significa *Cross-Site Scripting*: un atacante consigue que tu navegador ejecute **su JavaScript** dentro de tu página, con las mismas credenciales y permisos que la tuya. Piensa en ello como un actor que se cuela en una obra de teatro y empieza a dar órdenes al público: el escenario (tu app) sigue en pie, pero quien da las órdenes ya no eres tú.

¿Qué puede hacer ese script robado? Bastante: leer lo que el usuario escribe (contraseñas en formularios), robar el token de sesión del `localStorage`, realizar acciones en su nombre (transferencias, cambiar email), o incluso mostrar un formulario falso de login para capturar credenciales.

### Los tres tipos de XSS

La clasificación clásica se basa en **cómo llega el payload** (el código malicioso) hasta la víctima:

| Tipo | Cómo | Defensa |
|------|------|---------|
| **Reflected** | payload en URL → respuesta | sanitizar output, CSP |
| **Stored** | guardado en BD y servido | sanitizar al guardar/leer |
| **DOM-based** | JS de la página usa input peligroso | no `innerHTML` con datos de usuario |

Vamos a ver cada uno con calma, porque las palabras abstractas no se quedan en la memoria, pero los ejemplos sí.

#### 1. XSS reflejado (*reflected*)

El atacante mete el código malicioso en un **parámetro de la URL** y convence a la víctima de que haga clic en ese enlace. El servidor recibe la petición, la "refleja" en la respuesta (por ejemplo, en un mensaje de error que repite el texto buscado) y el navegador la ejecuta como si fuera parte de la página.

```
https://tu-app.com/buscar?q=<script>robarCookies()</script>
```

Si el servidor responde con *«No encontramos resultados para `<script>...</script>`»* sin escapar nada, el script se ejecuta. Es el más fácil de detectar y el que más depende de que el servidor sanee su salida.

#### 2. XSS almacenado (*stored*)

El payload **se guarda** (normalmente en una base de datos: comentarios, bios de perfil, nombres de producto, tickets de soporte) y se sirve a **todos** los que visiten esa sección. Es el más peligroso: la víctima no tiene que hacer nada raro, basta con que entre a la página donde se muestra el dato contaminado.

Ejemplo clásico: un comentario de blog que en realidad contiene `<img src=x onerror="...">`. Todos los visitantes del post ejecutan el código.

#### 3. XSS basado en DOM

Aquí el servidor puede estar perfectamente saneado: el culpable es el **propio JavaScript del navegador**. La página toma algo peligroso de la URL, del `document.referrer` o de `postMessage` y lo escribe en el DOM con un método inseguro (`innerHTML`, `document.write`, `insertAdjacentHTML`...).

```
Página lee location.hash → la mete en innerHTML → XSS sin que el servidor participe
```

En una SPA de React esto es más común de lo que parece: cualquier `useEffect` que haga `element.innerHTML = window.location.search` es una puerta abierta.

### React ya escapa... ¿de verdad?

React escapa automáticamente el texto que renderizas entre llaves. Eso significa que, en el 95 % de los casos, estás protegido sin hacer nada. El problema es el 5 % restante: cuando decides **tú** inyectar HTML a mano.

```jsx
// Peligroso
<div dangerouslySetInnerHTML={{ __html: commentFromUser }} />

// Seguro por defecto (React escapa texto)
<p>{commentFromUser}</p>
```

Fíjate en el nombre: React lo ha bautizado como `dangerouslySetInnerHTML` («establecer HTML *peligrosamente*») precisamente para que pienses dos veces antes de usarlo. Si `commentFromUser` contiene `<img src=x onerror="alert(document.cookie)">`, en la primera línea se ejecuta; en la segunda, se muestra como texto literal y el navegador no hace nada.

**Regla práctica:** si el dato viene de un usuario, de una URL, de una API de terceros o de una base de datos que editan humanos, trata el HTML como veneno. `{texto}` sí, `dangerouslySetInnerHTML` casi nunca.

Si necesitas HTML rico (Markdown, editor de rich text, bios con negritas): allowlist (p. ej. DOMPurify), nunca confiar en el cliente.

DOMPurify funciona como un filtre de café para HTML: entra todo el marcado, salen solo las etiquetas y atributos de una lista blanca segura (`<b>`, `<i>`, `<a href>` saneado...) y se descarta cualquier `<script>`, `onerror`, `javascript:` y demás. Importante: la lista blanca se aplica **en el servidor o en el cliente justo antes de renderizar**, pero la última palabra de confianza siempre es el servidor. El cliente puede ser manipulado por el propio atacante.

```jsx
import DOMPurify from 'dompurify';

// Solo si realmente necesitas HTML rico
<div
  dangerouslySetInnerHTML={{
    __html: DOMPurify.sanitize(commentFromUser),
  }}
/>
```

### CSP: la red de seguridad del navegador

**CSP** (*Content Security Policy*) es un header HTTP donde tú dices al navegador: *«dentro de mi app solo se permite ejecutar esto, cargar recursos de aquí y nada más»*. Es la capa de contención que reduce el daño aunque logre colarse un payload.

```http
Content-Security-Policy: default-src 'self'; script-src 'self'; object-src 'none'
```

Traducción línea a línea:

- `default-src 'self'`: por defecto, solo recursos desde mi mismo origen (mi dominio).
- `script-src 'self'`: solo ejecuto scripts de mi dominio; un `<script src="https://evil.com/x.js">` inyectado sería bloqueado.
- `object-src 'none'`: cero plugins (`<object>`, `<embed>`), un vector histórico.

Si alguien consigue meter un `<script>` externo, el navegador se niega a ejecutarlo. CSP no sustituye a sanitizar, pero es tu seguro de vida: **defensa en profundidad** (varias capas, porque ninguna es infalible por sí sola).

Cómo se activa: es un header que envía el **servidor** en las respuestas (o una metaetiqueta, menos fiable). Como frontend, puedes pedir a tu backend/proxy que lo añada; para probarlo en local, revisa cómo se configura en tu servidor de desarrollo o en Nginx (M18).

---

## CSRF (Cross-Site Request Forgery)

Si XSS es el actor intruso en el escenario, CSRF es una **firma falsificada**: alguien hace que, sin que te des cuenta, tu navegador envíe a tu banco una orden firmada con *tu* sello (tu cookie de sesión).

- El atacante hace que el navegador del usuario envíe **cookie autenticada** a tu API.

El mecanismo es sorprendentemente simple. Las cookies viajan **automáticamente** en casi cualquier petición a tu dominio. El atacante publica, por ejemplo, en su blog o en un email:

```html
<!-- Sitio malicioso -->
<img src="https://tu-api.com/transferir?destino=ATA CANTA&cantidad=1000" style="display:none">
```

Tu usuario, que tiene la sesión abierta en `tu-api.com`, visita esa página. Su navegador carga la "imagen", lo que en realidad es una **petición GET autenticada con su cookie**. Si tu API acepta transferencias por GET y no pide nada más... adiós dinero. No hace falta que el atacante conozca su contraseña: *su propio navegador* le hace de cómplice.

### Defensas

1. **SameSite=Lax/Strict** en cookies de sesión.
2. **CSRF token** (double submit) en forms/mutaciones cookie-based.
3. Requerir header custom (`X-Requested-With`) o fetch sin CORS simple.
4. Bearer JWT en memoria/localStorage → **no** aplica CSRF (pero sí XSS; elige el trade-off consciente).
5. Reconfirmar acciones sensibles (password actual).

Desglosemos cada una, porque no todas valen para lo mismo:

#### 1. SameSite

El atributo `SameSite` en la cookie le dice al navegador: *«solo envía esta cookie si la petición viene de mi sitio»*. Con `Lax` (hoy el valor por defecto en los navegadores modernos) las cookies **no** se envían en peticiones cross-site de tipo POST/PUT/DELETE vía formularios o `fetch` de otros orígenes; con `Strict`, ni siquiera en enlaces de entrada normales.

```
Set-Cookie: session=abc; HttpOnly; Secure; SameSite=Lax
```

Es la defensa más barata y la primera que debes tener. Por sí sola no es 100 % (aplica a los navegadores actuales, y hay matices con `GET`), por eso se combina con las demás.

#### 2. Token CSRF (double submit)

El servidor genera un valor aleatorio y lo entrega al cliente (cookie no autenticable + campo oculto, o header). En cada mutación, el cliente debe devolver **ese mismo valor**. El atacante puede hacer que tu navegador envíe la cookie, pero no puede *leerla* desde su sitio para copiarla en el body o el header: solo quien controla tu app real conoce el token.

Es el clásico campo `<input type="hidden" name="csrf_token" value="...">` de los formularios clásicos, y sigue siendo válido hoy.

#### 3. Header custom obligatorio

Si tu API solo acepta mutaciones cuando existe un header custom (p. ej. `X-Requested-With: XMLHttpRequest` o `Content-Type: application/json`), el atacante tiene un problema: un `<form>` clásico **no puede** poner headers arbitrarios, y un `fetch` desde su dominio hacia el tuyo sería bloqueado por CORS (lo veremos en la Unidad 02) antes de llegar a tus endpoints.

#### 4. Bearer JWT en memoria o localStorage

Si la autenticación viaja en un **header** `Authorization: Bearer ...` y no en una cookie, el navegador ya no la adjunta automáticamente... así que CSRF **no aplica**. Pero ojo: hemos cambiado de problema, no lo hemos eliminado. Un token en `localStorage` es robable por cualquier XSS (lo veremos en la Unidad 03). **Elige el trade-off consciente.**

#### 5. Reconfirmar acciones sensibles

Para operaciones críticas (cambiar contraseña, vincular una cuenta bancaria, borrar todo), pedir de nuevo la contraseña actual. Aunque el atacante logre disparar la petición, no podrá completarla. Es la defensa "humana" de última línea y la más difícil de saltarse.

### Resumen visual del ataque

```
Víctima con sesión abierta en tu-api.com
        │
        ▼
Visita sitio del atacante (o abre un email)
        │
        ▼
Su navegador emite petición a tu-api.com
        │  (¡la cookie viaja sola!)
        ▼
Tu API ve una petición "legítima" y la procesa
```

Rompe cualquiera de los eslabones y el ataque fracasa: sin cookie automática (SameSite), sin header/token que el atacante no puede copiar, o con reconfirmación.

---

## Errores comunes

| Error | Por qué es un problema | Qué hacer en su lugar |
|-------|------------------------|------------------------|
| Usar `dangerouslySetInnerHTML` con datos de usuario "porque se veía mal" | XSS almacenado/reflejado listo para activarse | `{texto}` o sanitizar con allowlist (DOMPurify) |
| Confiar en que "React ya protege" y usar además `innerHTML` a mano | React solo escapa lo que renderiza *él*; `innerHTML` lo haces tú fuera de su control | Nunca tocar `innerHTML`/`document.write` con datos externos |
| Validar sanidad solo en el cliente | El atacante edita el JS o llama a la API directamente; el cliente no es confiable | Validar **y** sanitizar también en el servidor |
| Cookies de sesión sin `SameSite` ni `HttpOnly` | Expuesta a CSRF y a robo por JS en caso de XSS | `HttpOnly; Secure; SameSite=Lax` como mínimo |
| Creer que "mi app no es relevante para atacantes" | Los bots escanean la web entera; el objetivo puede ser usar tu servidor como spam o red | Aplica las mismas defensas base en cualquier proyecto |
| Añadir CSP en desarrollo y olvidarla en producción | Proteges el entorno de pruebas, no el real | Configurar CSP en el servidor/proxy de prod desde el día 1 |
| Poner tokens de sesión en cookies sin `Secure` | Se envían por HTTP plano y pueden interceptarse | `Secure` + HTTPS siempre (ver Unidad 03) |
| Asumir que CSRF "no aplica a las SPAs" | Si usas cookies para autenticar, aplica igual | Elige modelo cookie+SameSite+token o Bearer header, y defiéndelo |

---

## Conceptos clave

- **Payload**: el código o cadena maliciosa que intenta ejecutarse (por ejemplo, un `<script>` o un `<img onerror=...>`).
- **XSS**: ejecución de JS del atacante dentro de tu página; tipos *reflected* (URL), *stored* (BD) y *DOM-based* (JS de la página).
- **Escapado de salida (output escaping)**: convertir `<`, `>`, `&`, comillas en entidades inocuas antes de mostrarlas. React lo hace por defecto en `{...}`.
- **`dangerouslySetInnerHTML`**: la única puerta de React para inyectar HTML crudo; úsala solo con sanitización previa (allowlist).
- **Allowlist vs blocklist**: permitir solo lo conocido (bien) vs intentar bloquear lo malo (siempre se escapa algo).
- **DOMPurify**: librería de sanitización con allowlist para HTML enriquecido.
- **CSP**: cabecera que restringe qué scripts/recursos puede cargar el navegador; defensa en profundidad ante XSS.
- **CSRF**: forzar al navegador del usuario a enviar una petición autenticada (con su cookie) desde otro origen.
- **`SameSite`**: atributo de cookie que limita su envío en peticiones cross-site (`Lax`, `Strict`, `None`).
- **Token CSRF / double submit**: valor aleatorio que el atacante no puede leer desde su sitio y que tu API exige en cada mutación.
- **Trade-off cookie vs Bearer**: cookies → riesgo CSRF (mitigable); header Bearer → sin CSRF pero robable por XSS si vive en `localStorage`.
- **Defensa en profundidad**: no confiar en una sola capa; combina escapado + CSP + SameSite + validación server.

---

## Autoevaluación

**1. Un formulario de comentarios renderiza el texto con `<div dangerouslySetInnerHTML={{ __html: comentario }} />` y los usuarios pueden escribir cualquier cosa. ¿Qué tipo de XSS está expuesto y cómo lo corriges?**

<details>
<summary>Respuesta</summary>

**XSS almacenado** (*stored*): el payload queda guardado en la BD y se sirve a todos los que lean los comentarios. Corrección mínima: renderizar como texto con `<p>{comentario}</p>` (React escapa). Si el producto exige HTML rico, sanitizar en el servidor **y** en el cliente con allowlist (p. ej. `DOMPurify.sanitize(comentario)`) antes de guardarlo o mostrarlo, y añadir CSP como capa extra.

</details>

**2. Tu app solo usa `localStorage.setItem('token', t)` para autenticar y crees que "CSRF no puede afectarme". ¿Es correcto?**

<details>
<summary>Respuesta</summary>

**Parcialmente sí, y parcialmente no.** Como el token viaja en un header `Authorization` y no en una cookie, el navegador no lo adjunta automáticamente a peticiones cross-site: CSRF no aplica. **Pero** el `localStorage` es legible por cualquier JS de tu página, así que cualquier XSS roba el token al instante: has cambiado CSRF por riesgo de XSS. La Unidad 03 muestra los trade-offs entre almacenamientos (cookie httpOnly, memoria, localStorage).

</details>

**3. ¿Qué dos cosas fallan en `Set-Cookie: session=...` sin atributos y por qué?**

<details>
<summary>Respuesta</summary>

1. **Sin `HttpOnly`**: el JS (incluido el de un XSS) puede leer la cookie → robo de sesión.  
2. **Sin `SameSite`** (y sin `Secure`): puede enviarse en contextos cross-site y por HTTP no cifrado → riesgo CSRF e interceptación. Mínimo recomendado: `HttpOnly; Secure; SameSite=Lax`.

</details>

**4. ¿Por qué la cabecera `Content-Security-Policy: script-src 'self'` reduce el impacto de un XSS aunque el payload ya esté en la página?**

<details>
<summary>Respuesta</summary>

Porque el navegador **bloquea la ejecución** de scripts que no provengan del propio origen (y de fuentes permitidas explícitamente). Un `<script src="https://evil.com/x.js">` o un inline script no permitido no se ejecuta, con lo que el ataque falla o queda muy limitado. CSP no evita que el HTML inyectado se muestre, pero corta la pierna principal del XSS: la ejecución del código del atacante. Por eso se combina con escapado/sanitización en vez de sustituirla.

</details>

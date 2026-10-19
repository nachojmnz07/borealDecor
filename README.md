# [NOMBRE DE LA MARCA]

Proyecto web estático para presentar un pequeño negocio artesanal de manualidades y decoración navideña hechas a mano.

## Estructura del proyecto

```text
/proyecto
├── index.html
├── productos.html
├── sobre-nosotros.html
├── galeria.html
├── contacto.html
├── README.md
├── css/
│   └── styles.css
├── js/
│   └── script.js
├── img/
│   ├── logo/
│   ├── productos/
│   │   ├── producto_1.jpeg ... producto_8.jpeg
│   │   └── ilustraciones SVG
│   └── galeria/ (ilustraciones SVG)
└──
```

## Cómo ejecutarlo localmente

1. Descarga o abre la carpeta del proyecto en tu editor.
2. Desde la raíz del proyecto, ejecuta un servidor local. Por ejemplo:

```bash
cd "ruta/a/proyecto"
py -m http.server 8000
```

3. Abre en el navegador:

```text
http://localhost:8000
```

## Personalizar los productos

Todos los productos y sus imágenes están definidos en el archivo [js/script.js](js/script.js). Modifica el array `products` para añadir, cambiar o eliminar elementos. El carrito guarda sus artículos y el método de entrega en el navegador. El checkout es como invitado, no requiere cuenta: pide nombre y teléfono, además del punto InPost o dirección si corresponde. Los datos de contacto solo se envían en el mensaje de WhatsApp y no se guardan en el navegador.

Ejemplo:

```js
const products = [
  {
    id: "nuevo-producto",
    nombre: "Nuevo producto",
    precio: 25.00,
    categoria: "Lazos",
    imagenes: [{ src: "img/productos/producto-nuevo.jpeg", alt: "Descripción de la imagen" }],
    descripcion: "Descripción del producto.",
    personalizado: false,
    disponible: true
  }
];
```

## Cambiar el número de WhatsApp

En [js/script.js](js/script.js), cambia el valor de:

```js
const whatsappNumber = "34624527625";
```

Usa el formato internacional, solo con dígitos y con prefijo de país (por ejemplo, `34612345678`). El número del negocio ya está configurado.

## Cambiar Instagram

Busca y reemplaza los placeholders en las páginas HTML:

```text
https://instagram.com/[INSTAGRAM]
```

Por ejemplo:

```text
https://instagram.com/mi.negocio.artesanal
```

## Cambiar el email

Busca en todas las páginas el texto:

```text
[EMAIL]
```

y sustituye por una dirección real de correo.

## Imágenes y envíos

Las fotos del catálogo se guardan en [img/productos](img/productos) y sus rutas/textos ALT se configuran dentro de cada producto en [js/script.js](js/script.js). El carrito permite elegir InPost, entrega a domicilio o recogida en Valencia; InPost y domicilio son gratis a partir de 50 € y la recogida es siempre gratuita.

Actualiza la ruta y el texto ALT en el array de productos al cambiar una foto.

## Cambiar colores y textos

- Los colores principales están definidos en [css/styles.css](css/styles.css) dentro de `:root`.
- Los textos principales se editan desde cada archivo HTML.
- Los textos de marca, placeholder y llamada a la acción están marcados con corchetes para facilitar la edición.

## Qué falta por definir

La web está pensada para que el cliente complete lo siguiente:

- Nombre de la marca
- Instagram
- Email
- Historia exacta del negocio

## Evolución futura

Esta versión deja preparado el camino para:

- añadir una base de datos y un panel de administración,
- crear una tienda online completa,
- gestionar stock y pedidos,
- ampliar el catálogo y la sección de servicios.

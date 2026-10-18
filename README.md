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
│   │   └── logo-placeholder.svg
│   ├── productos/
│   │   ├── corona-clasica.svg
│   │   ├── adorno-arbol.svg
│   │   ├── centro-mesa.svg
│   │   ├── caja-regalo.svg
│   │   └── letrero-rustico.svg
│   └── galeria/
│       ├── galeria-1.svg
│       ├── galeria-2.svg
│       ├── galeria-3.svg
│       └── galeria-4.svg
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

Todos los productos están definidos en el archivo [js/script.js](js/script.js). Modifica el array `products` para añadir, cambiar o eliminar elementos.

Ejemplo:

```js
const products = [
  {
    nombre: "Nuevo producto",
    precio: 25,
    categoria: "Adornos",
    imagen: "img/productos/mi-producto.svg",
    descripcion: "Descripción del producto.",
    personalizado: true,
    disponible: true,
    demo: true
  }
];
```

## Cambiar el número de WhatsApp

1. En [js/script.js](js/script.js), cambia el valor de:

```js
const whatsappNumber = "[NUMERO WHATSAPP]";
```

2. Sustituye el placeholder por el número real, por ejemplo:

```js
const whatsappNumber = "34612345678";
```

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

## Sustituir imágenes

Puedes reemplazar cualquier imagen de la carpeta [img](img) por tus fotografías reales.

Recuerda mantener el mismo nombre para que no tengas que cambiar el código, o editar la ruta en el array de productos o en la galeria.

## Cambiar colores y textos

- Los colores principales están definidos en [css/styles.css](css/styles.css) dentro de `:root`.
- Los textos principales se editan desde cada archivo HTML.
- Los textos de marca, placeholder y llamada a la acción están marcados con corchetes para facilitar la edición.

## Qué falta por definir

La web está pensada para que el cliente complete lo siguiente:

- Nombre de la marca
- Número de WhatsApp real
- Instagram
- Email
- Fotografías reales
- Productos definitivos
- Precios definitivos
- Historia exacta del negocio

## Evolución futura

Esta versión deja preparado el camino para:

- añadir una base de datos y un panel de administración,
- introducir un carrito de compra,
- crear una tienda online completa,
- gestionar stock y pedidos,
- ampliar el catálogo y la sección de servicios.

## Notas

Todos los productos actuales son DEMO y están marcados como ejemplo para visualizar la estructura del catálogo.

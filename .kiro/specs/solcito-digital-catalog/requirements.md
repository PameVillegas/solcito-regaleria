# Requirements Document

## Introduction

Catálogo digital para la regalería "SOLCITO REGALERIA". El sistema permite a la administradora gestionar productos (agregar artículos, manejar stock, precios, colores, promociones y disponibilidad) y a los clientes navegar el catálogo, agregar artículos al carrito, seleccionar opciones de envío y pago, y enviar un pedido vía WhatsApp a la administradora con todos los detalles para coordinar la compra.

## Glossary

- **Sistema**: La aplicación web del catálogo digital de SOLCITO REGALERIA
- **Panel_Admin**: La interfaz de administración donde la administradora gestiona productos y configuraciones
- **Catálogo**: La vista pública donde los clientes navegan los productos disponibles
- **Carrito**: La funcionalidad que permite al cliente acumular artículos seleccionados antes de enviar el pedido
- **Artículo**: Un producto individual dentro del catálogo con sus atributos (nombre, descripción, precio, colores, stock)
- **Promoción**: Una oferta o descuento aplicado a uno o más artículos por un período determinado
- **Administradora**: La persona responsable de gestionar el catálogo y los pedidos
- **Cliente**: La persona que navega el catálogo y realiza pedidos
- **Pedido**: El conjunto de artículos seleccionados por el cliente con sus detalles, enviado vía WhatsApp
- **Mensaje_WhatsApp**: El mensaje generado automáticamente con los detalles del pedido enviado a la administradora

## Requirements

### Requirement 1: Gestión de Artículos

**User Story:** Como administradora, quiero agregar y editar artículos en el catálogo, para que los clientes vean los productos que vendo.

#### Acceptance Criteria

1. WHEN la Administradora completa el formulario de nuevo artículo con nombre (máximo 100 caracteres), descripción (máximo 500 caracteres), precio (entre 0.01 y 999,999.99 en moneda local) y al menos una imagen, THE Panel_Admin SHALL crear el Artículo y mostrarlo en la lista de artículos administrados.
2. IF la Administradora envía el formulario de nuevo artículo sin completar nombre, descripción, precio o sin al menos una imagen, THEN THE Panel_Admin SHALL impedir la creación del Artículo y señalar los campos faltantes.
3. WHEN la Administradora edita un Artículo existente, THE Panel_Admin SHALL actualizar los datos del Artículo y reflejar los cambios en el Catálogo de forma inmediata tras guardar.
4. WHEN la Administradora elimina un Artículo, THE Panel_Admin SHALL solicitar confirmación antes de remover el Artículo del Catálogo y de la lista de artículos administrados.
5. THE Panel_Admin SHALL permitir agregar hasta 10 imágenes por cada Artículo.

### Requirement 2: Gestión de Colores y Variantes

**User Story:** Como administradora, quiero asignar colores disponibles a cada artículo, para que los clientes sepan qué opciones tienen.

#### Acceptance Criteria

1. WHEN la Administradora agrega un color a un Artículo ingresando un nombre de color textual, THE Panel_Admin SHALL almacenar el color y mostrarlo en la lista de colores disponibles del Artículo, permitiendo un máximo de 20 colores por Artículo.
2. IF la Administradora intenta agregar un color cuyo nombre ya existe en el mismo Artículo, THEN THE Panel_Admin SHALL rechazar la adición y mostrar un mensaje indicando que el color ya está asignado.
3. WHEN la Administradora elimina un color de un Artículo, THE Panel_Admin SHALL remover el color de la lista de colores disponibles del Artículo y dejar de mostrarlo en el Catálogo.
4. WHEN un Cliente visualiza un Artículo que tiene colores asignados, THE Catálogo SHALL mostrar todas las opciones de color disponibles con su nombre textual.
5. WHEN un Cliente agrega al Carrito un Artículo que tiene colores asignados, THE Carrito SHALL requerir la selección de un color antes de confirmar la adición, impidiendo agregar el Artículo sin selección de color.
6. IF un Artículo no tiene colores asignados, THEN THE Carrito SHALL permitir agregar el Artículo sin requerir selección de color.

### Requirement 3: Gestión de Stock

**User Story:** Como administradora, quiero manejar el stock de cada artículo, para controlar la disponibilidad de mis productos.

#### Acceptance Criteria

1. WHEN la Administradora establece la cantidad de stock de un Artículo, THE Panel_Admin SHALL almacenar y mostrar la cantidad disponible como un valor entero entre 0 y 99.999 unidades.
2. IF la Administradora ingresa un valor de stock negativo o no entero, THEN THE Panel_Admin SHALL rechazar el valor y mostrar un mensaje de error indicando que el stock debe ser un número entero mayor o igual a cero.
3. WHEN el stock de un Artículo llega a cero (por ajuste manual de la Administradora o por confirmación de un Pedido), THE Catálogo SHALL mostrar el Artículo como "No disponible".
4. WHEN la Administradora marca manualmente un Artículo como no disponible, THE Catálogo SHALL mostrar el Artículo como "No disponible" independientemente de la cantidad de stock restante.
5. WHEN la Administradora desmarca un Artículo previamente marcado como no disponible y el stock es mayor a cero, THE Catálogo SHALL mostrar el Artículo como disponible nuevamente.
6. WHILE un Artículo tiene stock igual a cero o está marcado manualmente como no disponible, THE Carrito SHALL impedir que el Cliente agregue ese Artículo y mostrar una indicación de que el Artículo no está disponible.
7. IF un Artículo que ya se encuentra en el Carrito pasa a estado no disponible (por stock agotado o marca manual), THEN THE Carrito SHALL notificar al Cliente que el Artículo ya no está disponible y removerlo del Carrito.

### Requirement 4: Gestión de Precios

**User Story:** Como administradora, quiero establecer y modificar los precios de los artículos, para mantener la información de precios actualizada.

#### Acceptance Criteria

1. WHEN la Administradora asigna un precio numérico mayor a cero a un Artículo, THE Panel_Admin SHALL almacenar el precio y mostrarlo en el Catálogo.
2. WHEN la Administradora modifica el precio de un Artículo, THE Catálogo SHALL reflejar el nuevo precio sin que el Cliente necesite recargar la página del Catálogo manualmente.
3. THE Catálogo SHALL mostrar los precios en pesos argentinos (ARS) con el símbolo "$" seguido del valor numérico formateado con punto como separador de miles y coma como separador decimal (ejemplo: $1.250,00).
4. IF la Administradora ingresa un precio con valor cero, negativo o con caracteres no numéricos, THEN THE Panel_Admin SHALL rechazar la entrada y mostrar un mensaje de error indicando que el precio debe ser un valor numérico mayor a cero.
5. IF un Artículo no tiene precio asignado, THEN THE Catálogo SHALL no mostrar el Artículo hasta que se le asigne un precio válido.

### Requirement 5: Gestión de Promociones y Ofertas

**User Story:** Como administradora, quiero crear promociones y ofertas en artículos, para atraer más clientes y aumentar las ventas.

#### Acceptance Criteria

1. WHEN la Administradora crea una Promoción para un Artículo con porcentaje de descuento (entre 1% y 99%) y fechas de vigencia (fecha de inicio y fecha de fin, donde fecha de fin es posterior a fecha de inicio), THE Panel_Admin SHALL almacenar la Promoción y asociarla al Artículo.
2. IF la Administradora intenta crear una Promoción con porcentaje fuera del rango 1%-99% o con fecha de fin anterior o igual a la fecha de inicio, THEN THE Panel_Admin SHALL rechazar la creación y mostrar un mensaje de error indicando el campo inválido.
3. WHILE una Promoción está vigente, THE Catálogo SHALL mostrar el precio original tachado y el precio con descuento aplicado, calculado como el precio original menos el porcentaje de descuento, redondeado al entero más cercano.
4. WHEN la fecha de vigencia de una Promoción expira, THE Sistema SHALL desactivar la Promoción automáticamente y el Catálogo SHALL mostrar únicamente el precio original del Artículo.
5. WHEN la Administradora cancela una Promoción manualmente, THE Panel_Admin SHALL desactivar la Promoción sin esperar la fecha de fin, y el Catálogo SHALL mostrar el precio original del Artículo.
6. IF la Administradora intenta crear una Promoción para un Artículo que ya tiene una Promoción activa, THEN THE Panel_Admin SHALL rechazar la creación y mostrar un mensaje indicando que el Artículo ya posee una Promoción vigente.

### Requirement 6: Navegación del Catálogo

**User Story:** Como cliente, quiero navegar los artículos del catálogo de forma organizada, para encontrar fácilmente lo que busco.

#### Acceptance Criteria

1. THE Catálogo SHALL mostrar los artículos disponibles con imagen, nombre y precio, ordenados por nombre alfabéticamente de forma predeterminada, presentando un máximo de 20 artículos por página con controles de paginación cuando existan más artículos.
2. WHEN un Cliente selecciona un Artículo, THE Catálogo SHALL mostrar la vista detallada con descripción completa, todas las imágenes asociadas, colores disponibles, precio (incluyendo precio promocional si aplica) y estado de disponibilidad.
3. WHEN un Cliente ingresa un término de búsqueda de al menos 2 caracteres, THE Catálogo SHALL filtrar y mostrar los artículos cuyo nombre o descripción contengan parcialmente el término ingresado, sin distinguir mayúsculas de minúsculas.
4. IF un Artículo no tiene imagen asociada, THEN THE Catálogo SHALL mostrar una imagen de marcador de posición predeterminada.
5. IF la búsqueda no encuentra artículos que coincidan con el término ingresado, THEN THE Catálogo SHALL mostrar un mensaje indicando que no se encontraron resultados para el término buscado.

### Requirement 7: Carrito de Compras

**User Story:** Como cliente, quiero agregar artículos a un carrito, para acumular los productos que deseo comprar antes de enviar el pedido.

#### Acceptance Criteria

1. WHEN un Cliente agrega un Artículo disponible al Carrito con una cantidad mínima de 1, color elegido y precio unitario vigente, THE Carrito SHALL almacenar el Artículo con dichos datos y recalcular el total del Carrito.
2. WHEN un Cliente modifica la cantidad de un Artículo en el Carrito a un valor entre 1 y el stock disponible, THE Carrito SHALL actualizar la cantidad y recalcular el subtotal del Artículo y el total del Carrito.
3. WHEN un Cliente elimina un Artículo del Carrito, THE Carrito SHALL remover el Artículo y recalcular el total del Carrito.
4. THE Carrito SHALL mostrar el total acumulado de todos los artículos seleccionados en moneda local con formato numérico legible.
5. IF un Cliente intenta agregar una cantidad mayor al stock disponible de un Artículo, THEN THE Carrito SHALL limitar la cantidad al stock máximo disponible y mostrar un mensaje indicando que la cantidad fue ajustada al stock disponible.
6. WHEN un Cliente agrega un Artículo al Carrito con el mismo color que una entrada existente en el Carrito, THE Carrito SHALL incrementar la cantidad de la entrada existente en lugar de crear una entrada duplicada, respetando el límite de stock disponible.
7. IF un Cliente establece la cantidad de un Artículo en el Carrito a 0, THEN THE Carrito SHALL remover el Artículo del Carrito y recalcular el total.

### Requirement 8: Selección de Opciones de Envío

**User Story:** Como cliente, quiero seleccionar una opción de envío, para indicar cómo deseo recibir mis productos.

#### Acceptance Criteria

1. WHEN un Cliente procede al checkout y existen opciones de envío activas configuradas, THE Sistema SHALL presentar todas las opciones de envío activas configuradas por la Administradora, mostrando nombre y descripción de cada una.
2. WHEN un Cliente selecciona una opción de envío, THE Sistema SHALL registrar la selección, resaltarla visualmente como seleccionada e incluirla en el resumen del Pedido. WHEN el Cliente selecciona una opción diferente, THE Sistema SHALL reemplazar la selección anterior por la nueva.
3. THE Panel_Admin SHALL permitir a la Administradora configurar las opciones de envío disponibles con nombre (máximo 50 caracteres) y descripción (máximo 200 caracteres), requiriendo al menos 1 opción de envío activa configurada.
4. IF un Cliente procede al checkout y no existen opciones de envío activas configuradas, THEN THE Sistema SHALL mostrar un mensaje indicando que no hay opciones de envío disponibles e impedir la finalización del Pedido.

### Requirement 9: Selección de Opción de Pago

**User Story:** Como cliente, quiero seleccionar una opción de pago, para indicar cómo deseo abonar mi compra y coordinar con la vendedora.

#### Acceptance Criteria

1. WHEN un Cliente procede al checkout y existen opciones de pago configuradas, THE Sistema SHALL presentar todas las opciones de pago activas configuradas por la Administradora, mostrando nombre y descripción de cada una.
2. WHEN un Cliente selecciona una opción de pago, THE Sistema SHALL registrar la selección, resaltarla visualmente como seleccionada e incluirla en el resumen del Pedido. WHEN el Cliente selecciona una opción diferente, THE Sistema SHALL reemplazar la selección anterior por la nueva.
3. THE Panel_Admin SHALL permitir a la Administradora configurar las opciones de pago disponibles con nombre (máximo 50 caracteres) y descripción (máximo 200 caracteres), requiriendo al menos 1 opción de pago activa configurada.
4. IF un Cliente procede al checkout y no existen opciones de pago activas configuradas, THEN THE Sistema SHALL mostrar un mensaje indicando que no hay opciones de pago disponibles e impedir la finalización del Pedido.

### Requirement 10: Envío de Pedido por WhatsApp

**User Story:** Como cliente, quiero enviar mi pedido por WhatsApp a la administradora, para coordinar la compra directamente con la vendedora.

#### Acceptance Criteria

1. WHEN un Cliente confirma el Pedido con artículos en el Carrito, opción de envío y opción de pago seleccionadas, THE Sistema SHALL generar un Mensaje_WhatsApp dirigido al número configurado por la Administradora.
2. THE Mensaje_WhatsApp SHALL incluir: lista de artículos con nombre, color seleccionado, cantidad, precio unitario, subtotal por artículo, opción de envío seleccionada, opción de pago seleccionada y total general del Pedido.
3. WHEN el Sistema genera el Mensaje_WhatsApp, THE Sistema SHALL abrir una nueva pestaña o ventana del navegador con la URL de WhatsApp (formato https://wa.me/{número}?text={mensaje_codificado}) con el mensaje pre-redactado dirigido al número de la Administradora.
4. THE Panel_Admin SHALL permitir a la Administradora configurar el número de WhatsApp de destino para recibir los pedidos, validando que el número contenga entre 10 y 15 dígitos con código de país.
5. IF el Cliente no ha seleccionado opción de envío o opción de pago, o el Carrito está vacío, THEN THE Sistema SHALL impedir la generación del Mensaje_WhatsApp y mostrar un mensaje indicando qué campos debe completar el Cliente.
6. IF no existe un número de WhatsApp configurado por la Administradora, THEN THE Sistema SHALL impedir la finalización del Pedido y mostrar un mensaje de error.
7. WHEN el Mensaje_WhatsApp se genera exitosamente, THE Carrito SHALL vaciarse y mostrar una confirmación de que el pedido fue enviado.

### Requirement 11: Autenticación de Administradora

**User Story:** Como administradora, quiero acceder al panel de administración de forma segura, para proteger la gestión del catálogo.

#### Acceptance Criteria

1. WHEN la Administradora ingresa credenciales válidas (usuario y contraseña), THE Sistema SHALL otorgar acceso al Panel_Admin y redirigir a la pantalla principal de administración.
2. IF la Administradora ingresa credenciales inválidas, THEN THE Sistema SHALL denegar el acceso y mostrar un mensaje de error genérico sin revelar si el usuario o la contraseña son incorrectos.
3. WHILE la Administradora no está autenticada, THE Sistema SHALL impedir el acceso a las funciones del Panel_Admin y redirigir al formulario de inicio de sesión.
4. IF la Administradora ingresa credenciales inválidas 5 veces consecutivas, THEN THE Sistema SHALL bloquear temporalmente el acceso por 15 minutos.
5. WHEN la Administradora selecciona la opción de cerrar sesión, THE Sistema SHALL finalizar la sesión activa y redirigir al formulario de inicio de sesión.
6. IF la sesión de la Administradora permanece inactiva por más de 30 minutos, THEN THE Sistema SHALL cerrar la sesión automáticamente y redirigir al formulario de inicio de sesión.

### Requirement 12: Accesibilidad y Despliegue en Internet

**User Story:** Como cliente, quiero acceder al catálogo desde cualquier dispositivo (celular, tablet, PC) y cualquier red de internet, para poder ver los productos sin restricciones.

#### Acceptance Criteria

1. THE Sistema SHALL estar desplegado en internet con una URL pública accesible desde cualquier red (WiFi, datos móviles, etc.) sin restricciones de red local.
2. THE Sistema SHALL utilizar HTTPS para todas las comunicaciones entre el navegador y el servidor.
3. THE Catálogo SHALL ser completamente responsive, adaptándose automáticamente a pantallas de celular (< 640px), tablet (768px) y desktop (≥ 1024px).
4. THE Catálogo SHALL cargar correctamente en los navegadores principales: Chrome, Firefox, Safari y Edge en sus versiones de escritorio y móvil.
5. THE Sistema SHALL optimizar las imágenes de productos para carga rápida en conexiones móviles, utilizando formatos modernos (WebP) y tamaños adaptados al dispositivo.
6. THE Panel_Admin SHALL ser completamente funcional desde dispositivos móviles, permitiendo a la Administradora gestionar productos desde su celular.

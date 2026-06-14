# Implementation Plan: Catálogo Digital SOLCITO REGALERIA

## Overview

Implementación de una aplicación web de catálogo digital con frontend React + TypeScript + Tailwind CSS, backend Node.js + Express + TypeScript, base de datos SQLite vía Prisma ORM, autenticación JWT y envío de pedidos vía WhatsApp.

## Tasks

- [ ] 1. Configuración del proyecto e infraestructura base
  - [ ] 1.1 Inicializar monorepo con estructura de directorios
    - Crear carpetas `backend/` y `frontend/`
    - Inicializar `package.json` raíz con workspaces
    - Configurar TypeScript (`tsconfig.json`) para backend y frontend
    - Configurar ESLint y Prettier compartidos
    - _Requisitos: Infraestructura base_

  - [ ] 1.2 Configurar backend con Express + TypeScript + Prisma
    - Inicializar `backend/package.json` con dependencias: express, prisma, @prisma/client, bcrypt, jsonwebtoken, multer, cors, express-rate-limit
    - Crear `backend/tsconfig.json`
    - Inicializar Prisma con `npx prisma init` y configurar SQLite
    - Crear script de inicio con nodemon/ts-node-dev
    - _Requisitos: Infraestructura base_

  - [ ] 1.3 Configurar frontend con Vite + React + TypeScript + Tailwind CSS
    - Crear proyecto con `npm create vite@latest` (template react-ts)
    - Instalar y configurar Tailwind CSS
    - Instalar react-router-dom para enrutamiento
    - Configurar proxy de desarrollo hacia el backend
    - _Requisitos: Infraestructura base_

  - [ ] 1.4 Configurar framework de testing
    - Instalar Vitest como test runner para backend y frontend
    - Instalar fast-check para property-based testing
    - Instalar @testing-library/react para tests de componentes
    - Configurar scripts de test en ambos packages
    - Crear estructura de directorios: `tests/properties/`, `tests/unit/`, `tests/integration/`
    - _Requisitos: Infraestructura de testing_

- [ ] 2. Esquema de base de datos y modelos
  - [ ] 2.1 Definir esquema Prisma completo
    - Crear modelos: Product, ProductImage, ProductColor, Promotion, ShippingOption, PaymentOption, AdminUser, SystemConfig
    - Definir relaciones: Product → ProductImage (1:N), Product → ProductColor (1:N), Product → Promotion (1:N)
    - Agregar constraint `@@unique([productId, name])` en ProductColor
    - Configurar `onDelete: Cascade` en relaciones
    - Ejecutar `npx prisma migrate dev` para generar migración inicial
    - _Requisitos: 1.1, 2.1, 3.1, 5.1_

  - [ ] 2.2 Crear seed de datos iniciales
    - Crear script `backend/prisma/seed.ts`
    - Insertar usuario admin por defecto (username: admin, password hasheada con bcrypt)
    - Insertar configuración de WhatsApp por defecto en SystemConfig
    - Insertar al menos una opción de envío y una de pago por defecto
    - _Requisitos: 11.1, 8.3, 9.3_

- [ ] 3. Backend - Módulo de autenticación
  - [ ] 3.1 Implementar servicio de autenticación
    - Crear `backend/src/services/auth.service.ts`
    - Implementar `login(username, password)`: verificar credenciales con bcrypt, generar JWT con expiración de 30 min, manejar intentos fallidos y bloqueo
    - Implementar lógica de bloqueo: 5 intentos fallidos → bloqueo 15 min
    - Implementar reseteo de intentos fallidos tras login exitoso
    - _Requisitos: 11.1, 11.2, 11.4_

  - [ ] 3.2 Implementar middleware de autenticación JWT
    - Crear `backend/src/middleware/auth.middleware.ts`
    - Verificar token JWT en header Authorization
    - Validar expiración del token (30 min de inactividad)
    - Retornar 401 si token inválido o expirado
    - _Requisitos: 11.3, 11.6_

  - [ ] 3.3 Implementar rutas de autenticación
    - Crear `backend/src/routes/auth.routes.ts`
    - POST `/api/auth/login`: recibir username/password, retornar JWT
    - POST `/api/auth/logout`: invalidar sesión (client-side)
    - Aplicar rate limiting en endpoint de login
    - _Requisitos: 11.1, 11.5_

  - [ ]* 3.4 Tests de propiedades para autenticación
    - **Propiedad 22: Protección de rutas sin autenticación**
    - **Propiedad 23: Bloqueo por intentos fallidos**
    - **Propiedad 24: Expiración de sesión por inactividad**
    - **Valida: Requisitos 11.3, 11.4, 11.6**

- [ ] 4. Backend - CRUD de productos
  - [ ] 4.1 Implementar servicio de productos
    - Crear `backend/src/services/product.service.ts`
    - Implementar `create(data)`: validar campos obligatorios (nombre ≤100, descripción ≤500, precio 0.01-999999.99), crear producto
    - Implementar `update(id, data)`: actualizar producto existente
    - Implementar `delete(id)`: eliminar producto con cascada
    - Implementar `findById(id)`: obtener producto con relaciones
    - Implementar `findAll(page, pageSize)`: listar con paginación
    - Implementar `search(query)`: búsqueda parcial case-insensitive en nombre y descripción
    - _Requisitos: 1.1, 1.2, 1.3, 1.4, 6.1, 6.3_

  - [ ] 4.2 Implementar lógica de disponibilidad
    - Crear `backend/src/services/availability.service.ts`
    - Implementar regla: disponible = stock > 0 AND !isManuallyUnavailable AND price > 0 AND images.length > 0
    - Filtrar productos no disponibles en endpoints públicos del catálogo
    - _Requisitos: 3.1, 3.3, 3.4, 3.5, 4.5_

  - [ ] 4.3 Implementar servicio de imágenes
    - Crear `backend/src/services/image.service.ts`
    - Configurar multer para upload (destino: `backend/uploads/`, máx 5MB, formatos: jpg, png, webp)
    - Implementar `upload(productId, files)`: validar límite de 10 imágenes
    - Implementar `delete(imageId)`: eliminar archivo y registro
    - Servir carpeta uploads como estático
    - _Requisitos: 1.5_

  - [ ] 4.4 Implementar servicio de colores
    - Crear `backend/src/services/color.service.ts`
    - Implementar `add(productId, colorName)`: validar unicidad y límite de 20 colores
    - Implementar `remove(productId, colorId)`: eliminar color
    - Manejar error 409 si color duplicado
    - _Requisitos: 2.1, 2.2, 2.3_

  - [ ] 4.5 Implementar rutas de productos (admin y público)
    - Crear `backend/src/routes/product.routes.ts` (rutas públicas)
    - Crear `backend/src/routes/admin/product.routes.ts` (rutas protegidas)
    - GET `/api/products`: lista paginada de productos disponibles (20/página, orden alfabético)
    - GET `/api/products/:id`: detalle de producto
    - GET `/api/products/search?q=`: búsqueda
    - POST/PUT/DELETE `/api/admin/products`: CRUD completo protegido
    - POST/DELETE `/api/admin/products/:id/images`: gestión de imágenes
    - POST/DELETE `/api/admin/products/:id/colors`: gestión de colores
    - _Requisitos: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 6.1, 6.2, 6.3_

  - [ ]* 4.6 Tests de propiedades para productos
    - **Propiedad 1: Round-trip de creación de artículo**
    - **Propiedad 2: Rechazo de artículo con datos inválidos**
    - **Propiedad 3: Límite de imágenes por artículo**
    - **Propiedad 4: Unicidad y límite de colores**
    - **Propiedad 6: Invariante de disponibilidad del producto**
    - **Propiedad 8: Validación de stock**
    - **Valida: Requisitos 1.1, 1.2, 1.5, 2.1, 2.2, 3.1, 3.2, 3.3, 3.4, 3.5, 4.5**

- [ ] 5. Backend - Promociones
  - [ ] 5.1 Implementar servicio de promociones
    - Crear `backend/src/services/promotion.service.ts`
    - Implementar `create(productId, data)`: validar porcentaje [1-99], fechas válidas, unicidad por artículo
    - Implementar `update(id, data)`: editar promoción
    - Implementar `cancel(id)`: desactivar promoción manualmente
    - Implementar `getActiveForProduct(productId)`: obtener promoción activa actual
    - Implementar cálculo de precio con descuento: `Math.round(price * (1 - discountPercentage / 100))`
    - _Requisitos: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

  - [ ] 5.2 Implementar rutas de promociones
    - POST `/api/admin/products/:id/promotions`: crear promoción
    - PUT `/api/admin/promotions/:id`: editar promoción
    - DELETE `/api/admin/promotions/:id`: cancelar promoción
    - Incluir precio con descuento en respuesta pública de productos
    - _Requisitos: 5.1, 5.3, 5.5_

  - [ ]* 5.3 Tests de propiedades para promociones
    - **Propiedad 10: Cálculo de precio con descuento**
    - **Propiedad 11: Validación de promoción**
    - **Propiedad 12: Unicidad de promoción activa por artículo**
    - **Valida: Requisitos 5.1, 5.2, 5.3, 5.6**

- [ ] 6. Backend - Configuración de envío, pago y WhatsApp
  - [ ] 6.1 Implementar servicio y rutas de opciones de envío
    - Crear `backend/src/services/shipping.service.ts`
    - CRUD de opciones de envío: nombre (máx 50 chars), descripción (máx 200 chars), isActive, sortOrder
    - GET `/api/shipping-options`: opciones activas (público)
    - GET/POST/PUT/DELETE `/api/admin/shipping-options`: gestión completa (protegido)
    - _Requisitos: 8.1, 8.3_

  - [ ] 6.2 Implementar servicio y rutas de opciones de pago
    - Crear `backend/src/services/payment.service.ts`
    - CRUD de opciones de pago: nombre (máx 50 chars), descripción (máx 200 chars), isActive, sortOrder
    - GET `/api/payment-options`: opciones activas (público)
    - GET/POST/PUT/DELETE `/api/admin/payment-options`: gestión completa (protegido)
    - _Requisitos: 9.1, 9.3_

  - [ ] 6.3 Implementar configuración de WhatsApp
    - Crear `backend/src/services/config.service.ts`
    - GET `/api/config/whatsapp`: obtener número configurado (público)
    - PUT `/api/admin/config/whatsapp`: actualizar número, validar 10-15 dígitos
    - _Requisitos: 10.4, 10.6_

  - [ ]* 6.4 Tests de propiedades para validación de WhatsApp
    - **Propiedad 19: Validación del número de WhatsApp**
    - **Valida: Requisitos 10.4**

- [ ] 7. Checkpoint backend
  - Asegurarse de que todos los tests pasen, consultar al usuario si surgen dudas.

- [ ] 8. Frontend - Layout y enrutamiento
  - [ ] 8.1 Configurar enrutamiento y layouts base
    - Crear `frontend/src/App.tsx` con React Router
    - Definir rutas: `/` (catálogo), `/product/:id` (detalle), `/cart` (carrito), `/checkout` (checkout), `/admin` (panel admin), `/admin/login` (login)
    - Crear `PublicLayout` con header (logo SOLCITO REGALERIA, barra búsqueda, icono carrito)
    - Crear `AdminLayout` con sidebar de navegación
    - Implementar componente `ProtectedRoute` que verifica JWT
    - _Requisitos: 6.1, 11.3_

  - [ ] 8.2 Implementar servicio de API (cliente HTTP)
    - Crear `frontend/src/services/api.ts`
    - Configurar instancia de fetch/axios con baseURL
    - Implementar interceptor para agregar JWT a requests admin
    - Implementar manejo de errores 401 (redirigir a login)
    - _Requisitos: 11.3, 11.6_

- [ ] 9. Frontend - Catálogo público
  - [ ] 9.1 Implementar componentes del catálogo
    - Crear `ProductGrid`: grilla responsive con paginación (20 artículos/página)
    - Crear `ProductCard`: tarjeta con imagen, nombre, precio (con formato ARS)
    - Crear `Pagination`: controles de navegación entre páginas
    - Crear `SearchBar`: input de búsqueda con debounce (mínimo 2 caracteres)
    - Crear `PriceDisplay`: formatea precios en formato $X.XXX,XX
    - Crear `PromotionBadge`: muestra precio original tachado y precio con descuento
    - _Requisitos: 6.1, 6.3, 6.4, 6.5, 4.3, 5.3_

  - [ ] 9.2 Implementar página de detalle del producto
    - Crear `ProductDetail`: galería de imágenes, descripción, colores, precio, disponibilidad
    - Crear `ColorSelector`: botones de selección de color
    - Implementar botón "Agregar al carrito" con validación de color requerido
    - Mostrar estado de disponibilidad
    - _Requisitos: 6.2, 2.4, 2.5, 2.6, 3.6_

  - [ ]* 9.3 Tests de propiedades para catálogo
    - **Propiedad 9: Formateo de precios en ARS**
    - **Propiedad 13: Paginación y orden del catálogo**
    - **Propiedad 14: Búsqueda parcial case-insensitive**
    - **Valida: Requisitos 4.3, 6.1, 6.3**

- [ ] 10. Frontend - Carrito de compras
  - [ ] 10.1 Implementar lógica del carrito (Context + localStorage)
    - Crear `frontend/src/context/CartContext.tsx`
    - Implementar CartProvider con estado persistido en localStorage
    - Acciones: addItem, removeItem, updateQuantity, clearCart
    - Implementar fusión de duplicados (mismo producto + mismo color)
    - Implementar límite de stock al agregar/modificar cantidad
    - Implementar validación de color requerido si el producto tiene colores
    - Calcular total como suma de (cantidad × precio unitario)
    - Implementar detección de datos corruptos en localStorage (reset si JSON inválido)
    - _Requisitos: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 2.5, 2.6, 3.6_

  - [ ] 10.2 Implementar componentes visuales del carrito
    - Crear `CartDrawer`: panel lateral con lista de artículos
    - Crear `CartItem`: línea con imagen, nombre, color, cantidad (+/-), precio, botón eliminar
    - Crear `CartSummary`: total acumulado y botón "Ir al checkout"
    - Crear icono de carrito en header con badge de cantidad de items
    - _Requisitos: 7.1, 7.2, 7.3, 7.4_

  - [ ]* 10.3 Tests de propiedades para carrito
    - **Propiedad 5: Requisito de color en el carrito**
    - **Propiedad 7: Carrito impide agregar artículos no disponibles**
    - **Propiedad 15: Invariante del total del carrito**
    - **Propiedad 16: Límite de stock en el carrito**
    - **Propiedad 17: Fusión de duplicados en el carrito**
    - **Valida: Requisitos 2.5, 2.6, 3.6, 7.1, 7.2, 7.3, 7.5, 7.6**

- [ ] 11. Frontend - Checkout y WhatsApp
  - [ ] 11.1 Implementar página de checkout
    - Crear `CheckoutPage`: resumen del pedido, selección de envío y pago
    - Crear `ShippingOptions`: lista de opciones de envío disponibles
    - Crear `PaymentOptions`: lista de opciones de pago disponibles
    - Crear `OrderSummary`: tabla con artículos, cantidades, precios, subtotales y total
    - Implementar validación: impedir envío si falta selección de envío, pago o carrito vacío
    - _Requisitos: 8.1, 8.2, 9.1, 9.2, 10.5_

  - [ ] 11.2 Implementar generación de mensaje WhatsApp
    - Crear `frontend/src/utils/whatsapp.ts`
    - Implementar `generateWhatsAppMessage(order)`: generar texto con todos los detalles del pedido
    - Implementar `generateWhatsAppUrl(phoneNumber, message)`: crear URL `https://wa.me/{número}?text={mensaje_codificado}`
    - Crear `WhatsAppButton`: botón que abre WhatsApp en nueva pestaña
    - Vaciar carrito tras generación exitosa del mensaje
    - Mostrar confirmación de pedido enviado
    - _Requisitos: 10.1, 10.2, 10.3, 10.5, 10.6, 10.7_

  - [ ]* 11.3 Tests de propiedades para checkout y WhatsApp
    - **Propiedad 18: Completitud del mensaje de WhatsApp**
    - **Propiedad 20: Validación previa al envío del pedido**
    - **Propiedad 21: Vaciado del carrito post-envío**
    - **Valida: Requisitos 10.1, 10.2, 10.3, 10.5, 10.7**

- [ ] 12. Checkpoint frontend público
  - Asegurarse de que todos los tests pasen, consultar al usuario si surgen dudas.

- [ ] 13. Frontend - Panel de administración
  - [ ] 13.1 Implementar login de administradora
    - Crear `LoginForm`: formulario con campos usuario y contraseña
    - Integrar con POST `/api/auth/login`
    - Almacenar JWT en localStorage tras login exitoso
    - Mostrar mensaje de error genérico ante credenciales inválidas
    - Mostrar mensaje de bloqueo temporal si cuenta bloqueada
    - Redirigir a panel admin tras login exitoso
    - _Requisitos: 11.1, 11.2, 11.4_

  - [ ] 13.2 Implementar gestión de productos en admin
    - Crear `ProductForm`: formulario con nombre, descripción, precio, stock, isManuallyUnavailable
    - Crear `ImageUploader`: drag & drop o selector de archivos, vista previa, máx 10 imágenes
    - Crear `ColorManager`: agregar/eliminar colores con validación de unicidad
    - Crear lista de productos con acciones editar/eliminar
    - Implementar confirmación antes de eliminar
    - _Requisitos: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 3.1, 3.2, 3.4_

  - [ ] 13.3 Implementar gestión de promociones en admin
    - Crear `PromotionForm`: porcentaje de descuento, fecha inicio, fecha fin
    - Mostrar promoción activa actual si existe
    - Implementar cancelación de promoción
    - Validar que no exista otra promoción activa
    - _Requisitos: 5.1, 5.2, 5.5, 5.6_

  - [ ] 13.4 Implementar configuración de envío, pago y WhatsApp
    - Crear `ShippingConfig`: CRUD de opciones de envío
    - Crear `PaymentConfig`: CRUD de opciones de pago
    - Crear `WhatsAppConfig`: input de número con validación de 10-15 dígitos
    - _Requisitos: 8.3, 9.3, 10.4_

- [ ] 14. Integración final y wiring
  - [ ] 14.1 Configurar servidor Express para servir frontend en producción
    - Configurar Express para servir archivos estáticos del build de frontend
    - Configurar manejo de rutas SPA (fallback a index.html)
    - Configurar CORS para desarrollo
    - Crear script de build unificado
    - _Requisitos: Infraestructura_

  - [ ] 14.2 Implementar verificación de stock en tiempo real en checkout
    - Antes de generar mensaje WhatsApp, verificar stock actual de cada artículo del carrito vía API
    - Si algún artículo ya no está disponible, notificar al cliente y removerlo del carrito
    - _Requisitos: 3.7_

  - [ ]* 14.3 Tests de integración end-to-end
    - Flujo completo: crear artículo → visible en catálogo → agregar al carrito → checkout → WhatsApp
    - Flujo de promoción: crear → verificar precio en catálogo → expiración
    - Flujo de autenticación: login → operaciones admin → expiración → rechazo
    - _Requisitos: Todos_

- [ ] 15. Despliegue en Internet
  - [ ] 15.1 Configurar Cloudinary para imágenes
    - Crear cuenta gratuita en Cloudinary
    - Instalar `cloudinary` SDK en el backend
    - Reemplazar almacenamiento local de imágenes por upload a Cloudinary
    - Actualizar modelo ProductImage para usar URL de Cloudinary en lugar de filePath local
    - Configurar transformaciones automáticas (resize, formato WebP)
    - Variables de entorno: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
    - _Requisitos: Accesibilidad global de imágenes_

  - [ ] 15.2 Preparar backend para Railway
    - Crear archivo `Procfile` o configurar start command
    - Configurar SQLite en volumen persistente (`/data/solcito.db`)
    - Agregar `helmet.js` para headers de seguridad
    - Configurar CORS para permitir solo el dominio de Vercel
    - Configurar variables de entorno en Railway: `DATABASE_URL`, `JWT_SECRET`, `CLOUDINARY_URL`, `CORS_ORIGIN`, `PORT`
    - Crear cuenta en Railway y conectar repositorio GitHub
    - Realizar primer deploy y verificar que la API responda
    - _Requisitos: Disponibilidad pública del backend_

  - [ ] 15.3 Preparar frontend para Vercel
    - Configurar variable de entorno `VITE_API_URL` apuntando a la URL de Railway
    - Crear archivo `vercel.json` con rewrites para SPA routing
    - Verificar que el build de producción funcione correctamente
    - Crear cuenta en Vercel y conectar repositorio GitHub
    - Realizar primer deploy y verificar que el catálogo cargue
    - _Requisitos: Accesibilidad pública del frontend_

  - [ ] 15.4 Configurar diseño responsive (mobile-first)
    - Verificar que todos los componentes usen clases responsive de Tailwind
    - Catálogo: 1 columna en celular, 2 en sm, 3 en md, 4 en lg
    - Header: menú hamburguesa en mobile, barra completa en desktop
    - Carrito: fullscreen en mobile, drawer lateral en desktop
    - Panel admin: sidebar colapsable en mobile
    - Formularios: width 100% en mobile, contenido centrado en desktop
    - Testear en Chrome DevTools con distintos tamaños de pantalla
    - _Requisitos: Compatibilidad con cualquier dispositivo_

  - [ ] 15.5 Verificación final de despliegue
    - Verificar acceso desde celular usando datos móviles (no WiFi)
    - Verificar que HTTPS funcione correctamente en ambos servicios
    - Verificar login de admin desde URL pública
    - Verificar flujo completo: navegar catálogo → carrito → checkout → WhatsApp
    - Verificar carga de imágenes desde panel admin en producción
    - Verificar que el mensaje de WhatsApp se genere correctamente en mobile
    - _Requisitos: Funcionamiento completo en internet_

- [ ] 16. Checkpoint final
  - Asegurarse de que todos los tests pasen y la app funcione correctamente en internet.

## Notes

- Las tareas marcadas con `*` son opcionales y pueden omitirse para un MVP más rápido
- Cada tarea referencia requisitos específicos para trazabilidad
- Los checkpoints aseguran validación incremental
- Los tests de propiedades validan propiedades de correctitud universales usando fast-check
- Los tests unitarios validan ejemplos específicos y casos borde
- El carrito se almacena completamente en localStorage del navegador (sin backend)
- Las imágenes se almacenan en Cloudinary (CDN global) para acceso desde cualquier red
- La app es accesible públicamente a través de HTTPS desde cualquier dispositivo y red
- El frontend se despliega en Vercel (CDN global) y el backend en Railway (Node.js + SQLite persistente)
- Ambas plataformas tienen tier gratuito suficiente para una tienda pequeña

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3", "1.4"] },
    { "id": 2, "tasks": ["2.1"] },
    { "id": 3, "tasks": ["2.2", "3.1", "4.1", "4.2", "4.3", "4.4"] },
    { "id": 4, "tasks": ["3.2", "3.3", "4.5", "5.1", "6.1", "6.2", "6.3"] },
    { "id": 5, "tasks": ["3.4", "4.6", "5.2"] },
    { "id": 6, "tasks": ["5.3", "6.4", "8.1", "8.2"] },
    { "id": 7, "tasks": ["9.1", "9.2", "10.1"] },
    { "id": 8, "tasks": ["9.3", "10.2", "10.3"] },
    { "id": 9, "tasks": ["11.1", "11.2"] },
    { "id": 10, "tasks": ["11.3", "13.1"] },
    { "id": 11, "tasks": ["13.2", "13.3", "13.4"] },
    { "id": 12, "tasks": ["14.1", "14.2"] },
    { "id": 13, "tasks": ["14.3"] },
    { "id": 14, "tasks": ["15.1", "15.2", "15.3", "15.4"] },
    { "id": 15, "tasks": ["15.5"] }
  ]
}
```

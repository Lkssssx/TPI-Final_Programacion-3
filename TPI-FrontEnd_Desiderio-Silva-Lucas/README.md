# Food Store - Frontend Web (TPI Programación III)

## ✍️ Descripción

Este proyecto corresponde a la Parte 1 (Frontend) del sistema de gestión de pedidos de comida "Food Store". Está desarrollado utilizando **Vite** y **TypeScript**.

En esta primera iteración, la aplicación consume los datos simulando una API REST mediante peticiones `fetch()` a archivos `.json` locales. El objetivo es resolver la interfaz y los flujos de usuario de manera independiente, para luego conectar estas peticiones al backend JPA en una futura etapa.

---

## 🔐 Credenciales de Prueba

Para evaluar los distintos roles del sistema y el enrutamiento protegido, utilizar las siguientes credenciales (definidas en `public/data/usuarios.json`):

* **Rol Administrador (ADMIN):**
    * **Email:** admin@admin.com
    * **Contraseña:** 123456
* **Rol Cliente (USUARIO):**
    * **Email:** cliente@food.com
    * **Contraseña:** cliente123

---

## 🚀 Instalación y Uso

Se recomienda usar `pnpm` como gestor de paquetes para mayor eficiencia en el manejo de dependencias.

### 1. Instalar pnpm

Si no tienes `pnpm` instalado, puedes hacerlo fácilmente a través de `npm` (que viene con Node.js) ejecutando el siguiente comando en tu terminal:

```bash
npm install -g pnpm
```

### 2. Instalar Dependencias del Proyecto

Una vez en la carpeta raíz del proyecto, instala las dependencias necesarias con `pnpm`:

```bash
pnpm install
```

### 3. Ejecutar el Proyecto

Para iniciar el servidor de desarrollo de Vite, ejecuta:

```bash
pnpm run dev
```

La aplicación estará disponible en la URL que aparezca en la terminal (generalmente `http://localhost:5173`).

---

## ⚠️ Seguridad y Arquitectura actual (Iteración 1)

**IMPORTANTE:** Este proyecto **NO** implementa seguridad real en el frontend en esta etapa.

* **Autenticación Simulada:** Las contraseñas se comparan en texto plano contra el archivo local `usuarios.json` únicamente con fines educativos.
* **Gestión de Sesión:** La validación de rol y el acceso a rutas protegidas se gestiona guardando el estado en el `localStorage`.
* **Persistencia Volátil:** Las operaciones de escritura (crear productos, cambiar estados de pedidos) se aplican únicamente en la memoria del cliente. Al recargar la página, se restaurará el estado original de los archivos `.json`.

---

## 📁 Estructura Principal del Proyecto

```text
final-prog3/
├── index.html                # Redirección a login
├── package.json              # Dependencias y scripts
├── tsconfig.json             # Configuración TypeScript
├── vite.config.ts            # Configuración Vite
├── public/
│   └── data/                 # Archivos JSON locales que simulan la BD
│       ├── categorias.json
│       ├── productos.json
│       ├── usuarios.json
│       └── pedidos.json
└── src/
    ├── main.ts               # Punto de entrada
    ├── css/                  # Estilos
    ├── types/                # Definiciones de tipos TypeScript
    ├── utils/                # Utilidades y helpers (fetch, auth, cart)
    └── pages/
        ├── auth/             # Login y registro
        │   ├── login/
        │   └── register/
        ├── store/            # Páginas del cliente
        │   ├── home/         # Catálogo de productos
        │   ├── productDetail/
        │   └── cart/         # Carrito de compras
        ├── client/           # Área del cliente
        │   └── orders/       # Mis pedidos
        └── admin/            # Panel de administración
            ├── adminHome/    # Dashboard
            ├── categories/   # CRUD categorías
            ├── products/     # CRUD productos
            └── orders/       # Gestión de pedidos
```
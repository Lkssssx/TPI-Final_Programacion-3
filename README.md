# 🍔 Food Store — Sistema de Gestión de Pedidos de Comida

**Trabajo Final Integrador — Programación III**
Universidad Tecnológica Nacional · Tecnicatura Universitaria en Programación a Distancia

> Desarrollado por **Lucas Desiderio Silva** · Profesores: Alberto Cortez, Cinthia Rigoni · Entrega: 29/06/2026

---

## 📌 Descripción

Food Store es un sistema de gestión de pedidos de comida implementado en dos partes independientes y complementarias:

- **Parte 1 — Frontend Web:** interfaz construida con TypeScript y Vite que consume datos desde archivos `.json` locales mediante `fetch()`, permitiendo verificar todos los flujos de usuario de forma independiente al backend. En una iteración futura, reemplazar los fetch a `.json` por llamadas a la API REST del backend requiere únicamente modificar la URL en los módulos de utilidades.

- **Parte 2 — Backend JPA / Consola:** aplicación Java con JPA, Hibernate y base de datos H2 en archivo. Expone todas las operaciones a través de un menú de consola navegable con CRUD completo de categorías, productos, usuarios y pedidos, incluyendo soft delete, consultas JPQL personalizadas y gestión transaccional atómica.

---

## 📁 Estructura del Repositorio

```
TPI-Final_Programacion-3/
├── TPI-FrontEnd_Desiderio-Silva-Lucas/   # Parte 1 — Frontend Web (Vite + TypeScript)
└── TPI-BackEnd_Desiderio-Silva-Lucas/    # Parte 2 — Backend JPA (Java + Hibernate + H2)
```

Cada carpeta contiene su propio `README.md` con instrucciones de instalación y ejecución detalladas.

---

## 🚀 Inicio Rápido

### Frontend

```bash
cd TPI-FrontEnd_Desiderio-Silva-Lucas
pnpm install
pnpm run dev
```
Disponible en `http://localhost:5173`

### Backend

```bash
cd TPI-BackEnd_Desiderio-Silva-Lucas
./gradlew run
```

---

## 🔐 Credenciales de Prueba (Frontend)

| Rol | Email | Contraseña |
|---|---|---|
| Administrador | lucas@mail.com | pass123 |
| Cliente | juan@mail.com | pass456 |

---

## 🛠️ Stack Tecnológico

| Parte | Tecnologías |
|---|---|
| Frontend | TypeScript · Vite · HTML5 · CSS3 |
| Backend | Java 21 · JPA · Hibernate 6 · H2 · Gradle |
| Control de versiones | Git · GitHub |

---

## 📐 Modelo de Dominio

El backend modela seis entidades JPA (`Base`, `Categoria`, `Producto`, `Usuario`, `Pedido`, `DetallePedido`) con relaciones de distinta cardinalidad y direccionalidad, tres enumerados (`Rol`, `Estado`, `FormaPago`) y una interfaz `Calculable` implementada por `Pedido`.

---

## 🎥 Video Demostrativo

> 🔗 [REEMPLAZAR CON EL LINK AL VIDEO]

El video cubre el flujo completo de ambas partes: login por rol, catálogo, carrito, checkout, panel admin, y demostración del menú de consola con alta de pedido, reportes y baja lógica.

---

## 📄 Informe Técnico

> 🔗 [REEMPLAZAR CON EL LINK AL PDF O SUBIR EL PDF A LA RAÍZ DEL REPO]

---

## 📂 READMEs por Módulo

- [📘 README — Frontend](./TPI-FrontEnd_Desiderio-Silva-Lucas/README.md)
- [📗 README — Backend](./TPI-BackEnd_Desiderio-Silva-Lucas/README.md)
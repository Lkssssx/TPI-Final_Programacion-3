# Food Store - Backend JPA/Consola (TPI Programación III)

## ✍️ Descripción

Este proyecto corresponde a la Parte 2 (Backend) del sistema de gestión de pedidos de comida **Food Store**. Está desarrollado en **Java** utilizando **JPA**, **Hibernate** y base de datos **H2 en archivo**.

La interacción con el sistema se realiza completamente a través de un **menú de consola navegable** que permite gestionar todas las entidades del modelo: `Categoria`, `Producto`, `Usuario` y `Pedido` (con sus `DetallePedido`).

---

## 🚀 Instalación y Uso

### Requisitos previos

- Java 17 o superior
- Gradle (o usar el wrapper incluido `./gradlew`)

### Ejecutar el proyecto

Desde la carpeta raíz del proyecto backend, ejecutar:

```bash
./gradlew run
```

O bien compilar y ejecutar manualmente:

```bash
./gradlew build
./gradlew run
```

La base de datos H2 se crea automáticamente en `./data/jpa_db` al iniciar la aplicación por primera vez.

---

## 🗂️ Menú de Consola

Al iniciar la aplicación, se presenta el siguiente menú principal:

```
====== FOOD STORE ======
1. Gestionar Categorías
2. Gestionar Productos
3. Gestionar Usuarios
4. Gestionar Pedidos
5. Reportes
0. Salir
```

> **Orden de uso recomendado:** Crear primero Categorías → luego Productos → luego Usuarios → por último Pedidos.

---

## 🏗️ Arquitectura y Estructura del Proyecto

```text
backend/
├── build.gradle
├── settings.gradle
├── data/                          # Base de datos H2 generada en tiempo de ejecución
└── src/
    └── main/
        ├── java/
        │   └── com/tp/jpa/
        │       ├── Main.java                  # Clase principal con el menú de consola
        │       ├── model/                     # Entidades JPA
        │       │   ├── Base.java              # Clase abstracta padre (@MappedSuperclass)
        │       │   ├── Categoria.java
        │       │   ├── Producto.java
        │       │   ├── Usuario.java
        │       │   ├── Pedido.java            # Implementa Calculable
        │       │   ├── DetallePedido.java
        │       │   └── enums/
        │       │   │   ├── Rol.java           # ADMIN, USUARIO
        │       │   │   ├── Estado.java        # PENDIENTE, CONFIRMADO, TERMINADO, CANCELADO
        │       │   │   └── FormaPago.java     # TARJETA, TRANSFERENCIA, EFECTIVO
        │       │   └── DTOs/
        │       │       ├── UsuarioDTO,java
        │       ├── util/
        │       │   ├── JPAUtil.java           # Fábrica singleton de EntityManagerFactory
        │       │   └── Input.java              # Manejador de diferentes tipos de input (boolean, Estado, int, etc.)
        │       └── repository/
        │           ├── BaseRepository.java    # CRUD genérico abstracto
        │           ├── CategoriaRepository.java
        │           ├── ProductoRepository.java
        │           ├── UsuarioRepository.java
        │           └── PedidoRepository.java
        │           └── DetallePedidoRepository.java
        └── resources/
            └── META-INF/
                └── persistence.xml            # Configuración JPA/H2
```

---

## 🗄️ Modelo de Dominio

| Entidad | Campos principales |
|---|---|
| `Base` (abstracta) | `id`, `eliminado`, `createdAt` |
| `Categoria` | `nombre`, `descripcion` |
| `Producto` | `nombre`, `precio`, `descripcion`, `stock`, `imagen`, `disponible` |
| `Usuario` | `nombre`, `apellido`, `mail`, `celular`, `contrasena`, `rol` |
| `Pedido` | `fecha`, `estado`, `total`, `formaPago` |
| `DetallePedido` | `cantidad`, `subtotal`, `producto`, `pedido` |

### Relaciones

- `Producto` → `Categoria`: `@ManyToOne` (unidireccional)
- `Pedido` → `DetallePedido`: `@OneToMany` con `CascadeType.ALL` (bidireccional)
- `DetallePedido` → `Producto`: `@ManyToOne` (unidireccional)
- `Usuario` → `Pedido`: `@OneToMany` con `CascadeType.ALL` (unidireccional)

---

## 🔧 Componentes Clave

### `BaseRepository<T>`
Clase abstracta genérica que provee las operaciones CRUD comunes:

| Método | Descripción |
|---|---|
| `guardar(T entity)` | `persist()` si es alta, `merge()` si es actualización |
| `buscarPorId(Long id)` | Retorna `Optional<T>` |
| `listarActivos()` | JPQL filtrando `eliminado = false` |
| `eliminarLogico(Long id)` | Soft delete: establece `eliminado = true` |

### Consultas JPQL personalizadas

| Repositorio | Método | Descripción |
|---|---|---|
| `CategoriaRepository` | `buscarProductosPorCategoria(Long id)` | Productos activos de una categoría |
| `UsuarioRepository` | `buscarPorMail(String mail)` | Retorna `Optional<Usuario>` |
| `UsuarioRepository` | `buscarPedidosPorUsuario(Long id)` | Pedidos activos de un usuario |
| `PedidoRepository` | `buscarPorEstado(Estado estado)` | Pedidos activos por estado |

---

## ⚠️ Reglas Técnicas Importantes

- **Bajas siempre lógicas:** `eliminado = true`. El registro permanece en la BD y no aparece en listados activos.
- **Transacciones:** Cada método de repositorio abre y cierra su propio `EntityManager` en un bloque `finally`.
- **Alta de pedido atómica:** Toda la operación (validaciones de stock, reducción de inventario, creación de detalles) ocurre en una única transacción. Ante cualquier error se hace rollback completo.
- **Campos en blanco al modificar:** Dejar un campo vacío durante una modificación conserva el valor anterior.
- **Cierre limpio:** Al seleccionar la opción `0. Salir`, se llama a `JPAUtil.close()` para cerrar correctamente el `EntityManagerFactory`.

---

## 🗃️ Configuración de Base de Datos

La base de datos H2 se configura en `src/main/resources/META-INF/persistence.xml`:

- **URL:** `jdbc:h2:file:./data/jpa_db`
- **Modo:** archivo (persistente entre ejecuciones)
- **DDL:** `hbm2ddl.auto = update` (Hibernate gestiona el esquema automáticamente)
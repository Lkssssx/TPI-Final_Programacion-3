package com.tp.jpa;

import com.tp.jpa.model.*;
import com.tp.jpa.model.enums.Estado;
import com.tp.jpa.model.enums.FormaPago;
import com.tp.jpa.model.enums.Rol;
import com.tp.jpa.repository.*;
import com.tp.jpa.util.Input;
import com.tp.jpa.util.JPAUtil;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;

import java.time.LocalDateTime;
import java.util.*;


public class Main {

    private static final EntityManagerFactory emf = JPAUtil.getEntityManagerFactory();

    public static void main(String[] args) {

        // Usamos try-with-resources para cargar los datos de testeo
        try (EntityManager em = emf.createEntityManager()) {
            Long baseCargada = em.createQuery("SELECT COUNT(p) FROM Producto p", Long.class).getSingleResult();
            // Función para cargar los datos y mantener el código más legible. Además de validar si ya está cargada para no volverlo a hacer.
            if (baseCargada != 0L) {
                System.out.println("La base ya está cargada.");
            } else {
                System.out.println("Cargando base...");
                cargarDatos(em);
            }
        } catch (Exception e) {
            System.out.println("ERROR: " + e.getClass().getSimpleName() + " - " + e.getMessage());
        }

        // Primero creamos los repositories para después usarlos cómodamente
        CategoriaRepository cr = new CategoriaRepository();
        ProductoRepository pr = new ProductoRepository();
        UsuarioRepository ur = new UsuarioRepository();
        PedidoRepository pedr = new PedidoRepository();
        DetallePedidoRepository dpr = new DetallePedidoRepository();

        // Flag para controlar el bucle
        boolean salir = false;

        // Bucle while para el menú
        while (!salir) {

            // ========================================== MENÚ PRINCIPAL ==========================================
            System.out.println("\n=== MENÚ PRINCIPAL ===");
            System.out.println("1. Categorías");
            System.out.println("2. Productos");
            System.out.println("3. Usuarios");
            System.out.println("4. Pedidos");
            System.out.println("5. Reportes");
            System.out.println("0. Salir");
            System.out.print("Seleccione una opción: ");
            int opcionPrincipal = Input.scanInt("");

            switch (opcionPrincipal) {

                case 1 -> {

                    // ========================================== SUBMENÚ CATEGORÍAS ==========================================

                    boolean volverCategorias = false;
                    while (!volverCategorias) {

                        System.out.println("\n=== MENÚ CATEGORÍAS ===");
                        System.out.println("1. Alta de categoría");
                        System.out.println("2. Modificación de categoría");
                        System.out.println("3. Baja de categoría");
                        System.out.println("4. Listado de categorías");
                        System.out.println("0. Volver al menú principal");
                        System.out.print("Seleccione una opción: ");
                        int opcionCategoria = Input.scanInt("");

                        switch (opcionCategoria) {
                            case 1 -> altaCategoria(cr);
                            case 2 -> modificacionCategoria(cr);
                            case 3 -> bajaCategoria(cr);
                            case 4 -> listadoCategorias(cr);
                            case 0 -> volverCategorias = true;
                            default -> System.out.println("Opción inválida. Intente nuevamente.");
                        }
                    }
                }
                case 2 -> {

                    // ========================================== SUBMENÚ PRODUCTOS ==========================================
                    boolean volverProductos = false;
                    while (!volverProductos) {

                        System.out.println("\n=== MENÚ PRODUCTOS ===");
                        System.out.println("1. Alta de producto");
                        System.out.println("2. Modificación de producto");
                        System.out.println("3. Baja de producto");
                        System.out.println("4. Listado de productos");
                        System.out.println("0. Volver al menú principal");
                        System.out.print("Seleccione una opción: ");
                        int opcionProducto = Input.scanInt("");

                        switch (opcionProducto) {
                            case 1 -> altaProducto(cr, pr);
                            case 2 -> modificacionProducto(pr);
                            case 3 -> bajaProducto(pr);
                            case 4 -> listadoProductos(cr, pr);
                            case 0 -> volverProductos = true;
                            default -> System.out.println("Opción inválida. Intente nuevamente.");
                        }
                    }
                }
                case 3 -> {

                    // ========================================== SUBMENÚ USUARIOS ==========================================
                    boolean volverUsuarios = false;
                    while (!volverUsuarios) {

                        System.out.println("\n=== MENÚ USUARIOS ===");
                        System.out.println("1. Alta de usuario");
                        System.out.println("2. Modificar usuario");
                        System.out.println("3. Baja de usuario");
                        System.out.println("4. Listado de usuarios");
                        System.out.println("5. Buscar por mail");
                        System.out.println("0. Volver al menú principal");
                        System.out.print("Seleccione una opción: ");
                        int opcionUsuario = Input.scanInt("");

                        switch (opcionUsuario) {
                            case 1 -> altaUsuario(ur);
                            case 2 -> modificacionUsuario(ur);
                            case 3 -> bajaUsuario(ur);
                            case 4 -> listadoUsuarios(ur);
                            case 5 -> buscarUsuarioPorMail(ur, pedr);
                            case 0 -> volverUsuarios = true;
                            default -> System.out.println("Opción inválida. Intente nuevamente.");
                        }
                    }
                }
                case 4 -> {

                    // ========================================== SUBMENÚ PEDIDOS ==========================================
                    boolean volverPedidos = false;
                    while (!volverPedidos) {

                        System.out.println("\n=== MENÚ PEDIDOS ===");
                        System.out.println("1. Alta de pedido");
                        System.out.println("2. Cambiar estado");
                        System.out.println("3. Baja de pedido");
                        System.out.println("4. Listado de pedidos");
                        System.out.println("5. Pedidos por usuario");
                        System.out.println("6. Pedidos por estado");
                        System.out.println("0. Volver al menú principal");
                        System.out.print("Seleccione una opción: ");
                        int opcionPedido = Input.scanInt("");

                        switch (opcionPedido) {
                            case 1 -> altaPedido(ur, pr);
                            case 2 -> cambiarEstadoPedido(pedr);
                            case 3 -> bajaPedido(pedr);
                            case 4 -> listadoPedidos(pedr);
                            case 5 -> pedidosPorUsuario(ur);
                            case 6 -> pedidosPorEstado(pedr, ur);
                            case 0 -> volverPedidos = true;
                            default -> System.out.println("Opción inválida. Intente nuevamente.");
                        }
                    }
                }
                case 5 ->  {

                    // ========================================== SUBMENÚ REPORTES ==========================================
                    boolean volverReportes = false;
                    while (!volverReportes) {

                        System.out.println("\n=== MENÚ REPORTES ===");
                        System.out.println("1. Productos por categoría");
                        System.out.println("2. Pedidos por usuario");
                        System.out.println("3. Pedidos por estado");
                        System.out.println("4. Total facturado");
                        System.out.println("0. Volver al menú principal");
                        System.out.print("Seleccione una opción: ");
                        int opcionReporte = Input.scanInt("");

                        switch (opcionReporte) {
                            case 1 -> reporteProductosPorCategoria(cr, pr);
                            case 2 -> reportePedidosPorUsuario(ur);
                            case 3 -> reportePedidosPorEstado(pedr, ur);
                            case 4 -> reporteTotalFacturado(pedr);
                            case 0 -> volverReportes = true;
                            default -> System.out.println("Opción inválida. Intente nuevamente.");
                        }
                    }
                }
                case 0 -> {
                    salir = true;
                    JPAUtil.close();
                    System.out.println("Cerrando programa.");
                }
                default -> System.out.println("Opción inválida. Intente nuevamente.");
            }
        }
    }




    // ========================================== MÉTODOS CATEGORÍAS ==========================================

    private static void altaCategoria(CategoriaRepository cr) {
        System.out.println("\n--- ALTA DE CATEGORÍA ---");
        String nombre = Input.scanString("Ingrese el nombre: ");

        // Validamos que no esté vacío.
        while (nombre.trim().isEmpty()) {
            System.out.println();
            System.out.println("ERROR. Debe ingresar un nombre");
            nombre = Input.scanString("Ingrese el nombre: ");
        }

        String descripcion = Input.scanString("Ingrese la descripción: ");
        // Crear una instancia, persistir y mostrar ID generado

        Categoria categoria = Categoria.builder().nombre(nombre).descripcion(descripcion).build();
        cr.guardar(categoria);
        System.out.println("Categoría añadida correctamente con el ID: " + categoria.getId());
    }

    private static void modificacionCategoria(CategoriaRepository cr) {
        System.out.println("\n--- MODIFICACIÓN DE CATEGORÍA ---");
        // Listamos las categorías
        cr.listarActivos().forEach(System.out::println);

        // Pedimos el ID
        Long id = Input.scanLong("Ingrese el ID de la categoría a modificar: ");

        // Buscar por ID, si existe mostrar valores actuales, leer nuevos valores y persistir, si no mostrar error
        Optional<Categoria> categoria = cr.buscarPorId(id);

        if (categoria.isPresent() && !categoria.get().getEliminado()) {
            Categoria categoria1 = categoria.get();
            System.out.println("Categoría encontrada: " + categoria1);

            String nuevoNombre = Input.scanString("Nuevo nombre (Enter para mantener el actual): ");
            String nuevaDescripcion = Input.scanString("Nueva descripción (Enter para mantener la actual): ");

            if (!nuevoNombre.trim().isEmpty()) categoria1.setNombre(nuevoNombre);
            if (!nuevaDescripcion.trim().isEmpty()) categoria1.setDescripcion(nuevaDescripcion);

            cr.guardar(categoria1);
            System.out.println("La categoría '" + categoria1.getNombre() + "' Fue correctamente actualizada.");
        } else {
            System.out.println("ERROR. No se encontró categoría con esa ID");
        }

    }

    private static void bajaCategoria(CategoriaRepository cr) {
        System.out.println("\n--- BAJA DE CATEGORÍA ---");
        Long id = Input.scanLong("Ingrese el ID de la categoría a eliminar: ");

        // Buscar por ID, si existe marcar eliminado = true y persistir, si no mostrar error
        Optional<Categoria> catAEliminar = cr.buscarPorId(id);
        if (catAEliminar.isPresent() && !catAEliminar.get().getEliminado() && cr.eliminarLogico(id)) {
            System.out.println("La categoría con nombre '" + catAEliminar.get().getNombre() + "' fue correctamente eliminada.");
        } else {
            System.out.println("ERROR. No se encontró categoría con esa ID");
        }
    }

    private static void listadoCategorias(CategoriaRepository cr) {
        System.out.println("\n--- LISTADO DE CATEGORÍAS ACTIVAS ---");
        List<Categoria> activos = cr.listarActivos();
        if (!activos.isEmpty()) {
            activos.forEach(c -> System.out.println(
                    "ID: " + c.getId() +
                            " | Nombre: " + c.getNombre() +
                            " | Descripción: " + c.getDescripcion()
            ));
        } else {
            System.out.println("ERROR. No se encontraron categorías");
        }
    }


    // ========================================== MÉTODOS PRODUCTOS ==========================================

    private static void altaProducto(CategoriaRepository cr, ProductoRepository pr) {
        System.out.println("\n--- ALTA DE PRODUCTO ---");
        System.out.println("Categorías disponibles:");
        // Listar categorías activas e imprimirlas para que seleccione cuál quiere
        List<Categoria> activos = cr.listarActivos();
        if (!activos.isEmpty()) {
            activos.forEach(System.out::println);
        } else {
            System.out.println("ERROR. No se encontraron categorías");
            return;
        }

        Long idCategoria = Input.scanLong("Seleccione el ID de la categoría: ");
        Optional<Categoria> categoria = cr.buscarPorId(idCategoria);
        if (categoria.isPresent() && !categoria.get().getEliminado()) {
            // Pedimos los datos del producto

            String nombre = Input.scanString("Ingrese el nombre del producto: ");
            // Validamos que no estén vacíos o sean <= 0.
            while (nombre.trim().isEmpty()) {
                System.out.println();
                System.out.println("ERROR. Debe ingresar un nombre.");
                nombre = Input.scanString("Ingrese el nombre del producto: ");
            }

            double precio = Input.scanDouble("Ingrese el precio: ");
            while (precio <= 0) {
                System.out.println();
                System.out.println("ERROR. Debe ingresar un precio > 0.");
                precio = Input.scanDouble("Ingrese el precio: ");
            }


            String descripcion = Input.scanString("Ingrese la descripción: ");
            while (descripcion.trim().isEmpty()) {
                System.out.println();
                System.out.println("ERROR. Debe ingresar una descripción.");
                descripcion = Input.scanString("Ingrese la descripción: ");
            }


            int stock = Input.scanInt("Ingrese el stock: ");
            while (stock < 0) {
                System.out.println();
                System.out.println("ERROR. Debe ingresar un stock >= 0.");
                stock = Input.scanInt("Ingrese el stock: ");
            }

            // Creamos la instancia de producto y persistimos en la base de datos
            Producto producto = Producto.builder().nombre(nombre).precio(precio).descripcion(descripcion).stock(stock).disponible(stock > 0).build();
            Categoria categoria1 = categoria.get();

            // Traemos los productos existentes
            List<Producto> productosExistentes = pr.buscarPorCategoria(idCategoria);
            // Reemplazamos la colección lazy por un HashSet común de java lleno con los datos reales
            categoria1.setProductos(new HashSet<>(productosExistentes));
            // Agregamos el producto con los datos cargados
            categoria1.addProducto(producto);

            pr.guardar(producto);
            cr.guardar(categoria1);
            System.out.println("Producto añadido correctamente con el ID: " + producto.getId() + " en la categoría: " + categoria1.getNombre());
        } else {
            System.out.println("No se pudo añadir el producto.");
        }
    }

    private static void modificacionProducto(ProductoRepository pr) {
        System.out.println("\n--- MODIFICACIÓN DE PRODUCTO ---");

        // Listamos los productos
        pr.listarActivos().forEach(System.out::println);

        // Pedimos el ID
        Long id = Input.scanLong("Ingrese el ID del producto a modificar: ");

        // Buscar por ID, si existe mostrar valores actuales, si no mostrar error
        Optional<Producto> producto = pr.buscarPorId(id);
        if (producto.isPresent() && !producto.get().getEliminado()) {
            Producto producto1 = producto.get();
            System.out.println("Producto encontrada: " + producto1);

            // Validamos y asignamos los datos
            String nuevoNombre = Input.scanString("Nuevo nombre (Enter para mantener el actual): ");
            if (nuevoNombre != null && !nuevoNombre.trim().isEmpty()) {
                producto1.setNombre(nuevoNombre);
            }

            String nuevoPrecioStr = Input.scanString("Nuevo precio (Enter para mantener el actual): ");
            if (nuevoPrecioStr != null && !nuevoPrecioStr.trim().isEmpty()) {
                try {
                    double nuevoPrecio = Double.parseDouble(nuevoPrecioStr);
                    if (nuevoPrecio <= 0) {
                        System.out.println("Debe ingresar un precio > 0.");
                    } else {
                        producto1.setPrecio(nuevoPrecio);
                    }
                } catch (Exception e) {
                    System.out.println("Error en el nuevo precio: " + e.getMessage() + ". No se modificará el precio.");
                }
            }

            String nuevoStockStr = Input.scanString("Nuevo stock (Enter para mantener el actual): ");
            if (nuevoStockStr != null && !nuevoStockStr.trim().isEmpty()) {
                try {
                    int nuevoStock = Integer.parseInt(nuevoStockStr);
                    if (nuevoStock < 0) {
                        System.out.println("Debe ingresar un stock >= 0.");
                    } else {
                        producto1.setStock(nuevoStock);
                        producto1.setDisponible(nuevoStock > 0);
                    }
                } catch (Exception e) {
                    System.out.println("Error en el nuevo stock: " + e.getMessage() + ". No se modificará el stock.");
                }
            }

            pr.guardar(producto1);
            System.out.println("El producto '" + producto1.getNombre() + "' Fue correctamente actualizado.");
        } else {
            System.out.println("ERROR. No se encontró producto con esa ID");
        }
    }

    private static void bajaProducto(ProductoRepository pr) {
        System.out.println("\n--- BAJA DE PRODUCTO ---");
        Long id = Input.scanLong("Ingrese el ID del producto a eliminar: ");

        // Buscar por ID, si no existe o ya está dado de baja mostrar error, sino marcar eliminado = true y persistir
        Optional<Producto> prodAEliminar = pr.buscarPorId(id);
        if (prodAEliminar.isPresent() && !prodAEliminar.get().getEliminado() && pr.eliminarLogico(id)) {
            System.out.println("El producto con nombre '" + prodAEliminar.get().getNombre() + "' fue correctamente eliminado.");
        } else {
            System.out.println("ERROR. No se encontró producto con esa ID");
        }
    }

    private static void listadoProductos(CategoriaRepository cr, ProductoRepository pr) {
        System.out.println("\n--- LISTADO DE PRODUCTOS ACTIVOS ---");
        List<Producto> activos = pr.listarActivos();
        List<Categoria> categoriasActivas = cr.listarActivos();

        if (!activos.isEmpty()) {

            // Declaramos un Map para asociar el ID del producto con el nombre de la categoría
            Map<Long, String> mapaCategorias = new HashMap<>();

            // Llenamos el map iterando las categorías y buscando sus productos en la BD
            for (Categoria cate : categoriasActivas) {
                List<Producto> prodsDeCategoria = pr.buscarPorCategoria(cate.getId());
                for (Producto prod : prodsDeCategoria) {
                    mapaCategorias.put(prod.getId(), cate.getNombre());
                }
            }

            // Imprimimos la lista
            activos.forEach(p -> {
                // Buscamos el ID en nuestro map, y si no está devuelve "Sin categoría" con getOrDefault.
                String nombreCategoria = mapaCategorias.getOrDefault(p.getId(), "Sin categoría");
                System.out.println(
                        "ID: " + p.getId() +
                                " | Nombre: " + p.getNombre() +
                                " | Precio: $" + p.getPrecio() +
                                " | Stock: " + p.getStock() +
                                " | Categoría: " + (nombreCategoria)
                );
            });

        } else {
            System.out.println("ERROR. No se encontraron productos");
        }
    }


    // ========================================== MÉTODOS USUARIOS ==========================================

    private static void altaUsuario(UsuarioRepository ur) {

        System.out.println("\n--- ALTA DE USUARIO ---");
        // Pedimos los datos del usuario

        String nombre = Input.scanString("Ingrese el nombre del usuario: ");
        // Validamos que no esté vacío
        while (nombre.trim().isEmpty()) {
            System.out.println();
            System.out.println("ERROR. Debe ingresar un nombre.");
            nombre = Input.scanString("Ingrese el nombre del usuario: ");
        }

        String apellido = Input.scanString("Ingrese el apellido del usuario: ");
        while (apellido.trim().isEmpty()) {
            System.out.println();
            System.out.println("ERROR. Debe ingresar un apellido.");
            apellido = Input.scanString("Ingrese el apellido: ");
        }


        String mail = Input.scanString("Ingrese el mail del usuario: ");
        while (true) {
            if (mail.trim().isEmpty()) {
                System.out.println("ERROR. Debe ingresar un mail.");
            } else if (!mail.matches("^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$")) { // Regex para que sea un email valido
                System.out.println("ERROR. El mail ingresado no es válido.");
            } else if (ur.buscarPorMail(mail).isPresent()) {
                System.out.println("ERROR. El mail ya está en uso.");
            } else {
                break;
            }
            mail = Input.scanString("Ingrese el mail: ");
        }

        // Opcional, si no ingresa nada se deja una string vacía, si ingresa algo debe tener mínimo 10 dígitos
        String celular = Input.scanString("Ingrese el número de celular del usuario (Enter para omitir): ");
        while (!celular.trim().isEmpty() && !celular.matches("\\d{10,}")) {
            System.out.println("ERROR. El celular debe tener al menos 10 dígitos.");
            celular = Input.scanString("Ingrese el número de celular del usuario (Enter para omitir): ");
        }
        if (celular.trim().isEmpty()) celular = "";

        String contrasenia = Input.scanString("Ingrese el contraseña del usuario: ");
        while (contrasenia.trim().isEmpty()) {
            System.out.println();
            System.out.println("ERROR. Debe ingresar una contraseña.");
            contrasenia = Input.scanString("Ingrese la contraseña: ");
        }

        // El scanRol() ya hace la validación y el while
        Rol rol  = Input.scanRol("Ingrese el rol del usuario (ADMIN / USUARIO): ");
        
        Usuario usuario = Usuario.builder().nombre(nombre).apellido(apellido).mail(mail).celular(celular).contraseña(contrasenia).rol(rol).build();

        ur.guardar(usuario);
        System.out.println("'" + usuario.getRol() + "' añadido correctamente con el ID: " + usuario.getId());

    }

    private static void modificacionUsuario(UsuarioRepository ur) {

        System.out.println("\n--- MODIFICACIÓN DE USUARIO ---");

        // Listamos los usuarios
        ur.listarActivos().forEach(System.out::println);

        // Pedimos el ID
        Long id = Input.scanLong("Ingrese el ID del usuario a modificar: ");

        // Buscar por ID, si existe mostrar valores actuales, si no mostrar error
        Optional<Usuario> usuario = ur.buscarPorId(id);
        if (usuario.isPresent() && !usuario.get().getEliminado()) {
            Usuario usuario1 = usuario.get();
            System.out.println("Usuario encontrado: " + usuario1);

            String nombre = Input.scanString("Ingrese el nombre del usuario (Enter para mantener el actual): ");
            if (!nombre.trim().isEmpty()) usuario1.setNombre(nombre);

            String apellido = Input.scanString("Ingrese el apellido del usuario (Enter para mantener el actual): ");
            if (!apellido.trim().isEmpty()) usuario1.setApellido(apellido);

            String mail = Input.scanString("Ingrese el mail del usuario (Enter para mantener el actual): ");
            while (true) {
                if (mail.trim().isEmpty()) {
                    break;
                } else if (!mail.matches("^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$")) { // Regex para que sea un email valido
                    System.out.println("ERROR. El mail ingresado no es válido. (Enter para mantener el actual)");
                } else if (ur.buscarPorMail(mail).isPresent()) {
                    if (!Objects.equals(usuario1.getId(), ur.buscarPorMail(mail).get().getId())) {
                        System.out.println("ERROR. El mail ya está en uso.");
                    }
                } else {
                    break;
                }
                mail = Input.scanString("Ingrese el mail del usuario (Enter para mantener el actual): ");
            }
            if (!mail.trim().isEmpty()) usuario1.setMail(mail);

            String celular = Input.scanString("Ingrese el número de celular del usuario (Enter para omitir): ");
            while (!celular.trim().isEmpty() && !celular.matches("\\d{10,}")) {
                System.out.println("ERROR. El celular debe tener al menos 10 dígitos.");
                celular = Input.scanString("Ingrese el número de celular del usuario (Enter para omitir): ");
            }
            if (!celular.trim().isEmpty()) usuario1.setCelular(celular);

            String contrasenia = Input.scanString("Ingrese el contraseña del usuario (Enter para omitir): ");
            if (!contrasenia.trim().isEmpty()) usuario1.setContraseña(contrasenia);

            ur.guardar(usuario1);
            System.out.println("'" + usuario1.getRol() + "' modificado correctamente con el ID: " + usuario1.getId());
        } else {
            System.out.println("ERROR. No se encontró el usuario con esa ID.");
        }
    }

    private static void bajaUsuario(UsuarioRepository ur) {

        System.out.println("\n--- BAJA DE USUARIO ---");


        Long id = Input.scanLong("Ingrese el ID del usuario a eliminar: ");

        // Buscar por ID, si no existe o ya está dado de baja mostrar error, sino marcar eliminado = true y persistir
        Optional<Usuario> usuarioAEliminar = ur.buscarPorId(id);
        if (usuarioAEliminar.isPresent() && !usuarioAEliminar.get().getEliminado() && ur.eliminarLogico(id)) {
            System.out.println("El usuario de nombre y apellido: '" + usuarioAEliminar.get().getNombre() + " " + usuarioAEliminar.get().getApellido() + "' fue correctamente eliminado.");
        } else {
            System.out.println("ERROR. No se encontró usuario con esa ID.");
        }

    }

    private static void listadoUsuarios(UsuarioRepository ur) {

        System.out.println("\n--- LISTAR ACTIVOS ---");

        ur.listarActivos().forEach(u -> System.out.println(
                "ID: " + u.getId() +
                " | Nombre: " + u.getNombre() + " " + u.getApellido() +
                " | Mail: " + u.getMail() +
                " | Rol: " + u.getRol()
        ));

    }

    private static void buscarUsuarioPorMail(UsuarioRepository ur, PedidoRepository pedr) {

        System.out.println("\n--- BUSCAR USUARIO POR MAIL ---");

        String mail = Input.scanString("Ingrese el mail del usuario a buscar: ");

        Optional<Usuario> usuarioABuscar = ur.buscarPorMail(mail);
        if (usuarioABuscar.isPresent()) {
            Usuario u = usuarioABuscar.get();

            List<Pedido> pedidos = ur.buscarPedidosPorUsuario(u.getId());

            System.out.println(
                "ID: " + u.getId() +
                    " | Nombre: " + u.getNombre() + " " + u.getApellido() +
                    " | Mail: " + u.getMail() +
                    " | Celular: " + u.getCelular() +
                    " | Rol: " + u.getRol()
            );
            pedidos.forEach(p -> {

                // Acá solamente traemos los datos lazy de DetallePedido
                Pedido pedidoCompleto = pedr.buscarDetallesPedidoPorPedido(p);

                System.out.println(
                "    -> Pedido #" + p.getId() +
                        " | Estado: " + p.getEstado() +
                        " | Forma de Pago: " + p.getFormaPago() +
                        " | Total: $" + p.getTotal()
                );

                pedidoCompleto.getDetallesPedidos().forEach(d -> System.out.println(
                    "        -> Detalle Pedido: " +
                            " | Producto: " + d.getProducto().getNombre() +
                            " | Cantidad: " + d.getCantidad() +
                            " | Subtotal: $" + d.getSubtotal()
                        )
                );
            });

        } else {
            System.out.println("ERROR. No se encontró usuario con ese mail.");
        }

    }


    // ========================================== MÉTODOS PEDIDOS ==========================================

    private static void altaPedido(UsuarioRepository ur, ProductoRepository pr) {

        System.out.println("\n--- ALTA DE PEDIDO ---");

        // Listamos los usuarios
        ur.listarActivos().forEach(System.out::println);

        // Buscar por ID, si existe mostrar valores actuales, si no mostrar error
        Optional<Usuario> user = ur.buscarPorId(Input.scanLong("Ingrese el ID del usuario a vincular con el pedido: "));
        if (user.isPresent() && !user.get().getEliminado()) {
            Usuario usuario = user.get();
            System.out.println("Usuario encontrado: " + usuario);


            // Validaciones en su util de Input
            FormaPago formaPago = Input.scanFormaPago("Ingrese una forma de pago (TARJETA / TRANSFERENCIA / EFECTIVO): ");

            // HashMap de productos y cantidades
            Map<Producto, Integer> productosCarrito = new HashMap<>();

            // Traemos los productos activos UNA SOLA VEZ fuera del bucle, esto es para tenerlos localmente
            List<Producto> listaProductosActivos = pr.listarActivos();

            // Usamos un do-while para que minimo se agregue un producto
            do {



                listaProductosActivos.forEach(p -> System.out.println(
                        "ID: " + p.getId() +
                                " | Nombre: " + p.getNombre() +
                                " | Precio: $" + p.getPrecio() +
                                " | Stock disponible: " + p.getStock()
                ));


                Long productoId = Input.scanLong("Ingrese el ID del producto: ");

                // Ahora lo buscamos en la lista que tenemos en LOCAL, de lo contrario no podríamos manejar el control de stock correctamente
                Optional<Producto> productoOpt = listaProductosActivos.stream()
                        .filter(p -> p.getId().equals(productoId))
                        .findFirst();

                while (productoOpt.isEmpty() || productoOpt.get().getEliminado()) {
                    System.out.println("No se encontró el producto, inténtelo nuevamente.");
                    productoOpt = pr.buscarPorId(Input.scanLong("Ingrese el ID del producto: "));
                }

                // Usamos .get() en el optional
                Producto producto = productoOpt.get();

                // Revisamos su disponibilidad y stock
                if (!producto.getDisponible()) {
                    System.out.println("No se pudo añadir, el producto no está disponible.");
                    return;
                }
                if (producto.getStock() <= 0) {
                    System.out.println("No se pudo añadir, no hay más stock del producto.");
                    return;
                }

                // Le pedimos la cantidad
                int cantidad = Input.scanInt("Ingrese la cantidad de '" + producto.getNombre() + "' que quiere agregar (Stock disponible: " + producto.getStock() + "): ");

                while (cantidad <= 0 || cantidad > producto.getStock()) {
                    if (cantidad <= 0) {
                        System.out.println("ERROR. La cantidad debe ser mayor a 0.");
                    } else {
                        System.out.println("ERROR. No hay stock suficiente. Stock disponible: " + producto.getStock());
                    }
                    cantidad = Input.scanInt("Ingrese la cantidad de '" + producto.getNombre() + "' que quiere agregar (Stock disponible: " + producto.getStock() + "): ");
                }

                final int cantidadFinal = cantidad;

                // Manejamos el hecho de si el producto ya estaba en el carrito y sumamos la nueva adición, sino lo metemos en el carrito
                productosCarrito.merge(producto, cantidadFinal, Integer::sum);
                // Bajamos el stock localmente
                producto.setStock(producto.getStock() - cantidadFinal);




            } while (Input.scanBoolean("¿Quieres agregar otro producto (si/no)? "));

            // Validación redundante, pero que la consigna pide
            if (productosCarrito.isEmpty()) {
                System.out.println("ERROR. El pedido debe tener por lo menos un detalle.");
                return;
            }

            // Acá vamos a crear un entity manager para manejar toda la transacción
            EntityManager em = emf.createEntityManager();
            try {
                em.getTransaction().begin();

                // Armamos el pedido
                Pedido pedido = Pedido.builder().fecha(LocalDateTime.now()).estado(Estado.PENDIENTE).formaPago(formaPago).build();

                // Añadimos los detalles
                productosCarrito.forEach((producto, cantidad) -> {
                    em.find(Producto.class, producto.getId());
                    pedido.addDetallePedido(cantidad, producto);
                });

                pedido.calcularTotal();

                // Acá hacemos que los pedidos del usuario dejen de ser lazy, así los podemos asociar
                List<Pedido> pedidosDelUsuario = ur.buscarPedidosPorUsuario(usuario.getId());
                // Reemplazamos la colección lazy por un HashSet lleno con los datos reales
                usuario.setPedidos(new HashSet<>(pedidosDelUsuario));
                // Agregamos el pedido con los datos cargados
                usuario.addPedido(pedido);
                // Mergeamos al usuario, que mergea y persiste a todos los demás objetos por el cascade, y commiteamos
                em.merge(usuario);
                em.getTransaction().commit();



                // Para traer su ID asignada automaticamente
                Pedido pedidoCompleto = ur.buscarPedidosPorUsuario(usuario.getId()).getLast();
                // Imprimimos los campos
                System.out.println("\nPedido creado correctamente:" +
                        "\nID: " + pedidoCompleto.getId() +
                        "\nFecha: " + pedido.getFecha() +
                        "\nUsuario: " + usuario.getNombre() + " " + usuario.getApellido() +
                        "\nForma de pago: " + pedido.getFormaPago());
                pedido.getDetallesPedidos().forEach(d -> System.out.println(
                        "    -> Producto: " + d.getProducto().getNombre() +
                                " | Cantidad: " + d.getCantidad() +
                                " | Subtotal: $" + d.getSubtotal()
                ));
                System.out.println("Total: $" + pedido.getTotal());

            } catch (Exception e) {
                if (em.getTransaction().isActive()) em.getTransaction().rollback();
                System.out.println("ERROR: " + e.getClass().getSimpleName() + " - " + e.getMessage());
            } finally {
                em.close();
            }

        } else {
            System.out.println("ERROR. No se encontró el usuario con esa ID.");
        }
    }

    private static void cambiarEstadoPedido(PedidoRepository pedr) {
        System.out.println("\n--- CAMBIAR ESTADO DE PEDIDO ---");

        Long pedidoId =  Input.scanLong("Ingrese el ID del pedido: ");
        Optional<Pedido> pedidoOpt = pedr.buscarPorId(pedidoId);

        if  (pedidoOpt.isEmpty() || pedidoOpt.get().getEliminado()) {
            System.out.println("No se encontró el pedido con el id: " + pedidoId);
            return;
        }

        Pedido pedido  = pedidoOpt.get();

        System.out.println("Estados válidos:");
        Arrays.stream(Estado.values()).forEach(System.out::println);
        System.out.println("Pedido: #" + pedido.getId() + " | Estado actual: " + pedido.getEstado());

        Estado nuevoEstado = Input.scanEstado("Ingrese el nuevo estado del pedido: ");

        pedido.setEstado(nuevoEstado);

        System.out.println("Pedido: #" + pedido.getId() + " | Nuevo estado: " + pedido.getEstado());

        pedr.guardar(pedido);
    }

    private static void bajaPedido(PedidoRepository pedr) {

        System.out.println("\n--- BAJA DE PEDIDO ---");
        Long id = Input.scanLong("Ingrese el ID del pedido a eliminar: ");

        // Buscar por ID, si no existe o ya está dado de baja mostrar error, sino marcar eliminado = true y persistir
        Optional<Pedido> pedAEliminar = pedr.buscarPorId(id);
        if (pedAEliminar.isPresent() && !pedAEliminar.get().getEliminado() && pedr.eliminarLogico(id)) {
            System.out.println("El pedido con ID: '#" + id + "' y el total '"+ pedAEliminar.get().getTotal() +"' fue correctamente eliminado.");
        } else {
            System.out.println("ERROR. No se encontró el pedido con esa ID");
        }
    }

    private static void listadoPedidos(PedidoRepository pedr) {

        System.out.println("\n--- LISTADO DE PEDIDOS ACTIVOS ---");

        List<Pedido> activos = pedr.listarActivos();
        if (!activos.isEmpty()) {
            activos.forEach(p -> System.out.println(
                    "ID: " + p.getId() +
                            " | Fecha: " + p.getFecha() +
                            " | Estado: " + p.getEstado() +
                            " | Forma de pago: " + p.getFormaPago() +
                            " | Total: $" + p.getTotal()
            ));
        } else {
            System.out.println("ERROR. No se encontraron pedidos.");
        }
    }

    private static void pedidosPorUsuario(UsuarioRepository ur) {

        System.out.println("\n--- LISTAR PEDIDOS POR USUARIO ---");

        // Listamos los usuarios
        ur.listarActivos().forEach(System.out::println);

        // Buscar por ID, si existe mostrar valores actuales, si no mostrar error
        Optional<Usuario> user = ur.buscarPorId(Input.scanLong("Ingrese el ID del usuario a vincular con el pedido: "));
        if (user.isPresent() && !user.get().getEliminado()) {
            Usuario usuario = user.get();
            System.out.println("Usuario encontrado: " + usuario);

            List<Pedido> pedidosUsuario = ur.buscarPedidosPorUsuario(usuario.getId());

            if (!pedidosUsuario.isEmpty()) {
                pedidosUsuario.forEach(p -> System.out.println(
                        "ID: " + p.getId() +
                                " | Fecha: " + p.getFecha() +
                                " | Estado: " + p.getEstado() +
                                " | Forma de pago: " + p.getFormaPago() +
                                " | Total: $" + p.getTotal()
                ));
            } else {
                System.out.println("El usuario no tiene pedidos registrados.");
            }
        } else {
            System.out.println("ERROR. No se encontró el usuario con esa ID.");
        }

    }

    private static void pedidosPorEstado(PedidoRepository pedr, UsuarioRepository ur) {

        System.out.println("\n--- PEDIDOS POR ESTADO ---");

        // Listamos los estados
        System.out.println("Estados válidos:");
        Arrays.stream(Estado.values()).forEach(System.out::println);
        Estado estado =  Input.scanEstado("Ingrese un estado válido: ");

        // Buscar por estado
        List<Pedido> pedidos = pedr.buscarPorEstado(estado);
        if (!pedidos.isEmpty()) {
            pedidos.forEach(p ->{

                Optional<Usuario> usuarioOpt = ur.listarActivos().stream().filter(u -> ur.buscarPedidosPorUsuario(u.getId()).contains(p)).findFirst();

                // Usa map para devolver el nombre y apellido si es que el optional existe
                String usuario = usuarioOpt.map(u -> u.getNombre() + " " + u.getApellido()).orElse("Sin usuario");

                System.out.println(
                        "ID: " + p.getId() +
                                " | Fecha: " + p.getFecha() +
                                " | Usuario: " + usuario +
                                " | Estado: " + p.getEstado() +
                                " | Total: $" + p.getTotal()
                );
            });
        } else {
            System.out.println("ERROR. No se encontraron pedidos con el estado de '" + estado + "'");
        }
    }


    // ========================================== MÉTODOS REPORTES ==========================================

    private static void reporteProductosPorCategoria(CategoriaRepository cr, ProductoRepository pr) {

        System.out.println("\n--- PRODUCTOS POR CATEGORÍA ---");

        System.out.println("Categorías disponibles:");

        // Listar categorías activas e imprimir filas

        List<Categoria> activos = cr.listarActivos();
        if (!activos.isEmpty()) {
            activos.forEach(System.out::println);
        } else {
            System.out.println("ERROR. No se encontraron categorías");
        }
        Long idCategoria = Input.scanLong("Seleccione el ID de la categoría: ");

        Optional<Categoria> categoria = cr.buscarPorId(idCategoria);
        List<Producto> listaProductos = new ArrayList<>();

        // Verificamos que la categoría exista y no esté eliminada
        if (categoria.isPresent() && !categoria.get().getEliminado()) {
            listaProductos = pr.buscarPorCategoria(idCategoria);
        }

        // Si listaProductos está vacío informarlo, sino imprimir filas
        if (!listaProductos.isEmpty()) {
            listaProductos.forEach(p -> System.out.println(
                    "ID: " + p.getId() +
                            " | Nombre: " + p.getNombre() +
                            " | Precio: $" + p.getPrecio() +
                            " | Stock: " + p.getStock()
            ));
        } else {
            System.out.println("ERROR. La categoría ingresada está vacía, no existe o no tiene productos activos.");
        }
    }

    private static void reportePedidosPorUsuario(UsuarioRepository ur) {

        System.out.println("\n--- LISTAR PEDIDOS POR USUARIO ---");

        // Listamos los usuarios
        ur.listarActivos().forEach(System.out::println);

        // Buscar por ID, si existe mostrar valores actuales, si no mostrar error
        Optional<Usuario> user = ur.buscarPorId(Input.scanLong("Ingrese el ID del usuario a vincular con el pedido: "));
        if (user.isPresent() && !user.get().getEliminado()) {
            Usuario usuario = user.get();
            System.out.println("Usuario encontrado: " + usuario);

            List<Pedido> pedidosUsuario = ur.buscarPedidosPorUsuario(usuario.getId());

            if (!pedidosUsuario.isEmpty()) {
                pedidosUsuario.forEach(p -> System.out.println(
                        "ID: " + p.getId() +
                                " | Fecha: " + p.getFecha() +
                                " | Estado: " + p.getEstado() +
                                " | Forma de pago: " + p.getFormaPago() +
                                " | Total: $" + p.getTotal()
                ));
            } else {
                System.out.println("El usuario no tiene pedidos registrados.");
            }
        } else {
            System.out.println("ERROR. No se encontró el usuario con esa ID.");
        }


        }

    private static void reportePedidosPorEstado(PedidoRepository pedr, UsuarioRepository ur) {

        System.out.println("\n--- LISTAR PEDIDOS POR ESTADO ---");

        // Listamos los estados
        System.out.println("Estados válidos:");
        Arrays.stream(Estado.values()).forEach(System.out::println);
        Estado estado =  Input.scanEstado("Ingrese un estado válido: ");



        // Buscar por estado
        List<Pedido> pedidos = pedr.buscarPorEstado(estado);
        if (!pedidos.isEmpty()) {
            pedidos.forEach(p ->{

                Optional<Usuario> usuarioOpt = ur.listarActivos().stream().filter(u -> ur.buscarPedidosPorUsuario(u.getId()).contains(p)).findFirst();

                // Usa map para devolver el nombre y apellido si es que el optional existe
                String usuario = usuarioOpt.map(u -> u.getNombre() + " " + u.getApellido()).orElse("Sin usuario");

                System.out.println(
                        "ID: " + p.getId() +
                                " | Fecha: " + p.getFecha() +
                                " | Usuario: " + usuario +
                                " | Estado: " + p.getEstado() +
                                " | Total: $" + p.getTotal()
                );
            });
        } else {
            System.out.println("ERROR. No se encontraron pedidos con el estado de '" + estado + "'");
        }
    }

    private static void reporteTotalFacturado(PedidoRepository pedr) {

        System.out.println("\n--- TOTAL FACTURADO ---");

        double totalPedidos = pedr.buscarPorEstado(Estado.TERMINADO).stream().mapToDouble(p -> p.getTotal() != null ? p.getTotal() : 0).sum();

        if (totalPedidos <= 0) {
            System.out.println("No hay ninguna facturación.");
        } else {
            System.out.println("TOTAL FACTURADO: " + String.format(Locale.US, "%.2f", totalPedidos));
        }
    }







    // Cargar base de datos con valores por defecto para testeo:

    private static void cargarDatos(EntityManager em) {

        try {
            em.getTransaction().begin();

            System.out.println("==================================================");
            System.out.println("INSTANCIACIÓN DE OBJETOS");
            System.out.println("==================================================");

            // Instanciar 10 productos
            Producto prod1 = Producto.builder()
                    .nombre("Alfajor de Maicena")
                    .precio(800.0)
                    .descripcion("Relleno de dulce de leche")
                    .stock(50)
                    .imagen("maicena.jpg")
                    .disponible(true)
                    .build();

            Producto prod2 = Producto.builder()
                    .nombre("Alfajor de Nuez")
                    .precio(950.0)
                    .descripcion("Con nuez y baño de chocolate")
                    .stock(30)
                    .imagen("nuez.jpg")
                    .disponible(true)
                    .build();

            Producto prod3 = Producto.builder()
                    .nombre("Torta Rogel")
                    .precio(8500.0)
                    .descripcion("Capas crocantes con dulce de leche")
                    .stock(5)
                    .imagen("rogel.jpg")
                    .disponible(true)
                    .build();

            Producto prod4 = Producto.builder()
                    .nombre("Cheesecake de Frutos Rojos")
                    .precio(9000.0)
                    .descripcion("Con mermelada casera")
                    .stock(4)
                    .imagen("cheesecake.jpg")
                    .disponible(true)
                    .build();

            Producto prod5 = Producto.builder()
                    .nombre("Tiramisú")
                    .precio(7500.0)
                    .descripcion("Receta italiana original")
                    .stock(6)
                    .imagen("tiramisu.jpg")
                    .disponible(true)
                    .build();

            Producto prod6 = Producto.builder()
                    .nombre("Chocotorta")
                    .precio(7000.0)
                    .descripcion("Clásica argentina")
                    .stock(10)
                    .imagen("chocotorta.jpg")
                    .disponible(true)
                    .build();

            Producto prod7 = Producto.builder()
                    .nombre("Brownie con Nuez")
                    .precio(1200.0)
                    .descripcion("Húmedo por dentro")
                    .stock(20)
                    .imagen("brownie.jpg")
                    .disponible(true)
                    .build();

            Producto prod8 = Producto.builder()
                    .nombre("Lemon Pie")
                    .precio(6500.0)
                    .descripcion("Con merengue italiano")
                    .stock(5)
                    .imagen("lemon.jpg")
                    .disponible(true)
                    .build();

            Producto prod9 = Producto.builder()
                    .nombre("Cuadrado de Coco")
                    .precio(1100.0)
                    .descripcion("Coco y dulce de leche")
                    .stock(25)
                    .imagen("coco.jpg")
                    .disponible(true)
                    .build();

            Producto prod10 = Producto.builder()
                    .nombre("Postre Oreo en Vaso")
                    .precio(1500.0)
                    .descripcion("Ideal para eventos")
                    .stock(40)
                    .imagen("oreo.jpg")
                    .disponible(true)
                    .build();

            // Colección auxiliar para guardar todos los productos
            Set<Producto> todosLosProductos = new HashSet<>();
            todosLosProductos.add(prod1);
            todosLosProductos.add(prod2);
            todosLosProductos.add(prod3);
            todosLosProductos.add(prod4);
            todosLosProductos.add(prod5);
            todosLosProductos.add(prod6);
            todosLosProductos.add(prod7);
            todosLosProductos.add(prod8);
            todosLosProductos.add(prod9);
            todosLosProductos.add(prod10);

            // Instanciar 3 Categorías y asignarles productos
            Categoria catAlfajores = Categoria.builder().nombre("Alfajores").descripcion("Clásicos y especiales").build();
            catAlfajores.addProducto(prod1);
            catAlfajores.addProducto(prod2);

            Categoria catTortas = Categoria.builder().nombre("Tortas Enteras").descripcion("Para cumpleaños y eventos").build();
            catTortas.addProducto(prod3);
            catTortas.addProducto(prod4);
            catTortas.addProducto(prod5);
            catTortas.addProducto(prod6);
            catTortas.addProducto(prod8);

            Categoria catPorciones = Categoria.builder().nombre("Porciones y Vasos").descripcion("Para el antojo").build();
            catPorciones.addProducto(prod7);
            catPorciones.addProducto(prod9);
            catPorciones.addProducto(prod10);

            // Instanciar 3 Pedidos (al menos 2 detalles por cada uno)
            Pedido pedido1 = Pedido.builder().estado(Estado.PENDIENTE).formaPago(FormaPago.TRANSFERENCIA).build();
            pedido1.addDetallePedido(3, prod1); // 3 Alfajores de maicena
            pedido1.addDetallePedido(1, prod3); // 1 Torta Rogel

            Pedido pedido2 = Pedido.builder().estado(Estado.CONFIRMADO).formaPago(FormaPago.EFECTIVO).build();
            pedido2.addDetallePedido(2, prod4); // 2 Cheesecakes
            pedido2.addDetallePedido(5, prod10); // 5 Vasos Oreo

            Pedido pedido3 = Pedido.builder().estado(Estado.TERMINADO).formaPago(FormaPago.TARJETA).build();
            pedido3.addDetallePedido(1, prod6); // 1 Chocotorta
            pedido3.addDetallePedido(4, prod7); // 4 Brownies

            // Instanciar 2 Usuarios
            // El constructor de Usuario requiere un primer pedido obligatoriamente
            Usuario userLucas = Usuario.builder()
                    .nombre("Lucas")
                    .apellido("Gómez")
                    .mail("lucas@mail.com")
                    .celular("1122334455")
                    .contraseña("pass123")
                    .rol(Rol.ADMIN)
                    .build();
            userLucas.addPedido(pedido1);
            userLucas.addPedido(pedido2);
            // El admin tiene 2 pedidos en total

            Usuario userCliente = Usuario.builder()
                    .nombre("Juan")
                    .apellido("Pérez")
                    .mail("juan@mail.com")
                    .celular("1199887766")
                    .contraseña("pass456")
                    .rol(Rol.USUARIO)
                    .build();
            userCliente.addPedido(pedido3);
            // El usuario solo tiene 1 pedido


            System.out.println("\n==================================================");
            System.out.println("Cargar los productos a la base de datos"); // Vamos a aprovecharnos de los cascades para que sea más eficiente
            System.out.println("==================================================");

                em.persist(catAlfajores);
                em.persist(catPorciones);
                em.persist(catTortas);

                em.persist(userLucas);
                em.persist(userCliente);

                em.getTransaction().commit();
                System.out.println("Todo cargado en la DB!");
            } catch (Exception e) {
                if (em.getTransaction().isActive()) {
                    em.getTransaction().rollback();
                }
                System.out.println("ERROR: " + e.getClass().getSimpleName() + " - " + e.getMessage());
            }

    }
}
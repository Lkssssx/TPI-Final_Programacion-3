import { getCategories, getOrders, getProducts, removeActualUser, saveCategories, saveOrders, saveProducts } from "../../../utils/localStorage";
import { type ICategory } from "../../../types/category";
import { fetchCategorias, fetchPedidos, fetchProductos } from "../../../utils/fetchs";
import { verificarSesion } from "../../../utils/verificarSesion";
import type { Order } from "../../../types/order";
import type { Product } from "../../../types/product";

// Verificamos la sesión
verificarSesion();

const cerrarSesion = document.querySelector(".cerrar-sesion") as HTMLButtonElement

const statCategorias = document.querySelector("#stat-total-categorias") as HTMLParagraphElement;
const statProductos = document.querySelector("#stat-total-productos") as HTMLParagraphElement;
const statDisponibles = document.querySelector("#stat-productos-disponibles") as HTMLParagraphElement;
const statPedidos = document.querySelector("#stat-total-pedidos") as HTMLParagraphElement;

const resProductosActivos = document.querySelector("#resumen-productos-activos") as HTMLElement;
const resProductosInactivos = document.querySelector("#resumen-productos-inactivos") as HTMLElement;
const resProductosSinStock = document.querySelector("#resumen-productos-sin-stock") as HTMLElement;
const resCategoriasActivas = document.querySelector("#resumen-categorias-activas") as HTMLElement;

const resPedidosPendiente = document.querySelector("#resumen-pedidos-pendiente") as HTMLElement;
const resPedidosPreparacion = document.querySelector("#resumen-pedidos-preparacion") as HTMLElement;
const resPedidosEntregado = document.querySelector("#resumen-pedidos-entregado") as HTMLElement;
const resPedidosCancelado = document.querySelector("#resumen-pedidos-cancelado") as HTMLElement;


let categorias: ICategory[] = [];
let todosLosProductos: Product[] = [];
let pedidos: Order[] = [];

if (cerrarSesion) {
    cerrarSesion.addEventListener("click", () => {
        removeActualUser();
        verificarSesion(); // Forzará la redirección si el usuario fue removido
    });
}




async function cargarDatos() {
    try {

        if (!getCategories()) {   // Nos aseguramos de que hayan categorias guardadas, y si no hay hacemos una primera inicializacion con los datos
            categorias = await fetchCategorias();
            saveCategories(categorias);
        } else {
            categorias = JSON.parse(getCategories()!) // El "!" al final le asegura a TS que es un valor no nulo
        }
        

        if (!getProducts()) {  
            todosLosProductos = await fetchProductos();
            saveProducts(todosLosProductos);
        } else {
            todosLosProductos = JSON.parse(getProducts()!)
        }
        
        if (!getOrders()) {
            pedidos = await fetchPedidos();
            saveOrders(pedidos);
        } else {
            pedidos = JSON.parse(getOrders()!) 
        }
        
        cargarEstadisticas();

    } catch (e) {
        console.log("Error al cargar los datos: " + e)
    }
}



// ===== CÁLCULO Y RENDERIZADO =====
const cargarEstadisticas = (): void => {

    // 2. Procesamiento de Productos
    const totalProductos = todosLosProductos.length;

    // Se calcula la disponibilidad evaluando el nivel de stock y disponibilidad
    const productosConStock = todosLosProductos.filter(p => p.stock > 0).length;
    const productosDisponibles = todosLosProductos.filter(p => p.disponible !== false).length; 
    const productosSinStock = todosLosProductos.filter(p => p.disponible !== false && p.stock <= 0).length;
    const productosInactivos = totalProductos - productosDisponibles;

    // Procesamiento de Categorías
    const totalCategorias = categorias.length;
    const categoriasActivas = categorias.length; // Es lo mismo, porque no tiene un campo de eliminado lógico aún

    // Procesamiento de Pedidos
    const totalPedidos = pedidos.length;

    // Contar los pedidos por estado
    const pedidosPendientes = pedidos.filter(p => p.estado === "PENDIENTE").length;
    const pedidosPreparacion = pedidos.filter(p => p.estado === "EN_PREPARACION").length;
    const pedidosEntregados = pedidos.filter(p => p.estado === "ENTREGADO").length;
    const pedidosCancelados = pedidos.filter(p => p.estado === "CANCELADO").length;

    
    // Tarjetas principales
    if (statCategorias) statCategorias.innerText = String(totalCategorias);
    if (statProductos) statProductos.innerText = String(totalProductos);
    if (statDisponibles) statDisponibles.innerText = String(productosDisponibles);
    if (statPedidos) statPedidos.innerText = String(totalPedidos);

    // Panel de Entidades
    if (resProductosActivos) resProductosActivos.innerText = String(productosDisponibles);
    if (resProductosInactivos) resProductosInactivos.innerText = String(productosInactivos);
    if (resProductosSinStock) resProductosSinStock.innerHTML = String(productosSinStock)
    if (resCategoriasActivas) resCategoriasActivas.innerText = String(categoriasActivas);

    // Panel de Pedidos
    if (resPedidosPendiente) resPedidosPendiente.innerText = String(pedidosPendientes);
    if (resPedidosPreparacion) resPedidosPreparacion.innerText = String(pedidosPreparacion);
    if (resPedidosEntregado) resPedidosEntregado.innerText = String(pedidosEntregados);
    if (resPedidosCancelado) resPedidosCancelado.innerText = String(pedidosCancelados);
};


// Cargamos los datos
await cargarDatos();
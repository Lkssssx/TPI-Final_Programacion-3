import { verificarSesion } from "../../../utils/verificarSesion";
import { getActualUser, getOrders, getProducts, removeActualUser, saveOrders, saveProducts } from "../../../utils/localStorage";
import type { Order, OrderState } from "../../../types/order";
import type { User } from "../../../types/user";
import { fetchPedidos, fetchProductos } from "../../../utils/fetchs";
import type { Product } from "../../../types/product";

verificarSesion();


const contenedorOrders = document.getElementById("contenedor-orders") as HTMLElement; 
const cerrarSesion = document.querySelector(".cerrar-sesion") as HTMLButtonElement;
const filtros = document.querySelectorAll(".btn-filtro") as NodeListOf<HTMLButtonElement>;

const usuarioData = getActualUser();
const usuario: User | null = usuarioData ? JSON.parse(usuarioData) : null;

let todosLosProductos: Product[] = [];
let todosLosPedidos: Order[] = [];
let pedidosUsuario: Order[] = [];
let filtroActivo: OrderState | "" = "";

if (cerrarSesion) {
    cerrarSesion.addEventListener("click", () => {
        removeActualUser();
        verificarSesion();
    });
}


// Función para cargar los datos, en caso de que no estén aún en el localStorage
async function cargarDatos() {
    try {

        if (!getProducts()) {  // Nos aseguramos de que hayan productos guardados, y si no hay hacemos una primera inicializacion con los datos en data.ts
            todosLosProductos = await fetchProductos();
            saveProducts(todosLosProductos);
        } else {
            todosLosProductos = JSON.parse(getProducts()!);
        }
        
        if (!getOrders()) {  // Nos aseguramos de que hayan productos guardados, y si no hay hacemos una primera inicializacion con los datos en data.ts
            todosLosPedidos = await fetchPedidos();
            saveOrders(todosLosPedidos);
        } else {
            todosLosPedidos = JSON.parse(getOrders()!);
        }

        renderizarTodo();

    } catch (e) {
        console.log("Error: " + e)
    }
}



export const crearModal = (): void => {
    // Si ya existe el modal, no lo volvemos a crear
    if (document.getElementById("modal-overlay")) return;

    const overlay = document.createElement("div") as HTMLDivElement;
    overlay.id = "modal-overlay";
    overlay.innerHTML = `
        <div id="modal-content">
            <button id="modal-cerrar">✕</button>
            <div id="modal-body"></div>
        </div>
    `;
    document.body.appendChild(overlay);

    const btnCerrar = overlay.querySelector("#modal-cerrar");
    if (btnCerrar) {
        btnCerrar.addEventListener("click", cerrarModal);
    }
    
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) cerrarModal();
    });
};

export const abrirModal = (order: Order): void => {
    const overlay = document.getElementById("modal-overlay") as HTMLDivElement;
    const modalBody = document.getElementById("modal-body") as HTMLDivElement;

    // Nos resguardamos por si no existen
    if (!overlay || !modalBody) return;

    // Creamos el modal
    modalBody.innerHTML = `
        <div class="modal-header">
            <h2>Pedido</h2>
            <span class="estado-badge ${getEstadoClass(order.estado)}">${order.estado.replace("_", " ")}</span>
        </div>
        <div class="modal-meta">
            <p><strong>Fecha:</strong> ${order.fecha}</p>
            <p><strong>Forma de pago:</strong> ${order.formaPago}</p>
            <p><strong>Total:</strong> <span class="modal-total">$${order.total}</span></p>
        </div>
        <h3>Productos</h3>
        <div class="modal-productos">
            ${order.detalles.map(detalle => `
                <div class="modal-producto">
                    <img src="${detalle.producto.imagen}" alt="${detalle.producto.nombre}">
                    <div class="modal-producto-info">
                        <p class="modal-producto-nombre"><strong>${detalle.producto.nombre}</strong></p>
                        <p><strong>Categoría:</strong> ${detalle.producto.categoria.nombre}</p>
                        <p><strong>Descripción: </strong>${detalle.producto.descripcion}</p>
                        <p><strong>Precio unitario:</strong> $${detalle.producto.precio}</p>
                        <p><strong>Cantidad:</strong> ${detalle.cantidad}</p>
                        <p class="modal-subtotal"><strong>Subtotal:</strong> $${detalle.subtotal}</p>
                    </div>
                </div>
            `).join("")}
        </div>
    `;

    overlay.classList.add("visible");
    document.body.classList.add("modal-open");
};

export const cerrarModal = (): void => {
    const overlay = document.getElementById("modal-overlay");
    if (overlay) overlay.classList.remove("visible");
    document.body.classList.remove("modal-open");
};


const getEstadoClass = (estado: OrderState): string => {
    switch (estado) {
        case "PENDIENTE":
            return "estado-pendiente";
        case "EN_PREPARACION":
            return "estado-en-preparacion";
        case "ENTREGADO":
            return "estado-entregado";
        case "CANCELADO":
            return "estado-cancelado";
        default:
            return "";
    }
};

const resumenProductos = (order: Order): string => {
    const MAX = 3;
    const nombres = order.detalles.slice(0, MAX).map(d => `${d.producto.nombre} x${d.cantidad}`);
    const hayMas = order.detalles.length > MAX;
    return nombres.join(", ") + (hayMas ? ", ..." : "");
};


const renderOrders = (orders: Order[]): void => {
    if (!contenedorOrders || !orders) return;

    contenedorOrders.innerHTML = "";

    if (orders.length === 0) {
        contenedorOrders.innerHTML = `<p id="no-orders"><strong>No tenés pedidos${filtroActivo ? " con ese estado" : ""}.</strong></p>`;
        return;
    }

    orders.forEach(order => {
        const article = document.createElement("article");
        article.classList.add("order-card");
        article.innerHTML = `
            <div class="order-card-header">
                <span class="order-id">Pedido</span>
                <span class="estado-badge ${getEstadoClass(order.estado)}">${order.estado.replace("_", " ")}</span>
            </div>
            <p class="order-fecha">${order.fecha}</p>
            <p class="order-resumen">${resumenProductos(order)}</p>
            <div class="order-card-footer">
                <span class="order-total">$${order.total}</span>
                <button class="btn-ver-detalle">Ver detalle</button>
            </div>
        `;

        const btnDetalle = article.querySelector(".btn-ver-detalle");
        if (btnDetalle) {
            btnDetalle.addEventListener("click", () => {
                crearModal();
                abrirModal(order)
            });
        }
        
        contenedorOrders.appendChild(article);
    });
};


const configurarFiltros = (): void => {
    if (!filtros || filtros.length === 0) return;
    
    filtros.forEach(boton => {
        boton.addEventListener("click", () => {
            filtros.forEach(b => b.classList.remove("clicked"));
            boton.classList.add("clicked");
            filtroActivo = (boton as HTMLButtonElement).dataset.estado as OrderState | "";
            const filtrados = filtroActivo ? pedidosUsuario.filter(o => o.estado === filtroActivo) : pedidosUsuario;
            renderOrders(filtrados);
        });
    });
};

const renderizarTodo = (): void => {
    if (contenedorOrders && usuario) {
        pedidosUsuario = todosLosPedidos.filter(o => o.usuarioDto.id === usuario.id).reverse();
        configurarFiltros();
        renderOrders(pedidosUsuario);
    }
}

// Cargamos los datos
cargarDatos();
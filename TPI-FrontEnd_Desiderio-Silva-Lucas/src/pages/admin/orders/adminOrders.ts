import { verificarSesion } from "../../../utils/verificarSesion";
import { getCategories, getOrders, getProducts, removeActualUser, saveCategories, saveOrders, saveProducts } from "../../../utils/localStorage";
import type { Order, OrderState } from "../../../types/order";

import { fetchCategorias, fetchPedidos, fetchProductos } from "../../../utils/fetchs";
import type { Product } from "../../../types/product";
import type { ICategory } from "../../../types/category";

verificarSesion();


const contenedorOrders = document.getElementById("contenedor-orders") as HTMLElement; 
const cerrarSesion = document.querySelector(".cerrar-sesion") as HTMLButtonElement;
const filtros = document.querySelectorAll(".btn-filtro") as NodeListOf<HTMLButtonElement>;

let categorias: ICategory[] = [];
let todosLosProductos: Product[] = [];
let pedidos: Order[] = [];
let filtroActivo: OrderState | "" = "";

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

        renderizarTodo();

    } catch (e) {
        console.log("Error al cargar los datos: " + e)
    }
}



if (cerrarSesion) {
    cerrarSesion.addEventListener("click", () => {
        removeActualUser();
        verificarSesion();
    });
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
        const estadoInicial = order.estado;

        const article = document.createElement("article");
        article.classList.add("order-card");
        article.innerHTML = `
                <div class="order-header">
                    <span class="order-id">Pedido ${order.id}</span>
                    <span class="order-date">${order.fecha}</span>
                </div>
                
                <div class="order-body">
                    <div class="order-client-info">
                        <p><strong>Cliente:</strong> ${order.usuarioDto.nombre} ${order.usuarioDto.apellido}</p>
                        <p><strong>Dirección:</strong> Aún no soportada por el conjunto de datos</p>
                    </div>
                    <span class="order-resumen"><strong>Productos:</strong> ${resumenProductos(order)}</span>
                    <div class="order-total">$${order.total}</div>
                </div>

                <div class="order-actions">
                    <select class="cambiar-estado-select">
                        <option value="PENDIENTE" ${estadoInicial === "PENDIENTE" ? "selected" : ""}>Pendiente</option>
                        <option value="EN_PREPARACION" ${estadoInicial === "EN_PREPARACION" ? "selected" : ""}>En preparación</option>
                        <option value="ENTREGADO" ${estadoInicial === "ENTREGADO" ? "selected" : ""}>Entregado</option>
                        <option value="CANCELADO" ${estadoInicial === "CANCELADO" ? "selected" : ""}>Cancelado</option>
                    </select>
                    
                    <button class="btn-detalles">Ver Detalles</button>
                </div>
        `;

        const btnDetalle = article.querySelector(".btn-detalles");
        if (btnDetalle) {
            btnDetalle.addEventListener("click", () => {
                crearModal();
                abrirModal(order)
            });
        }

        const estadoSelect = article.querySelector(".cambiar-estado-select") as HTMLSelectElement;

        if (!estadoSelect) return;

        estadoSelect.addEventListener('change', () => {
            if (estadoSelect.value !== order.estado) {
                order.estado = estadoSelect.value as OrderState;

                const index: number = pedidos.findIndex(o => o.id === order.id);

                console.log(index)
                if (index !== -1) {
                    pedidos[index] = order;
                    saveOrders(pedidos);

                    const filtrados = filtroActivo ? pedidos.filter(o => o.estado === filtroActivo) : false;

                    if (filtrados) {
                        renderOrders(filtrados);
                    }
                    
                }
            }
        })

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
            const filtrados = filtroActivo
                ? pedidos.filter(o => o.estado === filtroActivo)
                : pedidos;
            renderOrders(filtrados);
        });
    });
};

const renderizarTodo = (): void => {
    if (contenedorOrders) {
        configurarFiltros();

        
        renderOrders(pedidos.sort((p1, p2) => p2.id - p1.id)); // Para que se renderice por ultimos agregados
    }
}

cargarDatos();
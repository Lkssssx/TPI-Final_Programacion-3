import { verificarSesion } from "../../../utils/verificarSesion";
import { getProductById, type CartItem, type Product } from "../../../types/product";
import { getCartItems, saveProducts, getProducts, saveCart, saveOrders, getOrders, getActualUser, removeCartItem } from "../../../utils/localStorage";
import { obtenerSiguienteIdOrder, type Order, type OrderDetail } from "../../../types/order";
import { fetchPedidos, fetchProductos } from "../../../utils/fetchs";
import { type User } from "../../../types/user";
import type { UserDTO } from "../../../types/userDTO";
import { abrirModal, crearModal } from "../../client/orders/orders";
import { mostrarResultado } from "../../../utils/mostrarResultado";

// Verificamos si ya está logueado
verificarSesion()

export const COSTO_ENVIO: number = 0; 

const productsCart = document.querySelector("#productsCart") as HTMLElement;
const totalSection = document.querySelector("#total") as HTMLElement;
const buyButton = document.querySelector(".btn-finalizar") as HTMLButtonElement;
const formaPagoSelect = document.querySelector("#forma-pago") as HTMLSelectElement;
const telefonoInput = document.querySelector("#telefono-checkout") as HTMLInputElement;
const ordenResult = document.querySelector("#orden-rs") as HTMLSpanElement;
const checkoutContainer = document.querySelector(".checkout-container") as HTMLElement;


let cartItems: CartItem[] = JSON.parse(getCartItems() ?? "[]");
const orders: Order[] = JSON.parse(getOrders() ?? "[]");
let todosLosProductos: Product[] = [];
let pedidos: Order[] = [];
const usuario: User = JSON.parse(getActualUser()!) // Usamos el "!" porque en la función de VerificarSesion ya verifica si el usuario es nulo

async function cargarDatos() {
    try {
        if (!getProducts()) {  // Nos aseguramos de que hayan productos guardados, y si no hay hacemos una primera inicializacion con los datos en data.ts
            todosLosProductos = await fetchProductos();
            saveProducts(todosLosProductos);
        } else {
            todosLosProductos = JSON.parse(getProducts()!) // El "!" al final le asegura a TS que es un valor no nulo
        }

        if (!getOrders()) {
            pedidos = await fetchPedidos();
            if (!pedidos) {
                saveOrders(pedidos);
            }
        } else {
            pedidos = JSON.parse(getOrders()!)
        }
    } catch (e) {
        console.log("Error al cargar los datos: " + e)
    }
}

// Nos ayudan a consultar y actualizar utilizando principios de SSOT (single source of truth)
const getProductFromLS = (id: number): Product | null => {
    const productosGuardados: Product[] = JSON.parse(getProducts() ?? "[]");
    return productosGuardados.find(p => p.id === id) ?? null;
};

const updateProductStockInLS = (id: number, newStock: number): void => {
    const productosGuardados: Product[] = JSON.parse(getProducts() ?? "[]");
    const prodIndex = productosGuardados.findIndex(p => p.id === id);
    if (prodIndex !== -1) {
        productosGuardados[prodIndex].stock = newStock;
        saveProducts(productosGuardados);
    }
};

export const addCartItem = (producto: Product, cantidad: number = 1): boolean => {
    // Consultamos el stock real directamente desde localStorage
    const productoLS = getProductFromLS(producto.id);
    if (!productoLS || productoLS.stock < cantidad || !productoLS.disponible) return false;

    // Buscamos si ya está en el carrito
    const cartItem = cartItems.find((item) => item.productId === producto.id);

    if (cartItem) {
        cartItem.cantidad += cantidad;
    } else {
        cartItems.push({ productId: producto.id, cantidad: cantidad });
    }

    // Actualizamos el stock en products
    updateProductStockInLS(producto.id, productoLS.stock - cantidad);
    
    // Sincronizamos visualmente el stock del producto
    producto.stock -= cantidad; 

    // Guardamos el carrito
    saveCart(cartItems);
    return true;
};

export const addOneCartItemById = (id: number): boolean => {
    const index = cartItems.findIndex((item) => item.productId === id);
    if (index === -1) return false; // findIndex devuelve -1 si no lo encuentra, por lo tanto cancelamos todo lo siguiente
    const item = cartItems[index];
    const producto: Product | null = getProductFromLS(item.productId);

    if (producto === null || producto.stock < 1) return false;

    const productoLS = getProductFromLS(id);

    // Restamos 1 unidad de stock a la base de datos
    if (productoLS) {
        updateProductStockInLS(id, productoLS.stock - 1);
    }

    // Sumamos uno a la cantidad
    item.cantidad++;

    saveCart(cartItems);

    return true
};

const removeCartItemById = (id: number): void => {
    const index = cartItems.findIndex((item) => item.productId === id);
    if (index === -1) return; // findIndex devuelve -1 si no lo encuentra, por lo tanto cancelamos todo lo siguiente

    const item = cartItems[index];
    const productoLS = getProductFromLS(id);

    // Devolvemos 1 unidad de stock a la base de datos
    if (productoLS) {
        updateProductStockInLS(id, productoLS.stock + 1);
    }

    // Restamos o eliminamos el ítem del carrito
    if (item.cantidad > 1) {
        item.cantidad--;
    } else {
        cartItems.splice(index, 1); // Lo borramos del array
    }

    saveCart(cartItems);
};

// Elimina el ítem del carrito y restaura todo su stock
const deleteCartItemCompletely = (id: number): void => {
    const index = cartItems.findIndex((item) => item.productId === id);
    if (index === -1) return;

    const item = cartItems[index];
    const productoLS = getProductFromLS(id);

    if (productoLS) {
        updateProductStockInLS(id, productoLS.stock + item.cantidad);
    }

    cartItems.splice(index, 1); 
    saveCart(cartItems);
};


// Eventos al restar la cantidad de un producto
const asignarEventosRestar = (): void => {
    const restarProductoContainer = document.querySelectorAll(".restar-producto") as NodeListOf<HTMLButtonElement>;
    restarProductoContainer.forEach(button => {
        button.addEventListener("click", () => {
            // Encontramos el id del producto
            const productId: number = Number(button.parentElement?.id.split("_")[1]);
            // Lo sacamos del carrito o le bajamos la cantidad
            removeCartItemById(productId); 
            // Actualizamos los datos mostrados en la página
            cargarCarrito();
            cargarTotal();
        });
    });
};

// Eventos para sumar otro producto al carrito
const asignarEventosAgregar = (): void => {
    const agregarProductoContainer = document.querySelectorAll(".agregar-producto") as NodeListOf<HTMLButtonElement>;
    agregarProductoContainer.forEach(button => {
        button.addEventListener("click", () => {
            // Encontramos el id del producto
            const productId: number = Number(button.parentElement?.id.split("_")[1]);
            // Le sumamos uno a su cantidad
            const isAdded = addOneCartItemById(productId); 
            // Actualizamos los datos mostrados en la página
            cargarCarrito();
            cargarTotal();

            const agregarResultado = document.querySelector("#agregar-rs") as HTMLSpanElement;
            if (agregarResultado) {
                mostrarResultado(isAdded, "", "No se pudo agregar al carrito por falta de stock", agregarResultado)
            }
            

        });
    });
};

// Eventos al eliminar un producto completamente
const asignarEventosEliminar = (): void => {
    const btnEliminarItem = document.querySelectorAll(".btn-eliminar-item") as NodeListOf<HTMLButtonElement>;
    btnEliminarItem.forEach(button => {
        button.addEventListener("click", () => {
            const productId: number = Number(button.id.split("_")[1]);
            deleteCartItemCompletely(productId);
            cargarCarrito();
            cargarTotal();
        });
    });
};

// Función para cargar el carrito dinamicamente
const cargarCarrito = (): void => {
    if (!productsCart) return;

    if (cartItems.length === 0) {
        productsCart.innerHTML = `
            <div class="carrito-vacio">
                <p><strong>Tu carrito está vacío.</strong></p>
                <button class="btn-volver-tienda" onclick="window.location.href='/src/pages/store/home/home.html'">Volver a la Tienda</button>
            </div>
        `;
        if (checkoutContainer) checkoutContainer.style.display = "none";
        return;
    }

    if (checkoutContainer) checkoutContainer.style.display = "block";
    
    // Reseteamos el carrito
    productsCart.innerHTML = "";

    cartItems.forEach((cartItem) => {
        // Buscamos los detalles visuales del producto en tiempo real
        const producto = getProductFromLS(cartItem.productId);
        if (!producto) return; // Si el producto fue borrado de la tienda, lo ignoramos

        const totalPorProducto = producto.precio * cartItem.cantidad;

        const article = document.createElement("article");
        article.id = `product_${producto.id}`;
        
        article.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            
            <div class="info-producto">
                <p class="nombre"><strong>${producto.nombre}</strong></p>
                <p class="categoria">Categoría: ${producto.categoria.nombre}</p>
                <p class="precio">Unitario: $${producto.precio}</p>
                <p class="precio-subtotal">Subtotal: $${totalPorProducto}</p>
            </div>
            
            <div class="agregar-sacar-producto" id="buttons_${producto.id}">
                <button class="restar-producto" title="Quitar uno"><i class="fa-solid fa-minus"></i></button>
                <span class="cantidad-producto">${cartItem.cantidad}</span>
                <button class="agregar-producto" ${producto.stock < 1 ? "disabled" : ""}"><i class="fa-solid fa-plus"></i></button>
            </div>
            
            <button class="btn-eliminar-item" id="del_${producto.id}" title="Eliminar del carrito"><i class="fa-solid fa-trash"></i></button>
            <span class="result" id="agregar-rs"></span>
        `;
        
        productsCart.appendChild(article);
    });

    // Damos utilidad a los botones de eliminar y agregar dinámicamente
    asignarEventosRestar();
    asignarEventosAgregar();
    asignarEventosEliminar();
};


// Función para calcular el subtotal
const calcularSubtotal = (): number => {
    return cartItems.reduce((acc, item) => {
        // Consultamos el precio en localStorage
        const producto = getProductFromLS(item.productId);
        // Si el producto existe usamos su precio y sino sumamos 0
        const precio = producto ? producto.precio : 0; 
        return acc + (precio * item.cantidad);
    }, 0);
};



// Función para cargar el total sumando los precios de los elementos en el carrito
const cargarTotal = (): void => {
    if (!totalSection) return;
    
    const subtotal = calcularSubtotal();
    const totalFinal = subtotal + COSTO_ENVIO;

    totalSection.innerHTML = `
        <div class="resumen-linea"><span>Subtotal:</span> <span>$${subtotal}</span></div>
        <div class="resumen-linea"><span>Envío:</span> <span>$${COSTO_ENVIO}</span></div>
        <hr class="resumen-divisor">
        <div class="resumen-linea total-final"><span>Total:</span> <span>$${totalFinal}</span></div>
    `;
};






const asignarEventoVaciar = (): void => {
    const btnVaciar = document.getElementById("btn-vaciar") as HTMLButtonElement;
    if (!btnVaciar) return;

    btnVaciar.addEventListener("click", () => {
        if (cartItems.length === 0) return;
        
        const confirmar = window.confirm("¿Estás seguro de que deseas vaciar todo el carrito?");
        if (!confirmar) return;

        // Restauramos el stock de todos los productos
        cartItems.forEach(item => {
            const productoLS = getProductFromLS(item.productId);
            if (productoLS) {
                updateProductStockInLS(item.productId, productoLS.stock + item.cantidad);
            }
        });

        cartItems = [];
        saveCart(cartItems);
        cargarCarrito();
        cargarTotal();
    });
};

const asignarEventoFinalizar = (): void => {
    if (!buyButton) return;


    buyButton.addEventListener('click', () => {
        if (!cartItems || cartItems.length === 0) {
            mostrarResultado(false, "", "No hay productos en el carrito.", ordenResult);
            return;
        }

        // Validamos el telefono
        const telefono = telefonoInput ? telefonoInput.value.trim() : "";
        if (!telefono || telefono.length < 10) { 
            mostrarResultado(false, "", "Ingresá un teléfono válido.", ordenResult);
            telefonoInput.focus();
            return;
        }


        const formaPago = formaPagoSelect.value as Order["formaPago"];
        if (!formaPago) {
            mostrarResultado(false, "", "Seleccioná un método de pago.", ordenResult);
            formaPagoSelect.focus();
            return;
        }



        // Empezamos a crear el detalle
        const id: number = obtenerSiguienteIdOrder();
        const subtotal: number = calcularSubtotal();
        const total: number = subtotal + COSTO_ENVIO; 
        const detalles: OrderDetail[] = [];

        cartItems.forEach(item => {
            const producto = getProductById(item.productId, todosLosProductos);
            if (!producto) return;

            const detalle: OrderDetail = {
                cantidad: item.cantidad,
                producto: producto,
                subtotal: producto.precio * item.cantidad
            }
            detalles.push(detalle);
        });

        if (detalles.length === 0) {
            mostrarResultado(false, "", "No se pudo procesar el pedido.", ordenResult);
            return; 
        }

        // Creamos el usuario sin su password
        const userDTO: UserDTO = {
            id: usuario.id,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            mail: usuario.mail,
            celular: usuario.celular,
            rol: usuario.rol
        }

        const order: Order = {
            id: id,
            fecha: `${new Date().toISOString().split('T')[0]}`, // Usamos el split para que solo nos devuelva la fecha, antes del time
            estado: "PENDIENTE",
            total: total, 
            formaPago: formaPago,
            detalles: detalles,
            usuarioDto: userDTO
        }

        orders.push(order);
        saveOrders(orders);

        // Vaciamos el carrito y volvemos a cargar la página
        removeCartItem(); 
        cartItems = JSON.parse(getCartItems() ?? "[]");
        cargarCarrito();
        cargarTotal();
        formaPagoSelect.value = "";
        

        // Abrimos el detalle con las funciones de order.ts
        crearModal();
        abrirModal(order);

        const exitoResult = document.createElement("span") as HTMLSpanElement
        const modalOverlay = document.querySelector("#modal-overlay") as HTMLDivElement;
        if (modalOverlay) modalOverlay.appendChild(exitoResult);

        mostrarResultado(true, "¡Pedido realizado correctamente!", "", exitoResult);
        // Timeout para que el DOM no se reacomode por el nuevo span, eliminandolo
        setTimeout(() => {
           exitoResult.remove(); 
        }, 3200);
    
    });
}

if (checkoutContainer) checkoutContainer.style.display = "block"; // Para que solo se vea el checkout si es que hay items
// Cargamos la pagina
cargarDatos();
cargarCarrito();
cargarTotal();
asignarEventoVaciar();
asignarEventoFinalizar();


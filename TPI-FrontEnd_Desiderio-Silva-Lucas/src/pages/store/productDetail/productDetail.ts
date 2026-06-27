import { verificarSesion } from "../../../utils/verificarSesion";
import { getProductById, type Product } from "../../../types/product";
import { fetchProductos } from "../../../utils/fetchs";
import { getProducts, saveProducts } from "../../../utils/localStorage";
import { addCartItem } from "../cart/cart";
import { mostrarResultado } from "../../../utils/mostrarResultado";

// Verificamos si está logueado
verificarSesion();

// Selectores del DOM
const productContainer = document.querySelector("#product-detail-container") as HTMLElement;
const backBtn = document.querySelector(".btn-back") as HTMLButtonElement;
const logoutBtn = document.querySelector(".cerrar-sesion") as HTMLButtonElement;
let todosLosProductos: Product[] = [];

async function cargarDatos() {
    try {
        if (!getProducts()) {  // Nos aseguramos de que hayan productos guardados, y si no hay hacemos una primera inicializacion con los datos en data.ts
            todosLosProductos = await fetchProductos();
            saveProducts(todosLosProductos);
        } else {
            todosLosProductos = JSON.parse(getProducts()!) // El "!" al final le asegura a TS que es un valor no nulo
        }
    } catch (e) {
        console.log("Error al cargar los datos: " + e)
    }
}


// Obtener el ID del producto de los parámetros de la URL
function getProductIdFromURL(): number {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    return id ? parseInt(id) : 0;
}

// Asignamos el evento al botón de agregar al carrito
const asignAddToCartButtonEvent = () => {
    const addToCartBtn = document.querySelector(".btn-add-cart") as HTMLButtonElement;

    if (!addToCartBtn) return; 

    addToCartBtn.addEventListener("click", () => {
        
        // Le pedimos una cornfimación
        const quiereAgregar = window.confirm("¿Estás seguro de que deseas agregar este producto al carrito?");
        
        // Si el usuario presiona "Cancelar", la variable es false y cortamos la ejecución
        if (!quiereAgregar) {
            return; 
        }

        const productId: number = Number(addToCartBtn.parentElement?.id.split("_")[1]);
        const producto: Product | null = getProductById(productId, todosLosProductos);
        if (!producto) return;

        const isAdded = addCartItem(producto, 1);
        const spanResult = document.querySelector(`#ag-pr_${productId}`) as HTMLSpanElement;

        const stockElement = document.querySelector(".stock") as HTMLParagraphElement;
        // Actualizamos el stock
        stockElement.innerHTML = `<strong>Stock disponible:</strong> ${producto.stock} unidades`;

        if (!spanResult) return;
        
        mostrarResultado(isAdded, "Producto agregado correctamente!", "No se pudo agregar, el producto no está disponible!", spanResult);
    });
}


// Renderizar el detalle del producto
function renderProductDetail() {

    productContainer.innerHTML = '';
    const productId = getProductIdFromURL();

    if (!productId) {
        productContainer.innerHTML = "<p class='no-encontrado'>Producto no encontrado.</p>";
        return;
    }
    
    const producto = todosLosProductos.find((p) => p.id === productId);

    if (!producto) {
        productContainer.innerHTML = "<p class='no-encontrado'>Producto no encontrado.</p>";
        return;
    }

    const article = document.createElement(`article`) as HTMLElement;
    article.id = `product_${producto.id}`;
    article.classList.add("product-content")

    article.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <div class="product-info">
            <div>
                <h1>${producto.nombre}</h1>
                <div class="price">$${producto.precio}</div>
                <p class="description">${producto.descripcion}</p>
                <div class="details">
                    <p><strong>Categoría:</strong> ${producto.categoria.nombre}</p>
                    <p class="stock"><strong>Stock disponible:</strong> ${producto.stock} unidades</p>
                    <p><strong>Estado:</strong> ${producto.disponible && producto.stock > 0  ? "Disponible" : "No disponible"}</p>
                </div>
            </div>
            <div class="product-actions" id="product-actions_${producto.id}">
                <button class="btn-add-cart" data-id="${producto.id}">Agregar al Carrito</button>
                <span class="result" id="ag-pr_${producto.id}"></span>
            </div>
        </div>
    `;
    productContainer.appendChild(article);
    asignAddToCartButtonEvent();
}

// Botón atrás
backBtn.addEventListener("click", () => {
    window.location.href = "../../../pages/store/home/home.html";
});

// Botón cerrar sesión
logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("actualUser");
    verificarSesion();
});

// Cargamos los datos
cargarDatos();
// Cargar el producto
renderProductDetail();
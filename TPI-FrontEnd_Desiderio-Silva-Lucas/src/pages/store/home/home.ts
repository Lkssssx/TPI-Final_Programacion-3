import { getOrders, getProducts, removeActualUser, saveOrders, saveProducts } from "../../../utils/localStorage";
import { type ICategory } from "../../../types/category";
import { getProductById, getProductsByName, type Product, getProductsByCategoryId } from "../../../types/product";
import { addCartItem } from "../cart/cart";
import { fetchCategorias, fetchPedidos, fetchProductos } from "../../../utils/fetchs";
import { verificarSesion } from "../../../utils/verificarSesion";
import type { Order } from "../../../types/order";
import { mostrarResultado } from "../../../utils/mostrarResultado";

// Verificamos la sesión
verificarSesion();

const contenedorProductos = document.getElementById("contenedor-productos") as HTMLElement;
const searchInput = document.querySelector("#buscarProducto") as HTMLInputElement;
const cerrarSesion = document.querySelector(".cerrar-sesion") as HTMLButtonElement
const ordenarSelector = document.querySelector("#ordenado") as HTMLSelectElement;
const navCategorias = document.querySelector("#nav-categorias") as HTMLUListElement;


let categorias: ICategory[] = [];
let todosLosProductos: Product[] = [];
let pedidos: Order[] = [];

cerrarSesion.addEventListener('click', () => {
    removeActualUser();
    verificarSesion();
})


async function cargarDatos() {
    try {
        categorias = await fetchCategorias();

        if (!getProducts()) {  // Nos aseguramos de que hayan productos guardados, y si no hay hacemos una primera inicializacion con los datos en data.ts
            todosLosProductos = await fetchProductos();
            saveProducts(todosLosProductos);
        } else {
            
            todosLosProductos = JSON.parse(getProducts()!) // El "!" al final le asegura a TS que es un valor no nulo
        }
        
        if (!getOrders()) {  // Nos aseguramos de que hayan productos guardados, y si no hay hacemos una primera inicializacion con los datos en data.ts
            pedidos = await fetchPedidos();
            saveOrders(pedidos);
        } else {
            pedidos = JSON.parse(getOrders()!) // El "!" al final le asegura a TS que es un valor no nulo
        }
        
        // Renderizamos la página
        renderizarTodo();

    } catch (e) {
        contenedorProductos.innerHTML = `<p id="no-productos"><strong>Error al cargar los datos.</strong></p>`
        console.log("Error al cargar los datos: " + e)
    }
}


const cargarCategorias = (): void => {
    categorias.forEach((categoria) => {
        const li = document.createElement(`li`) as HTMLLIElement;
        li.classList.add("categoria-ul");
        const button = document.createElement(`button`) as HTMLButtonElement;
        button.id = `categoria_${categoria.id}`;
        button.innerText = `${categoria.nombre}`;
        button.classList.add("nav-item");
        button.classList.add("button-categoria");
        li.appendChild(button);
        
        navCategorias.appendChild(li);
    });
};


const agregarEventosBotones = (agregarProductos: NodeListOf<HTMLButtonElement>): void => {
    agregarProductos.forEach(boton => {
        boton.addEventListener('click', () => {
            const productId: number = Number(boton.parentElement?.id.split("_")[1]);
            const producto: Product | null = getProductById(productId, todosLosProductos);
            if (!producto) return;

            const isAdded = addCartItem(producto, 1);
            const spanResult = document.querySelector(`#ag-pr_${productId}`) as HTMLSpanElement;

            // Utilidad para mostrar los resultados
            mostrarResultado(isAdded, "Producto agregado correctamente!", "No se pudo agregar, el producto no está disponible!", spanResult);
    });
    })
}



const cargarProductos = (productos: Product[]): void => {
    // Borramos los productos cargados por si se vuelven a cargar al buscar por categoría o nombre
    contenedorProductos.innerHTML = "";
    if (productos.length === 0) {
        contenedorProductos.innerHTML = `<p id="no-productos"><strong>No se encontraron productos.</strong></p>`;
        return;
    }

    productos.forEach((prod) => {
        // Solo productos que estén disponibles
        if (!prod.disponible) return;

        const article = document.createElement('article') as HTMLElement;
        
        article.id = `cartProduct_${prod.id}`;
        article.classList.add("product-card"); 
        
        article.style.cursor = "pointer";

        // Quitamos el enlace <a> de la estructura del HTML
        article.innerHTML = `
        <img src="${prod.imagen}">
        <p class="nombre"><strong>${prod.nombre}</strong></p>
        <p class="categoria"><strong>Categoría:</strong> ${prod.categoria.nombre}</p>
        <p class="descripcion"><strong>Descripción:</strong> ${prod.descripcion}</p>
        <p class="disponibilidad"><strong>Estado:</strong> ${prod.disponible && prod.stock > 0 ? "Disponible" : "No Disponible"}</p>
        <p class="precio"><strong>Precio:</strong> $${prod.precio}</p>
        <button class="agregar-producto">Agregar Producto</button>
        <span disabled class="result" id="ag-pr_${prod.id}"></span>
        `;

        // Evento para redirigir al detalle
        article.addEventListener("click", () => {
            window.location.href = `/src/pages/store/productDetail/productDetail.html?id=${prod.id}`;
        });

        // Para que el botón de agregar al carrito no nos lleve al detalle, detenemos la propagación.
        const botonAgregar = article.querySelector(".agregar-producto") as HTMLButtonElement;
        if (botonAgregar) {
            botonAgregar.addEventListener("click", (e) => {
                e.stopPropagation(); // ¡Súper importante! Evita que el click "suba" al article e intente abrir el detalle.
            });
        }

        contenedorProductos.appendChild(article);
    });

    // Les damos utilidad a los botones de agregar productos renderizados dinámicamente
    const agregarProductos = document.querySelectorAll(".agregar-producto") as NodeListOf<HTMLButtonElement>;
    agregarEventosBotones(agregarProductos);
};

// Hacemos funcionar los botones de ver los productos por categorías
const configurarEventos = (): void => {
    const buscarCategorias = document.querySelectorAll(".button-categoria") as NodeListOf<HTMLButtonElement>;
    buscarCategorias.forEach(boton => {
    boton.addEventListener('click', () => {
        searchInput.value = "";
        ordenarSelector.value = "";

        const isActive = boton.classList.contains("clicked");

        // Sacamos clicked de todos siempre
        buscarCategorias.forEach(boton2 => boton2.classList.remove("clicked"));

        if (isActive) {
            // Si ya estaba activo volvemos a cargar todos los productos
            cargarProductos(todosLosProductos);
            return;
        }

        boton.classList.add("clicked");
        const categoryId: number = Number(boton.id.split("_")[1]);
        cargarProductos(getProductsByCategoryId(categoryId, todosLosProductos));
        });
    });

// Hacemos funcionar la busqueda de productos
    searchInput.addEventListener('input', () => {
        // Desmarcamos el selector
        ordenarSelector.value = "";

        // Desmarcamos las categorías si había una clickeada
        buscarCategorias.forEach(boton => boton.classList.remove("clicked"));
        
        const products: Product[] = getProductsByName(searchInput.value, todosLosProductos);
        cargarProductos(products);
    });

    // Reiniciamos el dropdown
    ordenarSelector.value = "";

    ordenarSelector.addEventListener('change', () => {
        // Vaciamos el searchInput por si había algo
        searchInput.value = "";
        // Desmarcamos las categorías si había una clickeada
        buscarCategorias.forEach(boton => boton.classList.remove("clicked"));

        switch (ordenarSelector.value) {
            case "A-Z": {
                const productos: Product[] = [...todosLosProductos].sort((a, b) => a.nombre.localeCompare(b.nombre));   // Usamos localCompare para comparar cual va antes en orden alfabetico
                cargarProductos(productos);
                break
            }
            case "Z-A": {
                const productos: Product[] = [...todosLosProductos].sort((a, b) => a.nombre.localeCompare(b.nombre)).reverse();
                cargarProductos(productos);
                break
            }
            case "precio-des": {
                const productos: Product[] = [...todosLosProductos].sort((a, b) => a.precio - b.precio).reverse();
                
                cargarProductos(productos);
                break
            }
            case "precio-asc": {
                const productos: Product[] = [...todosLosProductos].sort((a, b) => a.precio - b.precio); // Usamos el "-" para que se ordene de menor a mayor
                cargarProductos(productos);
                break
            }
            default:
                cargarProductos(todosLosProductos);
                break;
        }
    })
}


const renderizarTodo = (): void => {
    cargarCategorias();
    cargarProductos(todosLosProductos);
    configurarEventos(); // Metemos acá la lógica de los botones para que no fallen
};


// Arrancamos la pagina
cargarDatos();

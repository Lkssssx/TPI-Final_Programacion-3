import { getCategories, getOrders, getProducts, removeActualUser, saveCategories, saveOrders, saveProducts } from "../../../utils/localStorage";
import { obtenerSiguienteIdCategory, type ICategory } from "../../../types/category";
import { fetchCategorias, fetchPedidos, fetchProductos } from "../../../utils/fetchs";
import { verificarSesion } from "../../../utils/verificarSesion";
import type { Order } from "../../../types/order";
import type { Product } from "../../../types/product";
import { mostrarResultado } from "../../../utils/mostrarResultado";

// Verificamos la sesión
verificarSesion();


const cerrarSesion = document.querySelector(".cerrar-sesion") as HTMLButtonElement;

const btnNuevaCategoria = document.querySelector("#btn-nueva-categoria") as HTMLButtonElement;
const categoriaResult = document.querySelector("#categoria-rs") as HTMLSpanElement;
const tbodyCategorias = document.querySelector("#tbody-categorias") as HTMLTableSectionElement;


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
        
        cargarCategorias();

    } catch (e) {
        console.log("Error al cargar los datos: " + e)
    }
}

const cerrarModal = (mensaje: string, modal: HTMLDivElement): void => {
    if (mensaje !== "") {
        if (!window.confirm(mensaje)) return;
    }
    document.body.classList.remove("modal-open");
    modal.classList.add("oculto")
    setTimeout(() => {
        modal.remove()
    }, 200); // Espera a que desaparezca y se borra
}

const asignarEventoAgregar = (btnNuevaCategoria: HTMLButtonElement): void => {

    if (!btnNuevaCategoria) return;

    btnNuevaCategoria.addEventListener('click', () => {
        const modal = document.createElement("div") as HTMLDivElement;

        modal.id = "modal-categoria";
        modal.classList.add("modal");

        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3 id="modal-titulo">Nueva Categoría</h3>
                    <button class="btn-close-modal" id="btn-close-form"><i class="fa-solid fa-xmark"></i></button>
                </div>
                
                <form id="form-categoria" class="modal-form">
                    <input type="hidden" id="cat-id">
                    
                    <div class="form-group">
                        <label for="cat-nombre">Nombre de la Categoría:</label>
                        <input type="text" id="cat-nombre" placeholder="Ej: Pizzas Clásicas" required>
                    </div>

                    <div class="form-group">
                        <label for="cat-desc">Descripción:</label>
                        <textarea id="cat-desc" rows="3" placeholder="Breve descripción para el catálogo..." required></textarea>
                    </div>

                    <div class="form-group">
                        <label for="cat-img">URL de la Imagen:</label>
                        <input type="url" id="cat-img" placeholder="https://ejemplo.com/imagen.jpg" required>
                    </div>
                    <span id="categoria-form-rs"></span>
                    <div class="modal-acciones">
                        <button type="button" class="btn-secondary btn-cancelar" id="btn-cancelar-form">Cancelar</button>
                        <button type="submit" class="btn-primary" id="btn-guardar">Guardar</button>
                    </div>
                    
                </form>
            </div>
            `

            document.body.appendChild(modal);
            document.body.classList.add("modal-open");

            const nuevoNombre = modal.querySelector("#cat-nombre") as HTMLInputElement;
            const nuevaDescripcion = modal.querySelector("#cat-desc") as HTMLTextAreaElement;
            const nuevaImagen = modal.querySelector("#cat-img") as HTMLInputElement;
            
            const btnGuardar = modal.querySelector("#btn-guardar") as HTMLButtonElement;
            const btnCerrar = modal.querySelector("#btn-close-form") as HTMLButtonElement;
            const btnCancelar = modal.querySelector("#btn-cancelar-form") as HTMLButtonElement;


            const huboCambios = (): boolean => nuevoNombre.value !== "" || nuevaDescripcion.value !== "" || nuevaImagen.value !== "";


            btnCerrar.addEventListener('click', () => {
                if (huboCambios()) {
                    cerrarModal("¿Estas seguro que quieres salir?", modal);
                } else {
                    cerrarModal("", modal);
                }
            })

            btnCancelar.addEventListener('click', () => {
                if (huboCambios()) {
                    cerrarModal("¿Estas seguro que quieres cancelar la operación?", modal);
                } else {
                    cerrarModal("", modal);
                }
            })


            const formResult = modal.querySelector("#categoria-form-rs") as HTMLSpanElement;

            btnGuardar.addEventListener('click', (e) => {
                e.preventDefault()

                if (!nuevoNombre.value || !nuevaDescripcion.value || !nuevaImagen.value) {
                    mostrarResultado(false, "", "Por favor completá todos los campos.", formResult);
                    return;
                }

                if (!window.confirm("¿Estas seguro que quieres agregar la categoría?")) return;

                
                const id = obtenerSiguienteIdCategory();
                const nuevaCategoria: ICategory = {
                    id: id,
                    nombre: nuevoNombre.value,
                    descripcion: nuevaDescripcion.value,
                    imagen: nuevaImagen.value,
                }

                categorias.push(nuevaCategoria);

                tbodyCategorias.innerHTML = "";
                saveCategories(categorias);
                cargarCategorias();
                
                cerrarModal("", modal);
                mostrarResultado(true, "Categoría agregada correctamente.", "", categoriaResult);
            })
    })
}




const asignarEventoEditar = (categoria: ICategory, btnEditar: HTMLButtonElement): void => {

    if (!btnEditar) return;

    btnEditar.addEventListener('click', () => {
        const modal = document.createElement("div") as HTMLDivElement;

        modal.id = "modal-categoria";
        modal.classList.add("modal");
        

        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3 id="modal-titulo">Editar Categoría</h3>
                    <button class="btn-close-modal" id="btn-close-form"><i class="fa-solid fa-xmark"></i></button>
                </div>
                
                <form id="form-categoria" class="modal-form">
                    <input type="hidden" id="cat-id">
                    
                    <div class="form-group">
                        <label for="cat-nombre">Nombre de la Categoría:</label>
                        <input type="text" id="cat-nombre" placeholder="Ej: Pizzas Clásicas" value="${categoria.nombre}" required>
                    </div>

                    <div class="form-group">
                        <label for="cat-desc">Descripción:</label>
                        <textarea id="cat-desc" rows="3" placeholder="Breve descripción para el catálogo..." required>${categoria.descripcion}</textarea>
                    </div>

                    <div class="form-group">
                        <label for="cat-img">URL de la Imagen:</label>
                        <input type="url" id="cat-img" placeholder="https://ejemplo.com/imagen.jpg" value="${categoria.imagen}" required>
                    </div>

                    <div class="modal-acciones">
                        <button type="button" class="btn-secondary btn-cancelar" id="btn-cancelar-form">Cancelar</button>
                        <button type="submit" class="btn-primary" id="btn-guardar">Guardar</button>
                    </div>
                </form>
            </div>
            `

            document.body.appendChild(modal);
            document.body.classList.add("modal-open");

            const nuevoNombre = modal.querySelector("#cat-nombre") as HTMLInputElement;
            const nuevaDescripcion = modal.querySelector("#cat-desc") as HTMLTextAreaElement;
            const nuevaImagen = modal.querySelector("#cat-img") as HTMLInputElement;
            
            const btnGuardar = modal.querySelector("#btn-guardar") as HTMLButtonElement;
            const btnCerrar = modal.querySelector("#btn-close-form") as HTMLButtonElement;
            const btnCancelar = modal.querySelector("#btn-cancelar-form") as HTMLButtonElement;

            const nombreOriginal = categoria.nombre;
            const descripcionOriginal = categoria.descripcion;
            const imagenOriginal = categoria.imagen;

            const huboCambios = (): boolean => nuevoNombre.value !== nombreOriginal || nuevaDescripcion.value !== descripcionOriginal || nuevaImagen.value !== imagenOriginal;


            btnCerrar.addEventListener('click', () => {
                if (huboCambios()) {
                    cerrarModal("¿Estas seguro que quieres salir?", modal);
                } else {
                    cerrarModal("", modal);
                }
            })

            btnCancelar.addEventListener('click', () => {
                if (huboCambios()) {
                    cerrarModal("¿Estas seguro que quieres cancelar la operación?", modal);
                } else {
                    cerrarModal("", modal);
                }
            })


            btnGuardar.addEventListener('click', (e) => {
                e.preventDefault()
                // Si no hubieron cambios, cerramos
                if (!huboCambios()) {
                    cerrarModal("", modal);
                    return
                }

                
                if (!window.confirm("¿Estas seguro que quieres guardar los cambios?")) return




                const index = categorias.findIndex(cate => cate.id === categoria.id);

                if (index !== -1) {
                    categoria.nombre = nuevoNombre.value;
                    categoria.descripcion = nuevaDescripcion.value;
                    categoria.imagen = nuevaImagen.value;

                    // Reemplazamos la categoría
                    categorias[index] = categoria;

                    // Vaciamos las categorias para después volverlas a cargar
                    tbodyCategorias.innerHTML = "";

                    // Guardamos y recargamos los datos
                    saveCategories(categorias)
                    cargarCategorias();
                }

                cerrarModal("", modal);
                mostrarResultado(true, "Categoría editada correctamente.", "", categoriaResult);
            })
    })
}

const asignarEventoEliminar = (categoria: ICategory, btnEliminar: HTMLButtonElement): void => {

    if (!btnEliminar) return;

    btnEliminar.addEventListener('click', () => {
        const modal = document.createElement("div") as HTMLDivElement;

        modal.id = "modal-eliminar";
        modal.classList.add("modal");

        modal.innerHTML = `
            <div class="modal-content modal-sm">
                <div class="modal-header">
                    <h3>Confirmar Eliminación</h3>
                    <button class="btn-close-modal" id="btn-close-delete"><i class="fa-solid fa-xmark"></i></button>
                </div>
                <div class="modal-body">
                    <p>¿Estás seguro de que deseas eliminar esta categoría? Esta acción no se puede deshacer.</p>
                </div>
                <div class="modal-acciones">
                    <button type="button" class="btn-secondary btn-cancelar" id="btn-cancelar-delete">Cancelar</button>
                    <button type="button" id="btn-confirmar-eliminar" class="btn-danger">Eliminar</button>
                </div>
            </div>
            `

            document.body.appendChild(modal);
            document.body.classList.add("modal-open");
            
            const btnConfirmar = modal.querySelector("#btn-confirmar-eliminar") as HTMLButtonElement;
            const btnCerrar = modal.querySelector("#btn-close-delete") as HTMLButtonElement;
            const btnCancelar = modal.querySelector("#btn-cancelar-delete") as HTMLButtonElement;


            btnCerrar.addEventListener('click', () => {
                cerrarModal("", modal)
            })

            btnCancelar.addEventListener('click', () => {
                cerrarModal("", modal);
            })


            btnConfirmar.addEventListener('click', (e) => {
                e.preventDefault()

                const index = categorias.findIndex(cate => cate.id === categoria.id);
                
                // Eliminamos la categoría
                if (index !== -1) {
                    categorias.splice(index, 1);
                }
                
                tbodyCategorias.innerHTML = "";
                // Guardamos y recargamos los datos
                saveCategories(categorias)
                cargarCategorias();
                cerrarModal("", modal);
                mostrarResultado(true, "Categoría eliminada correctamente.", "", categoriaResult);
            })
    })
}



const cargarCategorias = (): void => {
    categorias.forEach(cate => {

        const tr = document.createElement("tr") as HTMLTableRowElement;
        tr.id = "tr-todas-categorias";

        tr.innerHTML = `
            <td><img class="td-img-admin" src="${cate.imagen}" alt="${cate.nombre}" /></td>
            <td>${cate.nombre}</td>
            <td>${cate.descripcion}</td>
            <td>
                <button class="btn-accion btn-editar"><i class="fa-solid fa-pen"></i></button>
                <button class="btn-accion btn-eliminar"><i class="fa-solid fa-trash"></i></button>
            </td>
        `;
        
        if (!tbodyCategorias) return 

        // Agregamos la categoría
        tbodyCategorias.appendChild(tr);

        const btnEditar = tr.querySelector(".btn-editar") as HTMLButtonElement;
        const btnEliminar = tr.querySelector(".btn-eliminar") as HTMLButtonElement;

        asignarEventoEditar(cate, btnEditar);
        asignarEventoEliminar(cate, btnEliminar)
    });
}

await cargarDatos();
asignarEventoAgregar(btnNuevaCategoria);
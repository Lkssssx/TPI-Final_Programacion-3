import { getCategories, getOrders, getProducts, removeActualUser, saveCategories, saveOrders, saveProducts } from "../../../utils/localStorage";
import { getCategoryById, obtenerSiguienteIdCategory, type ICategory } from "../../../types/category";
import { fetchCategorias, fetchPedidos, fetchProductos } from "../../../utils/fetchs";
import { verificarSesion } from "../../../utils/verificarSesion";
import type { Order } from "../../../types/order";
import { obtenerSiguienteIdProduct, type Product } from "../../../types/product";
import { mostrarResultado } from "../../../utils/mostrarResultado";

// Verificamos la sesión
verificarSesion();


const cerrarSesion = document.querySelector(".cerrar-sesion") as HTMLButtonElement;

const btnNuevoProducto = document.querySelector("#btn-nuevo-producto") as HTMLButtonElement;
const productoResult = document.querySelector("#productos-rs") as HTMLSpanElement;
const tbodyProductos = document.querySelector("#tbody-productos") as HTMLTableSectionElement;


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
        
        cargarProductos();

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

const asignarEventoAgregar = (btnNuevoProducto: HTMLButtonElement): void => {

    if (!btnNuevoProducto) return;

    btnNuevoProducto.addEventListener('click', () => {
        const modal = document.createElement("div") as HTMLDivElement;

        modal.id = "modal-producto";
        modal.classList.add("modal");

        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3 id="modal-titulo">Nuevo Producto</h3>
                    <button class="btn-close-modal" id="btn-close-form"><i class="fa-solid fa-xmark"></i></button>
                </div>
                
                <form id="form-producto" class="modal-form">
                    <input type="hidden" id="prod-id">
                    
                    <div class="form-group">
                        <label for="prod-nombre">Nombre del Producto:</label>
                        <input type="text" id="prod-nombre" placeholder="Ej: Hamburguesa Doble Bacon" required>
                    </div>

                    <div class="form-group">
                        <label for="prod-desc">Descripción:</label>
                        <textarea id="prod-desc" rows="3" placeholder="Detalle de ingredientes..." required></textarea>
                    </div>

                    <div class="form-group">
                        <label for="prod-precio">Precio ($):</label>
                        <input type="number" id="prod-precio" placeholder="Ej: 8500" min="0" step="0.01" required>
                    </div>

                    <div class="form-group">
                        <label for="prod-stock">Stock Disponible:</label>
                        <input type="number" id="prod-stock" placeholder="Ej: 50" min="0" required>
                    </div>

                    <div class="form-group">
                        <label for="prod-categoria">Categoría:</label>
                        <select id="prod-categoria" required>
                            <option value="" disabled selected>Seleccioná una categoría</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="prod-img">URL de la Imagen:</label>
                        <input type="url" id="prod-img" placeholder="https://ejemplo.com/hamburguesa.jpg" required>
                    </div>
                    
                    <span id="producto-form-rs" class="result"></span>
                    
                    <div class="modal-acciones">
                        <button type="button" class="btn-secondary btn-cancelar" id="btn-cancelar-form">Cancelar</button>
                        <button type="submit" class="btn-primary" id="btn-guardar">Guardar</button>
                    </div>
                    
                </form>
            </div>
            `

            document.body.appendChild(modal);
            document.body.classList.add("modal-open");

            const nuevoNombre = modal.querySelector("#prod-nombre") as HTMLInputElement;
            const nuevaDescripcion = modal.querySelector("#prod-desc") as HTMLTextAreaElement;
            const nuevoPrecio = modal.querySelector("#prod-precio") as HTMLInputElement;
            const nuevoStock = modal.querySelector("#prod-stock") as HTMLInputElement;
            const nuevaImagen = modal.querySelector("#prod-img") as HTMLInputElement;
            const categoriaSelect = modal.querySelector("#prod-categoria") as HTMLSelectElement;
            
            const btnGuardar = modal.querySelector("#btn-guardar") as HTMLButtonElement;
            const btnCerrar = modal.querySelector("#btn-close-form") as HTMLButtonElement;
            const btnCancelar = modal.querySelector("#btn-cancelar-form") as HTMLButtonElement;

            categorias.forEach(cate => {
                const optionCate = document.createElement("option") as HTMLOptionElement;
                optionCate.classList.add("categoria")
                optionCate.value = String(cate.id);
                optionCate.textContent = cate.nombre;

                categoriaSelect.appendChild(optionCate);
            });
            

            const huboCambios = (): boolean => nuevoNombre.value !== "" || nuevaDescripcion.value !== "" || nuevoPrecio.value !== "" || nuevoStock.value !== "" || categoriaSelect.value !== "" || nuevaImagen.value !== "";


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


            const formResult = modal.querySelector("#producto-form-rs") as HTMLSpanElement;

            btnGuardar.addEventListener('click', (e) => {
                e.preventDefault()

                // Validaciones
                if (!nuevoNombre.value || !nuevaDescripcion.value || !nuevoPrecio.value || !nuevoStock.value || !categoriaSelect.value || !nuevaImagen.value) {
                    mostrarResultado(false, "", "Por favor completá todos los campos.", formResult);
                    return;
                }
                if (Number(nuevoPrecio.value) <= 0 || nuevoPrecio.value.startsWith("0")) { // Para evitar NaN si el usuario llega a poner un precio que inicie con "0"
                    mostrarResultado(false, "", "El precio debe ser mayor a 0.", formResult);
                    return;
                }
                if (Number(nuevoStock.value) < 0) {
                    mostrarResultado(false, "", "El stock no puede ser negativo.", formResult);
                    return;
                }



                if (!window.confirm("¿Estas seguro que quieres agregar el producto?")) return;

                // Verificamos que la categoría no sea null
                if (getCategoryById(Number(categoriaSelect.value)) === null) return;

                const categoria: ICategory = getCategoryById(Number(categoriaSelect.value))!; // Usamos el "!" porque sabemos que no es null
                
                const id = obtenerSiguienteIdProduct();
                const nuevoProducto: Product = {
                    id: id,
                    nombre: nuevoNombre.value,
                    precio: Number(nuevoPrecio.value),
                    descripcion: nuevaDescripcion.value,
                    stock: Number(nuevoStock.value),
                    imagen: nuevaImagen.value,
                    disponible: true,
                    categoria: categoria
                }

                todosLosProductos.push(nuevoProducto);

                tbodyProductos.innerHTML = "";
                saveProducts(todosLosProductos);
                cargarProductos();
                
                cerrarModal("", modal);
                mostrarResultado(true, "Producto agregado correctamente.", "", productoResult);
            })
    })
}




const asignarEventoEditar = (producto: Product, btnEditarProducto: HTMLButtonElement): void => {

    if (!btnEditarProducto) return;

    btnEditarProducto.addEventListener('click', () => {
        const modal = document.createElement("div") as HTMLDivElement;

        modal.id = "modal-producto";
        modal.classList.add("modal");

        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3 id="modal-titulo">Editar Producto</h3>
                    <button class="btn-close-modal" id="btn-close-form"><i class="fa-solid fa-xmark"></i></button>
                </div>
                
                <form id="form-producto" class="modal-form">
                    <input type="hidden" id="prod-id" value="${producto.id}">
                    
                    <div class="form-group">
                        <label for="prod-nombre">Nombre del Producto:</label>
                        <input type="text" id="prod-nombre" placeholder="Ej: Hamburguesa Doble Bacon" value="${producto.nombre}" required>
                    </div>

                    <div class="form-group">
                        <label for="prod-desc">Descripción:</label>
                        <textarea id="prod-desc" rows="3" placeholder="Detalle de ingredientes..." required>${producto.descripcion}</textarea>
                    </div>

                    <div class="form-group">
                        <label for="prod-precio">Precio ($):</label>
                        <input type="number" id="prod-precio" placeholder="Ej: 8500" min="0" step="0.01" value="${producto.precio}" required>
                    </div>

                    <div class="form-group">
                        <label for="prod-stock">Stock Disponible:</label>
                        <input type="number" id="prod-stock" placeholder="Ej: 50" min="0" value="${producto.stock}" required>
                    </div>

                    <div class="form-group">
                        <label for="prod-categoria">Categoría:</label>
                        <select id="prod-categoria" required>
                            <option id="prod-option-default" value="" disabled selected>Seleccioná una categoría</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="prod-disponible">Estado del Producto:</label>
                        <select id="prod-disponible" required>
                            <option value="true" ${producto.disponible === true ? 'selected' : ''}>Disponible</option>
                            <option value="false" ${producto.disponible === false ? 'selected' : ''}>No Disponible</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="prod-img">URL de la Imagen:</label>
                        <input type="url" id="prod-img" placeholder="https://ejemplo.com/hamburguesa.jpg" value="${producto.imagen}" required>
                    </div>
                    
                    <span id="producto-form-rs" class="result"></span>
                    
                    <div class="modal-acciones">
                        <button type="button" class="btn-secondary btn-cancelar" id="btn-cancelar-form">Cancelar</button>
                        <button type="submit" class="btn-primary" id="btn-guardar">Guardar</button>
                    </div>
                    
                </form>
            </div>
            `;

        document.body.appendChild(modal);
        document.body.classList.add("modal-open");

        const nuevoNombre = modal.querySelector("#prod-nombre") as HTMLInputElement;
        const nuevaDescripcion = modal.querySelector("#prod-desc") as HTMLTextAreaElement;
        const nuevoPrecio = modal.querySelector("#prod-precio") as HTMLInputElement;
        const nuevoStock = modal.querySelector("#prod-stock") as HTMLInputElement;
        const nuevaDisponibilidad = modal.querySelector("#prod-disponible") as HTMLSelectElement;
        const nuevaImagen = modal.querySelector("#prod-img") as HTMLInputElement;
        const categoriaSelect = modal.querySelector("#prod-categoria") as HTMLSelectElement;

        const btnGuardar = modal.querySelector("#btn-guardar") as HTMLButtonElement;
        const btnCerrar = modal.querySelector("#btn-close-form") as HTMLButtonElement;
        const btnCancelar = modal.querySelector("#btn-cancelar-form") as HTMLButtonElement;

        categorias.forEach(cate => {
            const optionCate = document.createElement("option") as HTMLOptionElement;
            optionCate.classList.add("categoria");
            optionCate.value = String(cate.id);
            optionCate.textContent = cate.nombre;

            // Con el "?" comprobamos si existe su categoria antes de pedir su id
            if (producto.categoria?.id === cate.id) {
                optionCate.selected = true; 
            }

            categoriaSelect.appendChild(optionCate);
        });

        // Guardamos como quedó el select del inicio para después comparar si hubieron cambios
        const categoriaInicial = categoriaSelect.value;
        const estadoInicial = nuevaDisponibilidad.value;

        // Comparamos si hubo cambios
        const huboCambios = (): boolean => nuevoNombre.value !== producto.nombre || nuevaDescripcion.value !== producto.descripcion || Number(nuevoPrecio.value) !== producto.precio || Number(nuevoStock.value) !== producto.stock || categoriaSelect.value !== categoriaInicial || nuevaImagen.value !== producto.imagen || nuevaDisponibilidad.value !== estadoInicial; 

        btnCerrar.addEventListener('click', () => {
            if (huboCambios()) {
                cerrarModal("¿Estas seguro que quieres salir?", modal);
            } else {
                cerrarModal("", modal);
            }
        });

        btnCancelar.addEventListener('click', () => {
            if (huboCambios()) {
                cerrarModal("¿Estas seguro que quieres cancelar la operación?", modal);
            } else {
                cerrarModal("", modal);
            }
        });

        const formResult = modal.querySelector("#producto-form-rs") as HTMLSpanElement;

        btnGuardar.addEventListener('click', (e) => {
            e.preventDefault();
            
            if (!huboCambios()) {
                cerrarModal("", modal);
                return;
            }

            // Validaciones
            if (Number(nuevoPrecio.value) <= 0 || nuevoPrecio.value.startsWith("0")) { // Para evitar NaN si el usuario llega a poner un precio que inicie con "0"
                mostrarResultado(false, "", "El precio debe ser mayor a 0.", formResult);
                return;
            }
            if (Number(nuevoStock.value) < 0) {
                mostrarResultado(false, "", "El stock no puede ser negativo.", formResult);
                return;
            }

            if (!window.confirm("¿Estas seguro que quieres modificar el producto?")) return;

            let nuevaCategoria: ICategory = producto.categoria; 
            const categoriaEncontrada = getCategoryById(Number(categoriaSelect.value)); 

            // Si la encuentra (sin importar si tu función devuelve null o undefined), la asimilamos
            console.log(categoriaEncontrada)
            if (categoriaEncontrada) {
                nuevaCategoria = categoriaEncontrada; 
            }

            const index = todosLosProductos.findIndex(prod => prod.id === producto.id);

            if (index !== -1) {
                // Actualizamos sus valores
                producto.nombre = nuevoNombre.value;
                producto.descripcion = nuevaDescripcion.value;
                producto.categoria = nuevaCategoria;
                producto.disponible = nuevaDisponibilidad.value === "true";
                producto.imagen = nuevaImagen.value;
                producto.precio = Number(nuevoPrecio.value);
                producto.stock = Number(nuevoStock.value);

                todosLosProductos[index] = producto;

                tbodyProductos.innerHTML = "";
                saveProducts(todosLosProductos);
                cargarProductos();
            }
            
            cerrarModal("", modal);
            mostrarResultado(true, "Producto modificado correctamente.", "", formResult);
        });
    });
};

const asignarEventoEliminar = (producto: Product, btnEliminar: HTMLButtonElement): void => {

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
                    <p>¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.</p>
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

                const index = todosLosProductos.findIndex(prod => prod.id === producto.id);
                
                // Eliminamos el producto
                if (index !== -1) {
                    todosLosProductos.splice(index, 1);
                }
                
                tbodyProductos.innerHTML = "";
                // Guardamos y recargamos los datos
                saveProducts(todosLosProductos)
                cargarProductos();
                cerrarModal("", modal);
                mostrarResultado(true, "Producto eliminado correctamente.", "", productoResult);
            })
    })
}



const cargarProductos = (): void => {
    todosLosProductos.forEach(prod => {

        const tr = document.createElement("tr") as HTMLTableRowElement;
        tr.id = "tr-todos-productos";

        tr.innerHTML = `
            <td><img class="td-img-admin" src="${prod.imagen}" alt="${prod.nombre}" /></td>
            <td>${prod.nombre}</td>
            <td>${prod.categoria.nombre}</td>
            <td>${prod.precio}</td>
            <td>${prod.stock}</td>
            <td>${prod.descripcion}</td>
            <td>${prod.disponible ? "Disponible" : "No Disponible"}</td>
            <td>
                <button class="btn-accion btn-editar"><i class="fa-solid fa-pen"></i></button>
                <button class="btn-accion btn-eliminar"><i class="fa-solid fa-trash"></i></button>
            </td>
        `;
        
        if (!tbodyProductos) return 

        // Agregamos la categoría
        tbodyProductos.appendChild(tr);

        const btnEditar = tr.querySelector(".btn-editar") as HTMLButtonElement;
        const btnEliminar = tr.querySelector(".btn-eliminar") as HTMLButtonElement;

        asignarEventoEditar(prod, btnEditar);
        asignarEventoEliminar(prod, btnEliminar)
    });
}

await cargarDatos();
asignarEventoAgregar(btnNuevoProducto);
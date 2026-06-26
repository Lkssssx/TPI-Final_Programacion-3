
import { getProducts } from "../utils/localStorage";
import type { ICategory } from "./category";
export interface Product {
    id: number,
    nombre: string,
    precio: number,
    descripcion: string
    stock: number,
    imagen: string,
    disponible: boolean,
    categoria: ICategory;
}; // Lastimosamente tengo que embeber la categoría acá porque los datos que nos dieron lo hacia, mala práctica sabiendo que estámos trabajando con SQL en el backend
   // Esto después crea inconsistencias si se llega a eliminar una categoría, debido a la duplicación de datos

export interface CartItem {
    productId: number;  // Usamos una referencia a la id para no duplicar datos poniendo todo el producto
    cantidad: number;
}


const productos: Product[] = JSON.parse(localStorage.getItem("productos") || "[]");


export const getProductById = (id: number, products: Product[] = productos): Product | null => {
    return products.find(product => product.id === id) ?? null;
};

export const getProductsByName = (name: string, products: Product[] = productos): Product[] => {
    return products.filter(product => product.nombre.toLocaleLowerCase().includes(name.toLocaleLowerCase()));
};

export const getProductsByCategoryId = (id: number, products: Product[] = productos): Product[] => {
    return products.filter(product => product.categoria.id == id);
};

// Función para obtener el siguiente ID disponible
export const obtenerSiguienteIdProduct = (): number => {
    const products = getProducts();
    if (!products) return 1;

    const productsArray = JSON.parse(products) as Product[];
    if (productsArray.length === 0) return 1;

    const maxId = Math.max(...productsArray.map((p) => Number(p.id) || 0)); 

    return maxId + 1;
}
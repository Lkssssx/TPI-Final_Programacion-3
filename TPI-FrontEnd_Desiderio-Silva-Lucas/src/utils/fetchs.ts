import { type Product } from "../types/product";
import { type ICategory } from "../types/category";

const BASE_URL = "/data"; 

/**
 * Obtiene la lista completa de productos desde el archivo JSON de configuración.
 */
export const fetchProductos = async (): Promise<Product[]> => {
    const res = await fetch(`${BASE_URL}/productos.json`);
    if (!res.ok) {
        throw new Error(`Error HTTP: ${res.status} - No se pudieron cargar los productos`);
    }
    return res.status === 204 ? [] : await res.json();
};

/**
 * Obtiene la lista completa de categorías disponibles.
 */
export const fetchCategorias = async (): Promise<ICategory[]> => {
    const res = await fetch(`${BASE_URL}/categorias.json`);
    if (!res.ok) {
        throw new Error(`Error HTTP: ${res.status} - No se pudieron cargar las categorías`);
    }
    return await res.json();
};

/**
 * Obtiene el historial simulado de pedidos.
 */
export const fetchPedidos = async (): Promise<any[]> => {
    const res = await fetch(`${BASE_URL}/pedidos.json`);
    if (!res.ok) {
        throw new Error(`Error HTTP: ${res.status} - No se pudieron cargar los pedidos`);
    }
    return await res.json();
};

/**
 * Obtiene los usuarios registrados para el sistema de login local.
 */
export const fetchUsuarios = async (): Promise<any[]> => {
    const res = await fetch(`${BASE_URL}/usuarios.json`);
    if (!res.ok) {
        throw new Error(`Error HTTP: ${res.status} - No se pudieron cargar los usuarios`);
    }
    return await res.json();
};
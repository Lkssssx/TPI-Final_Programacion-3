import { getCategories } from "../utils/localStorage";

export interface ICategory {
    id: number,
    nombre: string,
    descripcion: string,
    imagen: string
};

const categorias: ICategory[] = JSON.parse(getCategories() || "[]");

export const getCategoryById = (id: number): ICategory | null => {
    const categoria: ICategory | null = categorias.find(category => category.id === id) ?? null;
    return categoria;
}

// Función para obtener el siguiente ID disponible
export const obtenerSiguienteIdCategory = (): number => {
    const categories = getCategories();
    if (!categories) return 1;

    const categoriesArray = JSON.parse(categories) as ICategory[];
    if (categoriesArray.length === 0) return 1;

    const maxId = Math.max(...categoriesArray.map((c) => Number(c.id) || 0)); 

    return maxId + 1;
}
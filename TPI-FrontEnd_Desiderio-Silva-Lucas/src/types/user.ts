import { getUsers } from "../utils/localStorage";

export interface User {
    id: number,
    nombre: string,
    apellido: string,
    mail: string
    celular: string,
    rol: string,
    password: string,
};


export const searchUserByEmail = (email: string): User | null => {
    const usuarios: User[] = JSON.parse(getUsers() || "[]");
    return usuarios.find(usuario => usuario.mail === email) ?? null;
}

// Función para obtener el siguiente ID disponible
export const obtenerSiguienteIdUser = (): number => {
    const users = getUsers();
    if (!users) return 1;

    const usuariosArray = JSON.parse(users) as User[];
    const maxId = Math.max(...usuariosArray.map((u) => u.id)); // Usamos el spread para poder buscar el id más alto
    return maxId + 1;
}
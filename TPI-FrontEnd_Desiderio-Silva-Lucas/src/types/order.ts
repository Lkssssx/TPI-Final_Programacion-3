// types/order.ts

import { getOrders } from "../utils/localStorage";
import type { Product } from "./product";
import type { UserDTO } from "./userDTO";

export interface OrderDetail {
    cantidad: number;
    producto: Product;
    subtotal: number;
}

export type OrderState= "PENDIENTE" | "EN_PREPARACION" | "ENTREGADO" | "CANCELADO";
export type OrderPaymentMethod = "TRANSFERENCIA" | "EFECTIVO" | "TARJETA";

export interface Order {
    id: number;
    fecha: string;
    estado: OrderState;
    total: number;
    formaPago: OrderPaymentMethod;
    detalles: OrderDetail[];
    usuarioDto: UserDTO; // Para que no se guarde la contraseña
}

export const getOrdersByEstado = (orders: Order[], estado: OrderState): Order[] => {
    return orders.filter(order => order.estado === estado);
}

// Función para obtener el siguiente ID disponible
export const obtenerSiguienteIdOrder = (): number => {
    const orders = getOrders();
    if (!orders) return 1;

    const ordersArray = JSON.parse(orders) as Order[];
    if (ordersArray.length === 0) return 1;

    const maxId = Math.max(...ordersArray.map((o) => Number(o.id) || 0)); 

    return maxId + 1;
}
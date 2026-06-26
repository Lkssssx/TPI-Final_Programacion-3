import type { ICategory } from "../types/category";
import type { Order } from "../types/order";
import type { CartItem, Product } from "../types/product";
import type { User } from "../types/user";

// Carrito
export const saveCart = (cartItems: CartItem[]): void => {
  localStorage.setItem("userCart", JSON.stringify(cartItems));
};

export const getCartItems = () => {
  return localStorage.getItem("userCart");
};

export const removeCartItem = () => {
  localStorage.removeItem("userCart");
};

// Productos
export const getProducts = (): string | null => {
  return localStorage.getItem("products");
};

export const saveProducts = (products: Product[]): void => {
  localStorage.setItem("products", JSON.stringify(products));
};

export const removeProducts = () => {
  localStorage.removeItem("products");
};

// Usuarios
export const getUsers = (): string | null => {
  return localStorage.getItem("users");
}

export const saveUsers = (users: User[]): void => {
  localStorage.setItem("users", JSON.stringify(users));
};

export const removeUsers = () => {
  localStorage.removeItem("users");
};

// Usuario actual
export const saveActualUser = (user: User) => {
  localStorage.setItem("actualUser", JSON.stringify(user));
}

export const getActualUser = (): string | null => {
  return localStorage.getItem("actualUser");
}

export const removeActualUser = () => {
  localStorage.removeItem("actualUser");
}

// Pedidos
export const getOrders = (): string | null => {
  return localStorage.getItem("orders");
}

export const saveOrders = (orders: Order[]) => {
  localStorage.setItem("orders", JSON.stringify(orders));
}

export const removeOrders = () => {
  localStorage.removeItem("orders");
}

// Categorias
export const getCategories = (): string | null => {
    return localStorage.getItem("categories");
};

export const saveCategories = (categories: ICategory[]): void => {
    localStorage.setItem("categories", JSON.stringify(categories));
};

export const removeCategories = () => {
    localStorage.removeItem("categories");
};
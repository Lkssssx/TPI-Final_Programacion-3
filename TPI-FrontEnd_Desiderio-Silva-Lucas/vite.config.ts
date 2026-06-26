import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    sourcemap: false, // Desactiva los source maps en build para evitar errores
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        
        storeHome: resolve(__dirname, 'src/pages/store/home/home.html'),
        storeCart: resolve(__dirname, 'src/pages/store/cart/cart.html'),
        authLogin: resolve(__dirname, 'src/pages/auth/login/login.html'),
        authRegister: resolve(__dirname, 'src/pages/auth/register/register.html'),
        orders: resolve(__dirname, 'src/pages/client/orders/orders.html'),
        productDetails: resolve(__dirname, 'src/pages/store/productDetail/productDetail.html'),
        adminHome: resolve(__dirname, 'src/pages/admin/adminHome/adminHome.html'),
        adminCategories: resolve(__dirname, 'src/pages/admin/categories/adminCategories.html'),
        adminOrders: resolve(__dirname, 'src/pages/admin/orders/adminOrders.html'),
        adminProducts: resolve(__dirname, 'src/pages/admin/products/adminProducts.html')

      },
    },
  },
  css: {
    devSourcemap: false  // Desactiva los source maps de CSS en dev para evitar errores
  },
  base: "./"
});
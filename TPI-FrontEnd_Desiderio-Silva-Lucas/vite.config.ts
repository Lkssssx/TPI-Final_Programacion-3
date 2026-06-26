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
        productDetails: resolve(__dirname, 'src/pages/store/productDetails/productDetails.html')

      },
    },
  },
  css: {
    devSourcemap: false  // Desactiva los source maps de CSS en dev para evitar errores
  },
  base: "./"
});
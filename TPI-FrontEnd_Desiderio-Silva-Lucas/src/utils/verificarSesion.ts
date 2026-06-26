import type { User } from "../types/user";
import { getActualUser } from "./localStorage";

export const verificarSesion = () => {
    const pathname = window.location.pathname;
    const isAuthPage = pathname.includes("/auth/login") || pathname.includes("/auth/register");
    const isStoreClientPage = pathname.includes("/store") || pathname.includes("/client");

    if (getActualUser() != null) {
        const actualUser: User = JSON.parse(getActualUser()!);
        
        if (actualUser.rol === "USUARIO") {
            // Si intenta entrar a una página de admin o a una página de /auth, que se mande al home
            if (pathname.includes('/admin') || isAuthPage) {
                window.location.href = '/src/pages/store/home/home.html';
            }
            return; // Sino, no hacemos nada
        } else if (actualUser.rol === "ADMIN") {

            if (isStoreClientPage && document.querySelector("#li-admin")) {
                const liAdmin = document.querySelector("#li-admin") as HTMLLIElement;
                liAdmin.innerHTML = `<a class="nav-item" href="/src/pages/admin/adminHome/adminHome.html"><i class="fa-solid fa-chart-pie"></i> Dashboard</a>`
                liAdmin.hidden = false;
            }

            if (!isAuthPage) return;
            window.location.href = '/src/pages/admin/adminHome/adminHome.html';

        } else {
            if (isAuthPage) return;
            window.location.href = '/src/pages/auth/login/login.html';
        }
    } else {
        if (isAuthPage) return;
        window.location.href = '/src/pages/auth/login/login.html';
    }
}


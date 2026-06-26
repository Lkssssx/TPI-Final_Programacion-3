import { verificarSesion } from "../../../utils/verificarSesion";
import { searchUserByEmail } from "../../../types/user";
import { fetchUsuarios } from "../../../utils/fetchs";
import { saveActualUser } from "../../../utils/localStorage";
import { mostrarResultado } from "../../../utils/mostrarResultado";

// Verificamos si ya está logueado
verificarSesion()

// Selectores del DOM para el formulario de Login
const loginForm = document.querySelector(".login-form") as HTMLFormElement;
const emailInput = document.querySelector("#email") as HTMLInputElement;
const passwordInput = document.querySelector("#password") as HTMLInputElement;
const errorMensaje = document.querySelector(".error-mensaje") as HTMLSpanElement;



// Se asegura de que existan usuarios en el LocalStorage al cargar la página
async function inicializarUsuarios() {
    try {
        if (!localStorage.getItem("users")) {
            const usuariosIniciales = await fetchUsuarios();
            localStorage.setItem("users", JSON.stringify(usuariosIniciales));
        }
    } catch (e) {
        console.error("Error al solicitar los usuarios: " + e);
    }
}

// Escuchamos el envío del formulario
if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault()

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Validación de campos requeridos
        if (!email || !password) {
            mostrarResultado(false, "", "Todos los campos son obligatorios.", errorMensaje);
            return;
        }

        // Buscar usuario
        const usuario = searchUserByEmail(email);

        // Validar credenciales
        if (usuario === null || usuario.password !== password) {
            mostrarResultado(false, "", "Email o contraseña incorrectos.", errorMensaje);
            return;
        }

        // Guardar usuario y redirigir
        saveActualUser(usuario);

        if (usuario.rol === "ADMIN") {
            window.location.href = "/src/pages/admin/adminHome/adminHome.html";
        } else {
            window.location.href = "/src/pages/store/home/home.html";
        }
    });
}

// Inicializamos los datos de manera segura cuando el DOM esté listo
inicializarUsuarios();

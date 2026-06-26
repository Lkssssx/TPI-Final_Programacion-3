import { verificarSesion } from "../../../utils/verificarSesion";
import type { User } from "../../../types/user";
import { saveActualUser } from "../../../utils/localStorage";
import { obtenerSiguienteIdUser } from "../../../types/user";
import { mostrarResultado } from "../../../utils/mostrarResultado";

// Verificamos si está logueado
verificarSesion();

// Selectores del DOM
const registerForm = document.querySelector(".register-form") as HTMLFormElement;
const nombreInput = document.querySelector("#nombre") as HTMLInputElement;
const apellidoInput = document.querySelector("#apellido") as HTMLInputElement;
const emailInput = document.querySelector("#email") as HTMLInputElement;
const celularInput = document.querySelector("#celular") as HTMLInputElement;
const passwordInput = document.querySelector("#password") as HTMLInputElement;
const errorMensaje = document.querySelector(".error-mensaje") as HTMLSpanElement;


// Función para validar que el email no esté registrado
function emailYaExiste(email: string): boolean {
    const users = localStorage.getItem("users");
    if (!users) return false;

    const usuariosArray = JSON.parse(users) as User[];
    return usuariosArray.some((u) => u.mail === email);
}

// Escuchar el envío del formulario
if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const nombre = nombreInput.value.trim();
        const apellido = apellidoInput.value.trim();
        const email = emailInput.value.trim();
        const celular = celularInput.value.trim();
        const password = passwordInput.value.trim();

        // Validaciones
        if (!nombre || !apellido || !email || !celular || !password) {
            mostrarResultado(false, "", "Todos los campos son obligatorios.", errorMensaje)
            return;
        }

        if (password.length < 6) {
            mostrarResultado(false, "", "La contraseña debe tener al menos 6 caracteres.", errorMensaje);
            return;
        }

        if (emailYaExiste(email)) {
            mostrarResultado(false, "", "Este email ya está registrado.", errorMensaje);
            return;
        }


        // Crear nuevo usuario
        const nuevoUsuario: User = {
            id: obtenerSiguienteIdUser(),
            nombre,
            apellido,
            mail: email,
            celular,
            rol: "USUARIO", // Por defecto, nuevo usuario es USUARIO
            password,
        };

        // Agregar usuario a localStorage
        const users = localStorage.getItem("users");
        const usuariosArray = users ? JSON.parse(users) : [];
        usuariosArray.push(nuevoUsuario);
        localStorage.setItem("users", JSON.stringify(usuariosArray));

        // Guardar como usuario actual
        saveActualUser(nuevoUsuario);

        // Mostrar éxito
        mostrarResultado(true, "¡Registro exitoso! Redirigiendo...", "", errorMensaje);
        verificarSesion();
    });
}


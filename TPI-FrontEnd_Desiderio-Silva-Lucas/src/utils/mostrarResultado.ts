export const mostrarResultado = (exito: boolean, mensajeExito: string, mensajeFracaso: string, elemento: HTMLElement) => {
    clearTimeout(Number(elemento.dataset.timeout));
    elemento.classList.remove("visible", "correctly-added", "not-added");

    // Por si no tiene la clase result, le facilitamos su clase de estilos
    elemento.classList.add("result")

    const mensaje = exito ? mensajeExito : mensajeFracaso;
    if (!mensaje) return; // Si el mensaje del caso actual está vacío, no hacemos nada

    setTimeout(() => {
        elemento.innerText = mensaje;
        elemento.classList.add(exito ? "correctly-added" : "not-added", "visible");

        elemento.dataset.timeout = String(setTimeout(() => {
            elemento.classList.remove("visible");
            setTimeout(() => {
                elemento.innerText = "";
                elemento.classList.remove("correctly-added", "not-added");
            }, 100);
        }, 3000));
    }, 100);
};
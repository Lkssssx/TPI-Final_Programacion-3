package com.tp.jpa.util;

import com.tp.jpa.model.enums.Estado;
import com.tp.jpa.model.enums.FormaPago;
import com.tp.jpa.model.enums.Rol;

import java.util.Scanner;

/**
 * Utilidad global y completa para la gestión y validación de entrada de datos por consola.
 *
 * <p>Esta clase encapsula un único flujo de {@link Scanner} para hilos de entrada estándar (System.in)
 * y provee métodos estáticos fuertemente tipados. A diferencia de las lecturas convencionales,
 * implementa un mecanismo de <b>programación defensiva</b> mediante bucles de reintentos infinitos
 * y captura de excepciones (como {@link NumberFormatException}), garantizando que el flujo del
 * programa no se interrumpa ante ingresos inválidos por parte del usuario.</p>
 *
 * <p><b>Nota de diseño:</b> Todos los métodos numéricos realizan un saneamiento previo del búfer
 * mediante {@link String#trim()} para evitar fallos por espacios colaterales involuntarios.</p>
 *
 * <p><b>Ejemplo de uso:</b></p>
 * <pre>{@code
 * // No requiere instanciación (métodos estáticos)
 * int edad         = Input.scanInt("Ingrese su edad: ");
 * double precio    = Input.scanDouble("Ingrese el precio: ");
 * boolean esValido = Input.scanBoolean("¿Confirmar operación? (si/no): ");
 * String nombre    = Input.scanString("Nombre (Enter para omitir): ");
 * }</pre>
 *
 * @see Scanner
 * @see NumberFormatException
 */
public class Input {

    private static final Scanner sc = new Scanner(System.in);

    public static int scanInt(String mensaje) {
        while (true) {
            try {
                System.out.print(mensaje);
                return Integer.parseInt(sc.nextLine().trim());
            } catch (NumberFormatException e) {
                System.out.print("Error: Ingrese un número de tipo int válido: ");
            }
        }
    }

    public static long scanLong(String mensaje) {
        while (true) {
            try {
                System.out.print(mensaje);
                return Long.parseLong(sc.nextLine().trim());
            } catch (NumberFormatException e) {
                System.out.print("Error: Ingrese un número de tipo Long válido: ");
            }
        }
    }

    public static double scanDouble(String mensaje) {
        while (true) {
            try {
                System.out.print(mensaje);
                return Double.parseDouble(sc.nextLine().trim());
            } catch (NumberFormatException e) {
                System.out.print("Error: Ingrese un número de tipo double válido: ");
            }
        }
    }

    public static float scanFloat(String mensaje) {
        while (true) {
            try {
                System.out.print(mensaje);
                return Float.parseFloat(sc.nextLine().trim());
            } catch (NumberFormatException e) {
                System.out.print("Error: Ingrese un número de tipo float válido: ");
            }
        }
    }

    public static boolean scanBoolean(String mensaje) {
        while (true) {
            System.out.print(mensaje);
            String input = sc.nextLine().trim().toLowerCase();
            if (input.equals("true") || input.equals("si")) {
                return true;
            }
            if (input.equals("false") || input.equals("no")) {
                return false;
            }
            System.out.print("Error: Ingrese 'true' o 'false' (o 'si'/'no'): ");
        }
    }

    public static char scanChar(String mensaje) {
        while (true) {
            System.out.print(mensaje);
            String input = sc.nextLine();
            if (!input.isEmpty()) {
                return input.charAt(0);
            }
            System.out.print("Error: El campo no puede estar vacío. Ingrese un carácter: ");
        }
    }

    // Sin bucle porque admite valores vacíos
    public static String scanString(String mensaje) {
        System.out.print(mensaje);
        return sc.nextLine();
    }

    public static Rol scanRol(String mensaje) {
        while (true) {
            System.out.print(mensaje);
            String input = sc.nextLine().trim().toUpperCase();
            try {
                return Rol.valueOf(input);
            } catch (IllegalArgumentException e) {
                System.out.println("Error: Ingrese un rol válido (ADMIN / USUARIO).");
            }
        }
    }

    public static FormaPago scanFormaPago(String mensaje) {
        while (true) {
            System.out.print(mensaje);
            String input = sc.nextLine().trim().toUpperCase();
            try {
                return FormaPago.valueOf(input);
            } catch (IllegalArgumentException e) {
                System.out.println("Error: Ingrese una forma de pago válida (TARJETA / TRANSFERENCIA / EFECTIVO).");
            }
        }
    }

    public static Estado scanEstado(String mensaje) {
        while (true) {
            System.out.print(mensaje);
            String input = sc.nextLine().trim().toUpperCase();
            try {
                return Estado.valueOf(input);
            } catch (IllegalArgumentException e) {
                System.out.println("Error: Ingrese un estado válido (PENDIENTE / CONFIRMADO / TERMINADO / CANCELADO).");
            }
        }
    }

}

package com.tp.jpa.model.DTOs;

import com.tp.jpa.model.Pedido;


import java.util.Set;

public record UsuarioDTO(
    String nombre,
    String apellido,
    String mail,
    String celular,
    Set<Pedido> pedidos
) {

}

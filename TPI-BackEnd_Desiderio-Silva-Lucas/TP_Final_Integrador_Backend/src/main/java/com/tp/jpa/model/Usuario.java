package com.tp.jpa.model;


import com.tp.jpa.model.enums.Rol;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.HashSet;
import java.util.Set;

@SuperBuilder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(callSuper = true)
@EqualsAndHashCode(of = {"mail"}, callSuper = false)
@Entity
public class Usuario extends Base {
    private String nombre;
    private String apellido;
    @Column(unique = true)
    private String mail;
    private String celular;
    @Getter(AccessLevel.NONE)
    @ToString.Exclude
    private String contraseña;
    @Enumerated(EnumType.STRING)
    private Rol rol;
    @Builder.Default
    @OneToMany(cascade = {CascadeType.PERSIST, CascadeType.REFRESH, CascadeType.MERGE}) // Como oneToMany usa el fetch eficiente por default, no le asigno ninguno
    @JoinColumn(name = "usuario_id")
    @ToString.Exclude
    private Set<Pedido> pedidos = new HashSet<>();


    public void addPedido(Pedido ped) {
        pedidos.add(ped);
        System.out.println("Pedido añadido correctamente");

    }

    public void removePedido(Pedido ped) {
        pedidos.remove(ped);
        System.out.println("Pedido eliminado correctamente");
    }


}

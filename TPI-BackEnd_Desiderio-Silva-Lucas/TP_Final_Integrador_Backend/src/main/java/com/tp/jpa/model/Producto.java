package com.tp.jpa.model;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.*;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(callSuper = true)
@EqualsAndHashCode(of = {"nombre"}, callSuper = false)
@Entity
public class Producto extends Base {
    @Column(unique = true)  // Pongo el nombre como unico dado que se usa en el equals y hashcode, y puede ser propenso a repetidos
    private String nombre;
    private Double precio;
    private String descripcion;
    private int stock;
    private String imagen;
    private Boolean disponible;

}

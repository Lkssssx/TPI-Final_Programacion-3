package com.tp.jpa.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;


import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(of = {"nombre"}, callSuper = false)
@Entity
@ToString(callSuper = true)
public class Categoria extends Base {
    private String nombre;
    private String descripcion;
    @Builder.Default
    @OneToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH})
    @JoinColumn(name = "categoría_id")
    @ToString.Exclude
    private Set<Producto> productos = new HashSet<>();


    public void addProducto(Producto prod) {
        if (prod != null && !productos.contains(prod)) {
            productos.add(prod);
            System.out.println("Producto añadido correctamente");

        }
    }

    public void removeProducto(Producto prod) {
        if (prod != null && productos.contains(prod)) {
            productos.remove(prod);
            System.out.println("Producto eliminado correctamente");
        }
    }


}

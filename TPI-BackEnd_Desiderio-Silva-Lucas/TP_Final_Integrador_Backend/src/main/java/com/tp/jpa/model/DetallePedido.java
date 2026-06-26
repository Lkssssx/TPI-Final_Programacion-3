package com.tp.jpa.model;


import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;


@SuperBuilder
@Getter
@Setter
@NoArgsConstructor
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = false)
@Entity
public class DetallePedido extends Base {
    private int cantidad;
    private Double subtotal;
    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.REFRESH, CascadeType.MERGE})
    @JoinColumn(nullable = false, name = "producto_id")
    private Producto producto;

    public DetallePedido(int cantidad, Producto producto) {
        super();
        this.subtotal = producto.getPrecio() * cantidad;
        this.cantidad = cantidad;
        this.producto = producto;
    };

}

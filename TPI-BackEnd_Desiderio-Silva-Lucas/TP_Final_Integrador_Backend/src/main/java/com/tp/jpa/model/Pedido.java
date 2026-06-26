package com.tp.jpa.model;


import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import com.tp.jpa.model.enums.Estado;
import com.tp.jpa.model.enums.FormaPago;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;


@SuperBuilder
@Getter
@Setter
@NoArgsConstructor
@ToString(callSuper = true)
@EqualsAndHashCode(of = {"fecha", "estado", "formaPago"}, callSuper = false)
@Entity
public class Pedido extends Base implements Calculable {
    @Builder.Default
    private LocalDateTime fecha = LocalDateTime.now();
    @Enumerated(EnumType.STRING)
    private Estado estado;
    private Double total;
    @Enumerated(EnumType.STRING)
    private FormaPago formaPago;
    @Builder.Default
    @OneToMany(cascade = {CascadeType.PERSIST, CascadeType.REFRESH, CascadeType.MERGE})
    @JoinColumn(name = "pedido_id")
    @ToString.Exclude
    private Set<DetallePedido> detallesPedidos = new HashSet<>();


    public void addDetallePedido(int cantidad, Producto producto) {
        if (detallesPedidos.add(new DetallePedido(cantidad, producto))) {
            calcularTotal();
            System.out.println("Detalle añadido correctamente");
        };
    }

    public DetallePedido findDetallePedidoByProducto(Producto producto) {

        for (DetallePedido detPedido : detallesPedidos) {
            if (detPedido.getProducto().equals(producto)) {
                return detPedido;
            }
        }
        System.out.println("Detalle de pedido no encontrado");
        return null;
    }

    public void removeDetallePedidoByProducto(Producto producto) {
        if (detallesPedidos.remove(findDetallePedidoByProducto(producto))) {
            calcularTotal();
            System.out.println("Detalle eliminado correctamente");
        };
    }

    @Override
    public void calcularTotal() {
        this.total = detallesPedidos.stream()
                .map(a -> a.getSubtotal())
                .reduce(0D, (a, b) -> a + b);
    }
}

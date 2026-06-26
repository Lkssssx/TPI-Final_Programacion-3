package com.tp.jpa.repository;

import com.tp.jpa.model.DetallePedido;
import com.tp.jpa.model.Pedido;
import com.tp.jpa.model.enums.Estado;
import com.tp.jpa.util.JPAUtil;
import jakarta.persistence.EntityManager;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class PedidoRepository extends BaseRepository<Pedido> {

    public PedidoRepository() {
        super(Pedido.class);
    }

    public List<Pedido> buscarPorEstado(Estado estado) {
        try (EntityManager em =JPAUtil.getEntityManagerFactory().createEntityManager()) {
            // Consulta JPQL: retorna todos los pedidos activos con un estado específico
            // Útil para filtrar PENDIENTE, CONFIRMADO, TERMINADO o CANCELADO
            String jpql = "SELECT p FROM Pedido p WHERE p.estado = :estado AND p.eliminado = false";
            List<Pedido> q = em.createQuery(jpql, Pedido.class)
                    .setParameter("estado", estado)
                    .getResultList();

            return q;

        } catch (Error e) {
            System.out.println("Erro al buscar por estado: " + e.getMessage());
        }
        return Collections.emptyList();
    }

    // Función añadida para manejar los detalles de los pedidos en tipo lazy cómodamente
    public Pedido buscarDetallesPedidoPorPedido(Pedido pedido) {

        try (EntityManager em = JPAUtil.getEntityManagerFactory().createEntityManager()) {

            // Consulta JPQL: retorna todos los elementos (incluido los detalles) de un pedido dado.
            // Se selecciona el Pedido completo con JOIN FETCH sobre p.detallesPedidos,
            // forzando la carga de la colección lazy en una sola consulta.
            // Se filtra por el id del pedido (parámetro nombrado :pedidoId) y
            // por p.eliminado = false para excluir las bajas lógicas.
            String jpql = "SELECT p FROM Pedido p LEFT JOIN FETCH p.detallesPedidos dp WHERE p.id = :pedidoId AND p.eliminado = false";

            Pedido q = em.createQuery(jpql, Pedido.class).setParameter("pedidoId", pedido.getId()).getSingleResult();

            return q;

        } catch (Error e) {
            System.out.println("Error al buscar Pedido Con Detalles por Pedido: " + e.getMessage());
        }
        return new Pedido(); // Si no encuentra devuelve un pedido vacío
    }
}

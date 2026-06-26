package com.tp.jpa.repository;

import com.tp.jpa.model.Categoria;
import com.tp.jpa.model.Producto;
import com.tp.jpa.util.JPAUtil;
import jakarta.persistence.EntityManager;

import java.util.Collections;
import java.util.List;

public class CategoriaRepository extends BaseRepository<Categoria> {
    public CategoriaRepository() {
        super(Categoria.class);
    }

    // Misma función que en productos (redundante, pero el trabajo lo pide agregar acá cuando ya lo tenía en ProductoRepository)
    public List<Producto> buscarProductosPorCategoria(Long categoriaId) {
        try (EntityManager em = JPAUtil.getEntityManagerFactory().createEntityManager()) { // Uso try-with-resources, que es más corto que usar un finally

            // Consulta JPQL: retorna los productos activos de una categoría.
            // Como la relación es unidireccional y Categoria es la dueña, se // navega desde Categoria hacia
            // su colección c.productos mediante JOIN.
            // Se filtra por el id de la categoría (parámetro nombrado :catId) y
            // por p.eliminado = false para excluir las bajas lógicas.
            String jpql = "SELECT p FROM Categoria c JOIN c.productos p WHERE c.id = :catId AND p.eliminado = false";
            List<Producto> q = em.createQuery(jpql, Producto.class)
                    .setParameter("catId", categoriaId)
                    .getResultList();

            // Devolvemos el resultado de la query
            return q;

        } catch (Error e) {
            System.out.println("Error al buscar producto por categoria: " + e.getMessage());
        }
        return Collections.emptyList(); // Si no encuentra devuelve una colección vacía
    }
}

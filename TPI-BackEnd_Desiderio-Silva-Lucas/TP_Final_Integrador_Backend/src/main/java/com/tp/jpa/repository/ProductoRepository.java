package com.tp.jpa.repository;


import com.tp.jpa.model.Producto;
import com.tp.jpa.util.JPAUtil;
import jakarta.persistence.EntityManager;

import java.util.Collections;
import java.util.List;

public class ProductoRepository extends BaseRepository<Producto> {

    public ProductoRepository() {
        super(Producto.class);
    }

    public List<Producto> buscarPorCategoria(Long categoriaId) {
        EntityManager em = JPAUtil.getEntityManagerFactory().createEntityManager();

        try {
            // La consulta JPQL busca en Categoria (clase dueña) con un JOIN a Producto (clase no dueña) y devuelve el producto que
            // coincida con el ID que se le pasa como argumento a la función, y que no esté eliminado lógicamente.
            List<Producto> lista = em.createQuery("SELECT p FROM Categoria c JOIN c.productos p WHERE c.id = :categoriaId AND p.eliminado = :eliminado", Producto.class)
                    .setParameter("categoriaId", categoriaId)
                    .setParameter("eliminado", false)
                    .getResultList();
            return lista;
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            em.close();
        }
        return Collections.emptyList();
    }

}

package com.tp.jpa.repository;

import com.tp.jpa.model.Pedido;
import com.tp.jpa.model.Usuario;
import com.tp.jpa.util.JPAUtil;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.TypedQuery;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

public class UsuarioRepository extends BaseRepository<Usuario> {
    private final EntityManagerFactory emf;  // Acá lo declaramos porque lo vamos a usar más de una vez

    public UsuarioRepository() {
        super(Usuario.class);
        emf = JPAUtil.getEntityManagerFactory();
    }


    public Optional<Usuario> buscarPorMail(String mail) {

        try (EntityManager em = emf.createEntityManager() ) {

            // Consulta JPQL: busca un usuario activo por su dirección de correo electrónico
            // Retorna Optional para manejar el caso en que el mail no esté registrado
            String jpql = "SELECT u FROM Usuario u WHERE u.mail = :mail AND u.eliminado = false";
            TypedQuery<Usuario> q = em.createQuery(jpql, Usuario.class);
                q.setParameter("mail", mail);

            List<Usuario> res = q.getResultList();

            return res.isEmpty() ? Optional.empty() : Optional.of(res.get(0));

        } catch (Error e) {
            System.out.println("Error al buscar por mail: " + e.getMessage());
        }
        return Optional.empty();
    }

    public List<Pedido> buscarPedidosPorUsuario(Long idUsuario) {
        try  (EntityManager em = emf.createEntityManager() ) {
            // Consulta JPQL: retorna los pedidos activos de un usuario.
            // Como la relación es unidireccional y Usuario es el dueño, se navega
            // desde Usuario hacia su colección u.pedidos mediante JOIN.
            // Se filtra por el id del usuario (:uid) y por p.eliminado = false
            // para excluir las bajas lógicas.
            String jpql = "SELECT p FROM Usuario u JOIN u.pedidos p WHERE u.id = :uid AND p.eliminado = false";
            List<Pedido> q = em.createQuery(jpql, Pedido.class)
                    .setParameter("uid", idUsuario)
                    .getResultList();
            return q;
        } catch (Exception e) {
            System.out.println("Error al buscar pedidos por usuario: " + e.getMessage());
        }
        return Collections.emptyList();
    }

}

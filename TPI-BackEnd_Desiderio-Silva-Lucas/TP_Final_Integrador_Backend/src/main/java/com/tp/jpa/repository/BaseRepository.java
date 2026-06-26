package com.tp.jpa.repository;

import com.tp.jpa.model.Base;
import com.tp.jpa.util.JPAUtil;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

public abstract class BaseRepository<T extends Base> {

    private EntityManagerFactory emf;
    private final Class<T> clase;

    public BaseRepository(Class<T> clase) {
        this.clase = clase;
        this.emf = JPAUtil.getEntityManagerFactory();
    }

    /**
     * Guarda o actualiza una entidad en la base de datos gestionando la transacción de JPA.
     * Si la entidad tiene un ID nulo, utiliza persist() para crear un nuevo registro.
     * Si la entidad ya posee un ID, utiliza merge() para actualizar el registro existente.
     *
     * @param objeto La entidad del tipo {@link T} que se desea guardar o actualizar.
     * @return La entidad guardada o actualizada con su estado sincronizado.
     */
    public T guardar(T objeto) {
        EntityManager em = emf.createEntityManager();

        try {
            em.getTransaction().begin();
            if (objeto.getId() == null) {
                em.persist(objeto);
            }  else {
                em.merge(objeto);
            }

            em.getTransaction().commit();

        } catch (Exception e) {
            if (em.getTransaction().isActive()) {
                em.getTransaction().rollback();
            }
            e.printStackTrace();
        } finally {
            em.close();
        }
        return objeto;
    }

    /**
     * Busca y recupera una entidad directamente desde la base de datos utilizando su clave primaria.
     * Hace uso del método find() del EntityManager.
     *
     * @param id El identificador único (clave primaria) de la entidad a buscar.
     * @return Un {@link Optional} que contiene la entidad si fue encontrada, o un Optional vacío si no existe o si ocurre un error.
     */
    public Optional<T> buscarPorId(Long id) {
        EntityManager em = emf.createEntityManager();

        try {
            return Optional.ofNullable(em.find(clase, id));
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            em.close();
        }
        return Optional.empty();
    }


    /**
     * Recupera una lista de todas las entidades que no han sido dadas de baja lógicamente.
     * Ejecuta una consulta JPQL filtrando aquellos registros donde el atributo 'eliminado' sea falso.
     *
     * @return Una {@link List} de entidades activas. Retorna una lista vacía si no hay coincidencias o si falla la consulta.
     */
    public List<T> listarActivos() {
        EntityManager em = emf.createEntityManager();

        try {
            List<T> lista = em.createQuery("SELECT objeto FROM " + clase.getSimpleName() + " objeto WHERE objeto.eliminado = :eliminado")
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

    /**
     * Realiza un borrado lógico de la entidad indicada, cambiando su estado a 'eliminado'.
     * La entidad es recuperada y pasa a estado gestionado (managed). Mediante el "Dirty Checking"
     * de JPA, al cambiar el valor con setEliminado(true), el UPDATE se genera automáticamente al hacer commit.
     *
     * @param id El identificador único de la entidad que se desea dar de baja.
     * @return {@code true} si la entidad fue encontrada y el borrado lógico se aplicó correctamente; {@code false} en caso contrario o si ocurre un error.
     */
    public boolean eliminarLogico(Long id) {
        EntityManager em = emf.createEntityManager();

        try {
            em.getTransaction().begin();
            // Lo buscamos de nuevo porque si usaramos el buscarPorId habría un conflicto entre los EntityManager
            Optional<T> encontrado = Optional.ofNullable(em.find(clase, id));

            encontrado.ifPresent(objeto -> {
                objeto.setEliminado(true);
                // No hacemos merge porque está en gestionado gracias al dirty checking
            });

            em.getTransaction().commit();
            return encontrado.isPresent();
        } catch (Exception e) {
            if (em.getTransaction().isActive()) {
                em.getTransaction().rollback();
            }
            e.printStackTrace();
        } finally {
            em.close();
        }
        return false;
    }

}
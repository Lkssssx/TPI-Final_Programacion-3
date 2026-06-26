package com.tp.jpa.model;


import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Getter
@Setter
@ToString
@MappedSuperclass // Ya que es una clase abstracta y solo se usa para generar lo básico
public abstract class Base {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long id;
    @Builder.Default
    private Boolean eliminado = false;
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

}

package com.pastoral.social.demo.adapters.dao.persistence;

import com.pastoral.social.demo.adapters.dao.entities.CategoriaEntity;
import com.pastoral.social.demo.adapters.dao.transaction.TransacionalPersistence;
import com.pastoral.social.demo.application.dto.CategoriaDTO;
import com.pastoral.social.demo.application.port.out.CategoriaRepository;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Slf4j
public class CategoriaDAO implements CategoriaRepository {
    private final TransacionalPersistence<CategoriaEntity> persistence;

    public CategoriaDAO(final TransacionalPersistence<CategoriaEntity> persistence) {
        this.persistence = Objects.requireNonNull(persistence);
    }

    @Override
    public List<CategoriaDTO> listCategoria() {
        final String SQL = "SELECT * from tps_categoria";
        final List<CategoriaEntity> categoriaEntityList = this.persistence.find(SQL);
        return categoriaEntityList.stream()
                .map(item -> CategoriaDTO.builder()
                        .idCategoria(item.getIdCategoria())
                        .descricao(item.getCategoriaDescricao())
                        .build())
                .collect(Collectors.toList());
    }
}

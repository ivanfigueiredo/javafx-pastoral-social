package com.pastoral.social.demo.adapters.dao.persistence;

import com.pastoral.social.demo.adapters.dao.entities.UnidadeMedidaEntity;
import com.pastoral.social.demo.adapters.dao.transaction.TransacionalPersistence;
import com.pastoral.social.demo.application.dto.UnidadeMedidaDTO;
import com.pastoral.social.demo.application.port.out.UnidadeDeMedidasRepository;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Slf4j
public class UnidadeDeMedidasDAO implements UnidadeDeMedidasRepository {
    private final TransacionalPersistence<UnidadeMedidaEntity> persistence;

    public UnidadeDeMedidasDAO(final TransacionalPersistence<UnidadeMedidaEntity> persistence) {
        this.persistence = Objects.requireNonNull(persistence);
    }

    @Override
    public List<UnidadeMedidaDTO> list() {
        final String SQL = "SELECT * from tps_unidade_medida";
        final List<UnidadeMedidaEntity> unidadeMedidaEntityList = this.persistence.find(SQL);
        return unidadeMedidaEntityList.stream()
                .map(item -> UnidadeMedidaDTO.builder()
                        .idUND(item.getIdUnidadeMedida())
                        .descricao(item.getUnidadeMedidasDesc())
                        .build())
                .collect(Collectors.toList());
    }
}

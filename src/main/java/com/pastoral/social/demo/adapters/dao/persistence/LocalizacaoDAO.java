package com.pastoral.social.demo.adapters.dao.persistence;

import com.pastoral.social.demo.adapters.dao.entities.LocalizacaoEstoqueEntity;
import com.pastoral.social.demo.adapters.dao.transaction.TransacionalPersistence;
import com.pastoral.social.demo.application.dto.LocalizacaoDTO;
import com.pastoral.social.demo.application.port.out.LocalizacaoRepository;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Slf4j
public class LocalizacaoDAO implements LocalizacaoRepository {
    private final TransacionalPersistence<LocalizacaoEstoqueEntity> persistence;

    public LocalizacaoDAO(final TransacionalPersistence<LocalizacaoEstoqueEntity> persistence) {
        this.persistence = Objects.requireNonNull(persistence);
    }

    @Override
    public List<LocalizacaoDTO> listLocalizacao() {
        final String SQL = "SELECT * from tps_localizacao_estoque";
        final List<LocalizacaoEstoqueEntity> localizacaoEstoqueEntityList = this.persistence.find(SQL);
        return localizacaoEstoqueEntityList.stream()
                .map(item -> LocalizacaoDTO.builder()
                        .idLocalizacao(item.getIdLocalizacao())
                        .descricao(item.getDescricao())
                        .build())
                .collect(Collectors.toList());
    }
}

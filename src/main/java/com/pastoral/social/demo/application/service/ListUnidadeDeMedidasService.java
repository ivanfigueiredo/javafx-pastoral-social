package com.pastoral.social.demo.application.service;

import com.pastoral.social.demo.application.dto.UnidadeMedidaDTO;
import com.pastoral.social.demo.application.port.in.ListUnidadeDeMedidasUseCase;
import com.pastoral.social.demo.application.port.out.UnidadeDeMedidasRepository;

import java.util.List;
import java.util.Objects;

public class ListUnidadeDeMedidasService implements ListUnidadeDeMedidasUseCase {
    private final UnidadeDeMedidasRepository unidadeDeMedidasRepository;

    public ListUnidadeDeMedidasService(final UnidadeDeMedidasRepository unidadeDeMedidasRepository) {
        this.unidadeDeMedidasRepository = Objects.requireNonNull(unidadeDeMedidasRepository);
    }

    @Override
    public List<UnidadeMedidaDTO> execute() {
        return this.unidadeDeMedidasRepository.list();
    }
}

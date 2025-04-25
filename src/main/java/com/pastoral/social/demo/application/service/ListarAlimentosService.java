package com.pastoral.social.demo.application.service;

import com.pastoral.social.demo.application.dto.ListarAlimentosDTO;
import com.pastoral.social.demo.application.port.in.ListarAlimentosUseCase;
import com.pastoral.social.demo.application.port.out.EstoqueRepository;

import java.util.List;
import java.util.Objects;

public class ListarAlimentosService implements ListarAlimentosUseCase {
    private final EstoqueRepository estoqueRepository;

    public ListarAlimentosService(final EstoqueRepository estoqueRepository) {
        this.estoqueRepository = Objects.requireNonNull(estoqueRepository);
    }

    @Override
    public List<ListarAlimentosDTO> execute() {
        return this.estoqueRepository.find();
    }
}

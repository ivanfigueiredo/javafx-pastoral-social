package com.pastoral.social.demo.application.service;

import com.pastoral.social.demo.application.port.in.ExcluirAlimentoUseCase;
import com.pastoral.social.demo.application.port.out.EstoqueRepository;
import lombok.extern.slf4j.Slf4j;

import java.util.Objects;

@Slf4j
public class ExcluirAlimentoService implements ExcluirAlimentoUseCase {
    private final EstoqueRepository estoqueRepository;

    public ExcluirAlimentoService(final EstoqueRepository estoqueRepository) {
        this.estoqueRepository = Objects.requireNonNull(estoqueRepository);
    }

    @Override
    public void execute(final Integer idAlimento) {
       this.estoqueRepository.delete(idAlimento);
    }
}

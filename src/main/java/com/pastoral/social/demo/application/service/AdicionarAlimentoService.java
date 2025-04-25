package com.pastoral.social.demo.application.service;

import com.pastoral.social.demo.application.dto.AdicionarAlimentoDTO;
import com.pastoral.social.demo.application.port.in.AdicionarAlimentoUseCase;
import com.pastoral.social.demo.application.port.out.EstoqueRepository;
import com.pastoral.social.demo.application.port.out.UnitOfWork;

import java.util.Objects;

public class AdicionarAlimentoService implements AdicionarAlimentoUseCase {
    private final UnitOfWork unitOfWork;
    private final EstoqueRepository estoqueRepository;

    public AdicionarAlimentoService(final UnitOfWork unitOfWork, final EstoqueRepository estoqueRepository) {
        this.unitOfWork = Objects.requireNonNull(unitOfWork);
        this.estoqueRepository = Objects.requireNonNull(estoqueRepository);
    }

    @Override
    public void execute(AdicionarAlimentoDTO dto) {
        try {
            this.unitOfWork.startTransaction();
            this.estoqueRepository.save(dto);
            this.unitOfWork.commit();
        } catch (Exception e) {
            System.out.println(e.getMessage());
            this.unitOfWork.rollback();
        }
    }
}

package com.pastoral.social.demo.application.service;

import com.pastoral.social.demo.application.dto.AtualizarAlimentoDTO;
import com.pastoral.social.demo.application.exceptions.InternalServerErrorException;
import com.pastoral.social.demo.application.exceptions.SQLExecutionException;
import com.pastoral.social.demo.application.exceptions.TransactionCommitException;
import com.pastoral.social.demo.application.exceptions.TransactionStartException;
import com.pastoral.social.demo.application.port.in.AtualizarAlimentoUseCase;
import com.pastoral.social.demo.application.port.out.EstoqueRepository;
import com.pastoral.social.demo.application.port.out.UnitOfWork;
import lombok.extern.slf4j.Slf4j;

import java.util.Objects;

@Slf4j
public class AtualizarAlimentoService implements AtualizarAlimentoUseCase {
    private final UnitOfWork unitOfWork;
    private final EstoqueRepository estoqueRepository;

    public AtualizarAlimentoService(final UnitOfWork unitOfWork, final EstoqueRepository estoqueRepository) {
        this.unitOfWork = Objects.requireNonNull(unitOfWork);
        this.estoqueRepository = Objects.requireNonNull(estoqueRepository);
    }

    @Override
    public void execute(final AtualizarAlimentoDTO dto) {
        try {
            this.unitOfWork.startTransaction();
            this.estoqueRepository.update(dto);
            this.unitOfWork.commit();
        } catch (TransactionStartException e) {
            log.error(e.getMessage(), e);
            throw new InternalServerErrorException("Erro interno do servidor. Se o erro persistir, entre em contato com o suporte");
        } catch (TransactionCommitException | SQLExecutionException e) {
            log.error(e.getMessage(), e);
            this.unitOfWork.rollback();
            throw new InternalServerErrorException("Erro interno do servidor. Se o erro persistir, entre em contato com o suporte");
        }
    }
}

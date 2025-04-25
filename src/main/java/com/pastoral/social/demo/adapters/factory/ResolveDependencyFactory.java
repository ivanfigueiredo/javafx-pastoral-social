package com.pastoral.social.demo.adapters.factory;

import com.pastoral.social.demo.adapters.dao.entities.CategoriaEntity;
import com.pastoral.social.demo.adapters.dao.entities.EstoqueEntity;
import com.pastoral.social.demo.adapters.dao.entities.LocalizacaoEstoqueEntity;
import com.pastoral.social.demo.adapters.dao.entities.UnidadeMedidaEntity;
import com.pastoral.social.demo.adapters.dao.persistence.CategoriaDAO;
import com.pastoral.social.demo.adapters.dao.persistence.EstoqueDAO;
import com.pastoral.social.demo.adapters.dao.persistence.LocalizacaoDAO;
import com.pastoral.social.demo.adapters.dao.persistence.UnidadeDeMedidasDAO;
import com.pastoral.social.demo.adapters.dao.transaction.Transacional;
import com.pastoral.social.demo.application.exceptions.InternalServerErrorException;
import com.pastoral.social.demo.application.port.in.*;
import com.pastoral.social.demo.application.service.*;
import lombok.extern.slf4j.Slf4j;

import java.sql.SQLException;

@Slf4j
public final class ResolveDependencyFactory {
    private ResolveDependencyFactory() {}

    public static AdicionarAlimentoUseCase createAdicionarAlimentoUseCase() {
        try {
            final Transacional<EstoqueEntity> transacional = new Transacional<>(EstoqueEntity.class);
            final EstoqueDAO estoqueDAO = new EstoqueDAO(transacional);
            return new AdicionarAlimentoService(transacional, estoqueDAO);
        } catch (SQLException e) {
            log.error(e.getMessage(), e);
            throw new InternalServerErrorException("Erro Interno Servidor");
        }
    }

    public static ListUnidadeDeMedidasUseCase createListUnidadeDeMedidasUseCase() {
        try {
            final Transacional<UnidadeMedidaEntity> transacional = new Transacional<>(UnidadeMedidaEntity.class);
            final UnidadeDeMedidasDAO unidadeDeMedidasDAO = new UnidadeDeMedidasDAO(transacional);
            return new ListUnidadeDeMedidasService(unidadeDeMedidasDAO);
        } catch (SQLException e) {
            log.error(e.getMessage(), e);
            throw new InternalServerErrorException("Erro Interno Servidor");
        }
    }

    public static ListCategoriaUseCase createListCategoriaUseCase() {
        try {
            final Transacional<CategoriaEntity> transacional = new Transacional<>(CategoriaEntity.class);
            final CategoriaDAO categoriaDAO = new CategoriaDAO(transacional);
            return new ListCategoriaService(categoriaDAO);
        } catch (SQLException e) {
            log.error(e.getMessage(), e);
            throw new InternalServerErrorException("Erro Interno Servidor");
        }
    }

    public static ListLocalizacaoUseCase createListLocalizacaoUseCase() {
        try {
            final Transacional<LocalizacaoEstoqueEntity> transacional = new Transacional<>(LocalizacaoEstoqueEntity.class);
            final LocalizacaoDAO localizacaoDAO = new LocalizacaoDAO(transacional);
            return new ListLocalizacaoService(localizacaoDAO);
        } catch (SQLException e) {
            log.error(e.getMessage(), e);
            throw new InternalServerErrorException("Erro Interno Servidor");
        }
    }
}

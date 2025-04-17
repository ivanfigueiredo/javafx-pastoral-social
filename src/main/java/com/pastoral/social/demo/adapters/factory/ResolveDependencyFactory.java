package com.pastoral.social.demo.adapters.factory;

import com.pastoral.social.demo.adapters.dao.AlimentoDAO;
import com.pastoral.social.demo.adapters.dao.ComboBoxDAO;
import com.pastoral.social.demo.adapters.dao.DAO;
import com.pastoral.social.demo.adapters.dao.EstoqueDAO;
import com.pastoral.social.demo.adapters.dao.transaction.Transacional;
import com.pastoral.social.demo.application.port.in.AdicionarAlimentoUseCase;
import com.pastoral.social.demo.application.port.in.ListComboBoxUseCase;
import com.pastoral.social.demo.application.port.in.TestUseCase;
import com.pastoral.social.demo.application.service.AdicionarAlimentoService;
import com.pastoral.social.demo.application.service.ListComboBoxUseCaseService;
import com.pastoral.social.demo.application.service.TestService;

import java.sql.Connection;
import java.sql.SQLException;

public final class ResolveDependencyFactory {
    private static final DAO dao = new DAO();

    private ResolveDependencyFactory() {}

    public static TestUseCase createTestUseCase() {
        final AlimentoDAO alimentoDAO = new AlimentoDAO(dao);
        return new TestService(alimentoDAO);
    }

    public static AdicionarAlimentoUseCase createAdicionarAlimentoUseCase() {
        try {
            final Connection conn = dao.getConnection();
            final Transacional transacional = new Transacional(conn);
            final EstoqueDAO estoqueDAO = new EstoqueDAO(conn);
            return new AdicionarAlimentoService(transacional, estoqueDAO);
        } catch (SQLException e) {
            throw new RuntimeException("Erro Interno Servidor");
        }
    }

    public static ListComboBoxUseCase createListComboBoxUseCase() {
        final ComboBoxDAO comboBoxDAO = new ComboBoxDAO(dao);
        return new ListComboBoxUseCaseService(comboBoxDAO);
    }
}

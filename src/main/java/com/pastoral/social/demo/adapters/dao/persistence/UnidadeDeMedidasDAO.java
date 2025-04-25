package com.pastoral.social.demo.adapters.dao.persistence;

import com.pastoral.social.demo.adapters.dao.DAO;
import com.pastoral.social.demo.adapters.dao.entities.LocalizacaoEstoqueEntity;
import com.pastoral.social.demo.adapters.dao.entities.UnidadeMedidaEntity;
import com.pastoral.social.demo.adapters.dao.transaction.TransacionalPersistence;
import com.pastoral.social.demo.application.dto.UnidadeMedidaDTO;
import com.pastoral.social.demo.application.port.out.UnidadeDeMedidasRepository;
import lombok.extern.slf4j.Slf4j;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
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
//        try(Connection conn = dao.getConnection();
//            PreparedStatement ps = conn.prepareStatement(SQL);
//            ResultSet rs = ps.executeQuery()
//        ) {
//            final List<UnidadeMedidaDTO> listUND = new ArrayList<>();
//            while (rs.next()) {
//                final UnidadeMedidaDTO unidadeMedidaDTO = UnidadeMedidaDTO.builder()
//                        .idUND(rs.getInt(1))
//                        .descricao(rs.getString(2))
//                        .build();
//                listUND.add(unidadeMedidaDTO);
//            }
//            return listUND;
//        } catch (SQLException e) {
//            log.error(e.getMessage(), e);
//            return new ArrayList<UnidadeMedidaDTO>();
//        }
    }
}

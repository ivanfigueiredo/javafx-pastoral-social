package com.pastoral.social.demo.adapters.dao.persistence;

import com.pastoral.social.demo.adapters.dao.DAO;
import com.pastoral.social.demo.adapters.dao.entities.CategoriaEntity;
import com.pastoral.social.demo.adapters.dao.entities.LocalizacaoEstoqueEntity;
import com.pastoral.social.demo.adapters.dao.transaction.TransacionalPersistence;
import com.pastoral.social.demo.application.dto.CategoriaDTO;
import com.pastoral.social.demo.application.port.out.CategoriaRepository;
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
public class CategoriaDAO implements CategoriaRepository {
    private final TransacionalPersistence<CategoriaEntity> persistence;

    public CategoriaDAO(final TransacionalPersistence<CategoriaEntity> persistence) {
        this.persistence = Objects.requireNonNull(persistence);
    }

    @Override
    public List<CategoriaDTO> listCategoria() {
        final String SQL = "SELECT * from tps_categoria";
        final List<CategoriaEntity> categoriaEntityList = this.persistence.find(SQL);
        return categoriaEntityList.stream()
                .map(item -> CategoriaDTO.builder()
                        .idCategoria(item.getIdCategoria())
                        .descricao(item.getCategoriaDescricao())
                        .build())
                .collect(Collectors.toList());
//        try(Connection conn = dao.getConnection();
//            PreparedStatement ps = conn.prepareStatement(SQL);
//            ResultSet rs = ps.executeQuery()
//        ) {
//            final List<CategoriaDTO> categoriaDTOList = new ArrayList<>();
//            while (rs.next()) {
//                final CategoriaDTO categoriaDTO = CategoriaDTO.builder()
//                        .idCategoria(rs.getInt(1))
//                        .descricao(rs.getString(2))
//                        .build();
//                categoriaDTOList.add(categoriaDTO);
//            }
//            return categoriaDTOList;
//        } catch (SQLException e) {
//            log.error(e.getMessage(), e);
//            return new ArrayList<CategoriaDTO>();
//        }
    }
}

package com.pastoral.social.demo.adapters.dao;

import com.pastoral.social.demo.application.AdicionarAlimentoDTO;
import com.pastoral.social.demo.application.port.out.EstoqueRepository;

import java.sql.*;
import java.time.LocalDateTime;
import java.util.Objects;

public class EstoqueDAO implements EstoqueRepository {
    private final Connection conn;

    public EstoqueDAO(final Connection conn) {
        this.conn = Objects.requireNonNull(conn);
    }

    @Override
    public void save(AdicionarAlimentoDTO dto) {
        final String SQL = "INSERT INTO \"TPS_ESTOQUE_ALIMENTOS\" (id_categoria, marca, validade, id_localizacao, item_na_validade, id_und_medida, data_entrada, data_saida) VALUES (?,?,?,?,?,?,?,?)";
        final boolean PRODUTO_NA_VALIDADE = true;
        try(PreparedStatement ps = conn.prepareStatement(SQL)) {
            ps.setInt(1, dto.getIdCategoria());
            ps.setString(2, dto.getMarca());
            ps.setDate(3, Date.valueOf(dto.getValidade()));
            ps.setInt(4, dto.getIdLocalizacao());
            ps.setBoolean(5, PRODUTO_NA_VALIDADE);
            ps.setInt(6, dto.getIdUndMedida());
            ps.setTimestamp(7, Timestamp.valueOf(LocalDateTime.now()));
            ps.setTimestamp(8, Timestamp.valueOf(LocalDateTime.now()));
            ps.executeUpdate();
        } catch (SQLException e) {
            System.out.println(e.getMessage());
            throw new RuntimeException("Erro interno");
        }
    }
}

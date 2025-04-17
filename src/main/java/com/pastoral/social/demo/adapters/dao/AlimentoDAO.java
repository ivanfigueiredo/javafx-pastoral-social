package com.pastoral.social.demo.adapters.dao;

import com.pastoral.social.demo.application.port.out.AlimentoRepository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AlimentoDAO implements AlimentoRepository {
    private final DAO dao;

    public AlimentoDAO(final DAO dao) {
        this.dao = dao;
    }

    public List<Object> findListUnidadeMedidads() {
        final String SQL = "SELECT * FROM \"TPS_UNIDADE_MEDIDA\"";
        try(Connection conn = dao.getConnection();
            PreparedStatement ps = conn.prepareStatement(SQL);
            ResultSet rs = ps.executeQuery()
        ) {
            final List<Object> listObj = new ArrayList<>();
            while (rs.next()) {
                Map<String, String> map = new HashMap<>();
                map.put("id", rs.getString("id"));
                map.put("unidadeMedidas", rs.getString("und_medidas"));
                listObj.add(map);
            }
            return listObj;
        } catch (SQLException e) {
            System.out.println(e.getMessage());
            return new ArrayList<>();
        }
    }
}

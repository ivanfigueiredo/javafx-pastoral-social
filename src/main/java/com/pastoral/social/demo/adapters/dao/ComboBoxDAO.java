package com.pastoral.social.demo.adapters.dao;

import com.pastoral.social.demo.application.ComboBoxOptionsDTO;
import com.pastoral.social.demo.application.port.out.ComboBoxRepository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class ComboBoxDAO implements ComboBoxRepository {
    private final DAO dao;

    public ComboBoxDAO(final DAO dao) {
        this.dao = dao;
    }

    @Override
    public List<ComboBoxOptionsDTO> listComboBox() {
        final String SQL = "select * from tps_config_combobox tcc left join tps_config_combobox_department tccd on tcc.id_department = tccd.id_department";
        try(Connection conn = dao.getConnection();
            PreparedStatement ps = conn.prepareStatement(SQL);
            ResultSet rs = ps.executeQuery()
        ) {
            final List<ComboBoxOptionsDTO> comboBoxOptionsDTOList = new ArrayList<>();
            while (rs.next()) {
                final ComboBoxOptionsDTO comboBoxOptionsDTO = ComboBoxOptionsDTO.builder()
                        .idComboBox(rs.getInt("id_combobox"))
                        .valorItem(rs.getString("valor_item"))
                        .deparmento(
                                ComboBoxOptionsDTO.Deparmento.builder()
                                        .idDeparmento(rs.getInt("id_department"))
                                        .deparmento(rs.getString("department"))
                                        .build()
                        )
                        .build();
                comboBoxOptionsDTOList.add(comboBoxOptionsDTO);
            }
            return comboBoxOptionsDTOList;
        } catch (SQLException e) {
            System.out.println(e.getMessage());
            return new ArrayList<>();
        }
    }
}

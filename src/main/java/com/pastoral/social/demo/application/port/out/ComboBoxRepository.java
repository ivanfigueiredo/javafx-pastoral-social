package com.pastoral.social.demo.application.port.out;

import com.pastoral.social.demo.application.ComboBoxOptionsDTO;

import java.util.List;

public interface ComboBoxRepository {
    List<ComboBoxOptionsDTO> listComboBox();
}

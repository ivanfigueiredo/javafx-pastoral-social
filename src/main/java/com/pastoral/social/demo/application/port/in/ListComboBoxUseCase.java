package com.pastoral.social.demo.application.port.in;

import com.pastoral.social.demo.application.ComboBoxOptionsDTO;

import java.util.List;

public interface ListComboBoxUseCase {
    List<ComboBoxOptionsDTO> execute();
}

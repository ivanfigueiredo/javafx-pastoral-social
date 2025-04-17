package com.pastoral.social.demo.application.service;

import com.pastoral.social.demo.application.port.out.ComboBoxRepository;
import com.pastoral.social.demo.application.ComboBoxOptionsDTO;
import com.pastoral.social.demo.application.port.in.ListComboBoxUseCase;

import java.util.List;
import java.util.Objects;

public class ListComboBoxUseCaseService implements ListComboBoxUseCase {
    private final ComboBoxRepository comboBoxRepository;

    public ListComboBoxUseCaseService(final ComboBoxRepository comboBoxRepository) {
        this.comboBoxRepository = Objects.requireNonNull(comboBoxRepository);
    }

    @Override
    public List<ComboBoxOptionsDTO> execute() {
        return this.comboBoxRepository.listComboBox();
    }
}

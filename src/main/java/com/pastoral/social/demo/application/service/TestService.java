package com.pastoral.social.demo.application.service;

import com.pastoral.social.demo.application.port.in.TestUseCase;
import com.pastoral.social.demo.application.port.out.AlimentoRepository;

import java.util.List;
import java.util.Objects;

public class TestService implements TestUseCase {
    private final AlimentoRepository alimentoRepository;

    public TestService(final AlimentoRepository alimentoRepository) {
        this.alimentoRepository = Objects.requireNonNull(alimentoRepository);
    }

    @Override
    public List<Object> execute() {
        return alimentoRepository.findListUnidadeMedidads();
    }
}

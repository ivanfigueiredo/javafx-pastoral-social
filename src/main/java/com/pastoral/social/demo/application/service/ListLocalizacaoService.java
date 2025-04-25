package com.pastoral.social.demo.application.service;

import com.pastoral.social.demo.application.dto.LocalizacaoDTO;
import com.pastoral.social.demo.application.port.in.ListLocalizacaoUseCase;
import com.pastoral.social.demo.application.port.out.LocalizacaoRepository;

import java.util.List;
import java.util.Objects;

public class ListLocalizacaoService implements ListLocalizacaoUseCase {
    private final LocalizacaoRepository localizacaoRepository;

    public ListLocalizacaoService(final LocalizacaoRepository localizacaoRepository) {
        this.localizacaoRepository = Objects.requireNonNull(localizacaoRepository);
    }

    @Override
    public List<LocalizacaoDTO> execute() {
        return this.localizacaoRepository.listLocalizacao();
    }
}

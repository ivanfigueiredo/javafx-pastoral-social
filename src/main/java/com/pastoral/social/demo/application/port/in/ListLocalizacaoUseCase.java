package com.pastoral.social.demo.application.port.in;

import com.pastoral.social.demo.application.dto.LocalizacaoDTO;

import java.util.List;

public interface ListLocalizacaoUseCase {
    List<LocalizacaoDTO> execute();
}

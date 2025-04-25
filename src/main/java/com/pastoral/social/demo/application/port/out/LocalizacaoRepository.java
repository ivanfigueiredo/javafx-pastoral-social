package com.pastoral.social.demo.application.port.out;

import com.pastoral.social.demo.application.dto.LocalizacaoDTO;

import java.util.List;

public interface LocalizacaoRepository {
    List<LocalizacaoDTO> listLocalizacao();
}

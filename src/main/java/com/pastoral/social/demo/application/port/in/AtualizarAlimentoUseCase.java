package com.pastoral.social.demo.application.port.in;

import com.pastoral.social.demo.application.dto.AtualizarAlimentoDTO;

public interface AtualizarAlimentoUseCase {
    void execute(AtualizarAlimentoDTO dto);
}

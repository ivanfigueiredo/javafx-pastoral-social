package com.pastoral.social.demo.application.port.in;

import com.pastoral.social.demo.application.dto.AdicionarAlimentoDTO;

public interface AdicionarAlimentoUseCase {
    void execute(AdicionarAlimentoDTO dto);
}

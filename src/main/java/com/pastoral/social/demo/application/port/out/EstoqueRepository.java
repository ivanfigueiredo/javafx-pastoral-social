package com.pastoral.social.demo.application.port.out;

import com.pastoral.social.demo.application.AdicionarAlimentoDTO;

public interface EstoqueRepository {
    void save(AdicionarAlimentoDTO dto);
}

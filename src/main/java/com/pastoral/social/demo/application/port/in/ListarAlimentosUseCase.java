package com.pastoral.social.demo.application.port.in;

import com.pastoral.social.demo.application.dto.ListarAlimentosDTO;

import java.util.List;

public interface ListarAlimentosUseCase {
    List<ListarAlimentosDTO> execute();
}

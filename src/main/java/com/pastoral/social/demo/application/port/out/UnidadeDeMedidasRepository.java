package com.pastoral.social.demo.application.port.out;

import com.pastoral.social.demo.application.dto.UnidadeMedidaDTO;

import java.util.List;

public interface UnidadeDeMedidasRepository {
    List<UnidadeMedidaDTO> list();
}

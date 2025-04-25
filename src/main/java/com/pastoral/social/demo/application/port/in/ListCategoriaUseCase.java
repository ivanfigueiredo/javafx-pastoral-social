package com.pastoral.social.demo.application.port.in;

import com.pastoral.social.demo.application.dto.CategoriaDTO;

import java.util.List;

public interface ListCategoriaUseCase {
    List<CategoriaDTO> execute();
}

package com.pastoral.social.demo.application.port.out;

import com.pastoral.social.demo.application.dto.CategoriaDTO;

import java.util.List;

public interface CategoriaRepository {
    List<CategoriaDTO> listCategoria();
}

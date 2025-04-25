package com.pastoral.social.demo.application.service;

import com.pastoral.social.demo.application.dto.CategoriaDTO;
import com.pastoral.social.demo.application.port.in.ListCategoriaUseCase;
import com.pastoral.social.demo.application.port.out.CategoriaRepository;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Objects;

@Slf4j
public class ListCategoriaService implements ListCategoriaUseCase {
    private final CategoriaRepository categoriaRepository;

    public ListCategoriaService(final CategoriaRepository categoriaRepository) {
        this.categoriaRepository = Objects.requireNonNull(categoriaRepository);
    }

    @Override
    public List<CategoriaDTO> execute() {
        return categoriaRepository.listCategoria();
    }
}

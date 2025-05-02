package com.pastoral.social.demo.application.port.in;

import com.pastoral.social.demo.application.dto.ItemProdutoDTO;

import java.util.List;

public interface ListCategoriaUseCase {
    List<ItemProdutoDTO> execute();
}

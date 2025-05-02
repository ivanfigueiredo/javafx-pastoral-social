package com.pastoral.social.demo.application.port.out;

import com.pastoral.social.demo.application.dto.ItemProdutoDTO;

import java.util.List;

public interface CategoriaRepository {
    List<ItemProdutoDTO> listCategoria();
}

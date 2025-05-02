package com.pastoral.social.demo.adapters.dao.persistence;

import com.pastoral.social.demo.adapters.dao.entities.ItemProdutoEntity;
import com.pastoral.social.demo.adapters.dao.transaction.TransacionalPersistence;
import com.pastoral.social.demo.application.dto.ItemProdutoDTO;
import com.pastoral.social.demo.application.port.out.CategoriaRepository;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Slf4j
public class ItemProdutoDAO implements CategoriaRepository {
    private final TransacionalPersistence<ItemProdutoEntity> persistence;

    public ItemProdutoDAO(final TransacionalPersistence<ItemProdutoEntity> persistence) {
        this.persistence = Objects.requireNonNull(persistence);
    }

    @Override
    public List<ItemProdutoDTO> listCategoria() {
        final String SQL = "SELECT * from tps_item_produto";
        final List<ItemProdutoEntity> itemProdutoEntityList = this.persistence.find(SQL);
        return itemProdutoEntityList.stream()
                .map(item -> ItemProdutoDTO.builder()
                        .idItemProduto(item.getIdProduto())
                        .descricao(item.getProdutoDescricao())
                        .build())
                .collect(Collectors.toList());
    }
}

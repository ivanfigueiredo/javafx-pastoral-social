package com.pastoral.social.demo.adapters.dao.entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@EqualsAndHashCode(callSuper = true)
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ItemProdutoEntity extends EntityBase{
    @JsonProperty("id_produto")
    private Integer idProduto;
    @JsonProperty("item_produto_desc")
    private String produtoDescricao;
}

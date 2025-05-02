package com.pastoral.social.demo.application.dto;

import lombok.*;

@EqualsAndHashCode(callSuper = true)
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ItemProdutoDTO extends DataObjectTransferBase {
    private Integer idItemProduto;
    private String descricao;

    @Override
    public String toString() {
        return descricao;
    }
}

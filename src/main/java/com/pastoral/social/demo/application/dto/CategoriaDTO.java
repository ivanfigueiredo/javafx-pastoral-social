package com.pastoral.social.demo.application.dto;

import lombok.*;

@EqualsAndHashCode(callSuper = true)
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CategoriaDTO extends DataObjectTransferBase {
    private Integer idCategoria;
    private String descricao;
}

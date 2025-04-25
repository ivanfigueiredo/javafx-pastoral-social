package com.pastoral.social.demo.application.dto;

import lombok.*;

@EqualsAndHashCode(callSuper = true)
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UnidadeMedidaDTO extends DataObjectTransferBase {
    private Integer idUND;
    private String descricao;
}
